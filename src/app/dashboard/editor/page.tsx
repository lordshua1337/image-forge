'use client'

import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Save,
  Type,
  Square,
  Image as ImageIcon,
  Trash2,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronDown,
} from 'lucide-react'
import { getTemplateById } from '@/lib/templates'
import { renderToCanvas, canvasToBlob, downloadBlob } from '@/lib/canvas/renderer'
import { PLATFORM_FORMATS, resizeCanvas } from '@/lib/canvas/platform-resize'
import { loadState, createCreation, updateCreation, getCreation, generateId } from '@/lib/state'
import type { TemplateLayer, Creation, CanvasState, BrandKit } from '@/lib/types'

export default function EditorWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>Loading editor...</div>}>
      <EditorPage />
    </Suspense>
  )
}

function EditorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateId = searchParams.get('template')
  const creationId = searchParams.get('id')
  const source = searchParams.get('source')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [layers, setLayers] = useState<TemplateLayer[]>([])
  const [canvasWidth, setCanvasWidth] = useState(1080)
  const [canvasHeight, setCanvasHeight] = useState(1080)
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(0.5)
  const [assets, setAssets] = useState<Record<string, HTMLImageElement>>({})
  const [title, setTitle] = useState('Untitled Creation')
  const [savedCreationId, setSavedCreationId] = useState<string | null>(creationId)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [uploadTargetLayerId, setUploadTargetLayerId] = useState<string | null>(null)
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null)

  // Load template, creation, or generated image
  useEffect(() => {
    if (creationId) {
      const creation = getCreation(creationId)
      if (creation) {
        setLayers([...creation.canvasState.layers] as TemplateLayer[])
        setCanvasWidth(creation.canvasState.width)
        setCanvasHeight(creation.canvasState.height)
        setTitle(creation.title)
        setSavedCreationId(creationId)
        return
      }
    }

    // Load generated image from AI Generate page
    if (source === 'generate') {
      const imgUrl = sessionStorage.getItem('imageforge-generated-image')
      const imgPrompt = sessionStorage.getItem('imageforge-generated-prompt') ?? 'AI Generated'
      const imgAspect = sessionStorage.getItem('imageforge-generated-aspect') ?? '1:1'

      if (imgUrl) {
        const [wRatio, hRatio] = imgAspect.split(':').map(Number)
        const baseSize = 1080
        const w = wRatio >= hRatio ? baseSize : Math.round(baseSize * (wRatio / hRatio))
        const h = hRatio >= wRatio ? baseSize : Math.round(baseSize * (hRatio / wRatio))

        setCanvasWidth(w)
        setCanvasHeight(h)
        setTitle(imgPrompt.slice(0, 40))

        const bgLayer: TemplateLayer = {
          id: 'bg',
          type: 'shape',
          bounds: { x: 0, y: 0, width: w, height: h },
          zIndex: 0,
          locked: false,
          shapeType: 'rect',
          shapeColor: '#000000',
        }
        const imgLayer: TemplateLayer = {
          id: 'generated-img',
          type: 'image',
          bounds: { x: 0, y: 0, width: w, height: h },
          zIndex: 1,
          locked: false,
          imageScaleMode: 'cover',
        }
        const headlineLayer: TemplateLayer = {
          id: 'headline',
          type: 'text',
          bounds: { x: 40, y: h - 160, width: w - 80, height: 100 },
          zIndex: 2,
          locked: false,
          textContent: 'Your Text Here',
          textStyle: {
            fontSize: 48,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: -1,
          },
          textAuto: {
            sizeToFit: true,
            minFontSize: 24,
            maxFontSize: 56,
            verticalAlign: 'middle',
          },
        }

        setLayers([bgLayer, imgLayer, headlineLayer])

        // Load the generated image as an asset
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          setAssets((prev) => ({ ...prev, 'generated-img': img }))
        }
        img.src = imgUrl

        // Clean up sessionStorage
        sessionStorage.removeItem('imageforge-generated-image')
        sessionStorage.removeItem('imageforge-generated-prompt')
        sessionStorage.removeItem('imageforge-generated-aspect')

        // Load brand kit and return early
        const appState = loadState()
        const kit = appState.brandKits.find((k) => k.isDefault) ?? appState.brandKits[0]
        if (kit) setBrandKit(kit)
        return
      }
    }

    if (templateId) {
      const template = getTemplateById(templateId)
      if (template) {
        setLayers([...template.layerConfig] as TemplateLayer[])
        setCanvasWidth(template.widthPx)
        setCanvasHeight(template.heightPx)
        setTitle(`${template.name} Creation`)
      }
    }

    // Load default brand kit
    const appState = loadState()
    const defaultKit = appState.brandKits.find((k) => k.isDefault) ?? appState.brandKits[0]
    if (defaultKit) setBrandKit(defaultKit)
  }, [templateId, creationId, source])

  // Render canvas whenever layers or assets change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || layers.length === 0) return

    renderToCanvas(canvas, {
      layers,
      width: canvasWidth,
      height: canvasHeight,
      assets,
    })
  }, [layers, canvasWidth, canvasHeight, assets])

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId) ?? null,
    [layers, selectedLayerId]
  )

  const handleLayerUpdate = useCallback(
    (layerId: string, updates: Partial<TemplateLayer>) => {
      setLayers((prev) =>
        prev.map((l) => (l.id === layerId ? { ...l, ...updates } : l))
      )
    },
    []
  )

  const handleTextUpdate = useCallback(
    (layerId: string, content: string) => {
      handleLayerUpdate(layerId, { textContent: content })
    },
    [handleLayerUpdate]
  )

  const handleColorUpdate = useCallback(
    (layerId: string, color: string) => {
      const layer = layers.find((l) => l.id === layerId)
      if (!layer) return
      if (layer.type === 'text' && layer.textStyle) {
        handleLayerUpdate(layerId, {
          textStyle: { ...layer.textStyle, color },
        })
      } else if (layer.type === 'shape') {
        handleLayerUpdate(layerId, { shapeColor: color })
      }
    },
    [layers, handleLayerUpdate]
  )

  const handleFontSizeUpdate = useCallback(
    (layerId: string, fontSize: number) => {
      const layer = layers.find((l) => l.id === layerId)
      if (!layer || layer.type !== 'text' || !layer.textStyle) return
      handleLayerUpdate(layerId, {
        textStyle: { ...layer.textStyle, fontSize },
      })
    },
    [layers, handleLayerUpdate]
  )

  const handleImageUpload = useCallback(
    (layerId: string, file: File) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        setAssets((prev) => ({ ...prev, [layerId]: img }))
      }
      img.src = url
    },
    []
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !uploadTargetLayerId) return
      handleImageUpload(uploadTargetLayerId, file)
      setUploadTargetLayerId(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [uploadTargetLayerId, handleImageUpload]
  )

  const handleDeleteLayer = useCallback(
    (layerId: string) => {
      setLayers((prev) => prev.filter((l) => l.id !== layerId))
      if (selectedLayerId === layerId) setSelectedLayerId(null)
    },
    [selectedLayerId]
  )

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current
    const thumbUrl = canvas ? canvas.toDataURL('image/jpeg', 0.5) : null

    const canvasState: CanvasState = {
      layers,
      width: canvasWidth,
      height: canvasHeight,
      zoom,
    }

    const now = new Date().toISOString()

    if (savedCreationId) {
      updateCreation(savedCreationId, {
        title,
        canvasState,
        thumbnailDataUrl: thumbUrl,
      })
    } else {
      const id = generateId('creation')
      createCreation({
        id,
        brandKitId: brandKit?.id ?? null,
        templateId: templateId ?? 'custom',
        title,
        description: null,
        campaignTag: null,
        canvasState,
        thumbnailDataUrl: thumbUrl,
        createdAt: now,
        updatedAt: now,
      })
      setSavedCreationId(id)
    }
  }, [layers, canvasWidth, canvasHeight, zoom, title, savedCreationId, templateId, brandKit])

  const handleExport = useCallback(
    async (format: 'png' | 'jpg' | 'webp') => {
      const canvas = canvasRef.current
      if (!canvas) return
      const blob = await canvasToBlob(canvas, format)
      const ext = format === 'jpg' ? 'jpg' : format
      downloadBlob(blob, `${title.toLowerCase().replace(/\s+/g, '-')}.${ext}`)
      setShowExportMenu(false)
    },
    [title]
  )

  const handlePlatformExport = useCallback(
    async (format: typeof PLATFORM_FORMATS[number]) => {
      const canvas = canvasRef.current
      if (!canvas) return

      // Re-render at full resolution
      const fullCanvas = document.createElement('canvas')
      renderToCanvas(fullCanvas, { layers, width: canvasWidth, height: canvasHeight, assets })

      const resized = resizeCanvas(fullCanvas, format.width, format.height)
      const blob = await canvasToBlob(resized, 'png')
      downloadBlob(blob, `${title.toLowerCase().replace(/\s+/g, '-')}-${format.label.toLowerCase().replace(/\s+/g, '-')}.png`)
      setShowExportMenu(false)
    },
    [layers, canvasWidth, canvasHeight, assets, title]
  )

  const textLayers = layers.filter((l) => l.type === 'text')
  const shapeLayers = layers.filter((l) => l.type === 'shape')
  const imageLayers = layers.filter((l) => l.type === 'image')

  return (
    <div className="flex h-[calc(100vh-49px)]">
      {/* Left Panel: Layers */}
      <div
        className="w-64 flex-shrink-0 overflow-y-auto"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
      >
        <div className="p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-medium mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={12} />
            Back to Templates
          </Link>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg text-sm font-bold mb-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />

          <h3 className="text-[10px] font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Layers ({layers.length})
          </h3>

          <div className="space-y-1">
            {[...layers].reverse().map((layer) => {
              const isSelected = selectedLayerId === layer.id
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerId(isSelected ? null : layer.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-all"
                  style={{
                    background: isSelected ? 'var(--purple-soft)' : 'transparent',
                    color: isSelected ? 'var(--purple)' : 'var(--text-secondary)',
                  }}
                >
                  {layer.type === 'text' && <Type size={12} />}
                  {layer.type === 'shape' && <Square size={12} />}
                  {layer.type === 'image' && <ImageIcon size={12} />}
                  <span className="truncate flex-1">
                    {layer.type === 'text'
                      ? layer.textContent?.slice(0, 20) ?? 'Text'
                      : layer.id}
                  </span>
                  {isSelected && (
                    <Trash2
                      size={11}
                      className="shrink-0 opacity-60 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteLayer(layer.id)
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg-alt)' }}>
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
              className="p-1.5 rounded transition-all hover:bg-[var(--surface)]"
            >
              <ZoomOut size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <span className="text-xs font-medium w-12 text-center" style={{ color: 'var(--text-secondary)' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
              className="p-1.5 rounded transition-all hover:bg-[var(--surface)]"
            >
              <ZoomIn size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button
              onClick={() => setZoom(0.5)}
              className="p-1.5 rounded transition-all hover:bg-[var(--surface)]"
            >
              <Maximize size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              <Save size={12} />
              Save
            </button>

            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:scale-105"
                style={{ background: 'var(--purple)' }}
              >
                <Download size={12} />
                Export
                <ChevronDown size={10} />
              </button>

              {showExportMenu && (
                <div
                  className="absolute right-0 top-full mt-1 w-56 rounded-xl p-2 z-50 max-h-80 overflow-y-auto"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <p className="text-[10px] font-bold uppercase px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                    Format
                  </p>
                  {(['png', 'jpg', 'webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExport(fmt)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all hover:bg-[var(--bg-alt)]"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Download as .{fmt.toUpperCase()}
                    </button>
                  ))}

                  <div className="my-1" style={{ borderTop: '1px solid var(--border)' }} />
                  <p className="text-[10px] font-bold uppercase px-2 py-1" style={{ color: 'var(--text-muted)' }}>
                    Platform Resize
                  </p>
                  {PLATFORM_FORMATS.map((fmt) => (
                    <button
                      key={`${fmt.platform}-${fmt.purpose}`}
                      onClick={() => handlePlatformExport(fmt)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all hover:bg-[var(--bg-alt)] flex items-center justify-between"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span>{fmt.label}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {fmt.width}x{fmt.height}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              boxShadow: '0 0 60px rgba(0,0,0,0.5)',
            }}
          >
            <canvas
              ref={canvasRef}
              className="block"
              style={{ borderRadius: 4 }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Properties */}
      <div
        className="w-72 flex-shrink-0 overflow-y-auto"
        style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
      >
        <div className="p-4">
          {!selectedLayer ? (
            <div className="text-center py-8">
              <Eye size={24} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Select a layer to edit its properties
              </p>
            </div>
          ) : selectedLayer.type === 'text' ? (
            <TextProperties
              layer={selectedLayer}
              brandKit={brandKit}
              onTextChange={(val) => handleTextUpdate(selectedLayer.id, val)}
              onColorChange={(val) => handleColorUpdate(selectedLayer.id, val)}
              onFontSizeChange={(val) => handleFontSizeUpdate(selectedLayer.id, val)}
              onFontFamilyChange={(val) => {
                if (selectedLayer.textStyle) {
                  handleLayerUpdate(selectedLayer.id, {
                    textStyle: { ...selectedLayer.textStyle, fontFamily: val },
                  })
                }
              }}
              onAlignChange={(val) => {
                if (selectedLayer.textStyle) {
                  handleLayerUpdate(selectedLayer.id, {
                    textStyle: { ...selectedLayer.textStyle, textAlign: val },
                  })
                }
              }}
              onWeightChange={(val) => {
                if (selectedLayer.textStyle) {
                  handleLayerUpdate(selectedLayer.id, {
                    textStyle: { ...selectedLayer.textStyle, fontWeight: val },
                  })
                }
              }}
            />
          ) : selectedLayer.type === 'shape' ? (
            <ShapeProperties
              layer={selectedLayer}
              brandKit={brandKit}
              onColorChange={(val) => handleColorUpdate(selectedLayer.id, val)}
            />
          ) : selectedLayer.type === 'image' ? (
            <ImageProperties
              layer={selectedLayer}
              onUpload={() => {
                setUploadTargetLayerId(selectedLayer.id)
                fileInputRef.current?.click()
              }}
              hasImage={!!assets[selectedLayer.id]}
            />
          ) : null}

          {/* Brand Kit Section */}
          {brandKit && (
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <h3 className="text-[10px] font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
                Brand Kit: {brandKit.name}
              </h3>
              <div className="flex gap-2">
                {[brandKit.primaryColor, brandKit.secondaryColor, brandKit.accentColor].map(
                  (color, i) => (
                    <div key={i} className="text-center">
                      <div
                        className="w-8 h-8 rounded-lg mb-1 cursor-pointer hover:scale-110 transition-all"
                        style={{ background: color, border: '1px solid var(--border)' }}
                        onClick={() => {
                          if (selectedLayerId) handleColorUpdate(selectedLayerId, color)
                        }}
                      />
                      <p className="text-[8px]" style={{ color: 'var(--text-muted)' }}>
                        {['Pri', 'Sec', 'Acc'][i]}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
      )}
    </div>
  )
}

// ─── Property Panels ───

function TextProperties({
  layer,
  brandKit,
  onTextChange,
  onColorChange,
  onFontSizeChange,
  onFontFamilyChange,
  onAlignChange,
  onWeightChange,
}: {
  layer: TemplateLayer
  brandKit: BrandKit | null
  onTextChange: (val: string) => void
  onColorChange: (val: string) => void
  onFontSizeChange: (val: number) => void
  onFontFamilyChange: (val: string) => void
  onAlignChange: (val: 'left' | 'center' | 'right') => void
  onWeightChange: (val: 'normal' | 'bold') => void
}) {
  const FONTS = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display', 'Lora', 'Raleway', 'Georgia', 'Courier New']

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold flex items-center gap-1.5">
        <Type size={14} style={{ color: 'var(--purple)' }} />
        Text Properties
      </h3>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Content
        </label>
        <textarea
          value={layer.textContent ?? ''}
          onChange={(e) => onTextChange(e.target.value)}
          rows={3}
          className="w-full px-2 py-1.5 rounded-lg text-xs resize-none"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
      </div>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Font Family
        </label>
        {brandKit && (
          <div className="flex gap-1 mb-1.5">
            {[brandKit.fontPrimary, brandKit.fontSecondary].filter(Boolean).map((f) => (
              <button
                key={f}
                onClick={() => onFontFamilyChange(f)}
                className="px-2 py-0.5 rounded text-[10px] font-medium transition-all"
                style={{
                  background: layer.textStyle?.fontFamily === f ? 'var(--purple-soft)' : 'var(--bg)',
                  color: layer.textStyle?.fontFamily === f ? 'var(--purple)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        )}
        <select
          value={layer.textStyle?.fontFamily ?? 'Inter'}
          onChange={(e) => onFontFamilyChange(e.target.value)}
          className="w-full px-2 py-1.5 rounded-lg text-xs"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Font Size: {layer.textStyle?.fontSize ?? 24}px
        </label>
        <input
          type="range"
          min="8"
          max="120"
          value={layer.textStyle?.fontSize ?? 24}
          onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
            Weight
          </label>
          <div className="flex gap-1">
            {(['normal', 'bold'] as const).map((w) => (
              <button
                key={w}
                onClick={() => onWeightChange(w)}
                className="flex-1 px-2 py-1 rounded text-[10px] font-medium transition-all"
                style={{
                  background: (layer.textStyle?.fontWeight === w || layer.textStyle?.fontWeight === (w === 'bold' ? '700' : '400')) ? 'var(--purple-soft)' : 'var(--bg)',
                  color: (layer.textStyle?.fontWeight === w || layer.textStyle?.fontWeight === (w === 'bold' ? '700' : '400')) ? 'var(--purple)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {w === 'bold' ? 'B' : 'N'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
            Align
          </label>
          <div className="flex gap-1">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                onClick={() => onAlignChange(a)}
                className="flex-1 px-1 py-1 rounded text-[10px] font-medium transition-all"
                style={{
                  background: layer.textStyle?.textAlign === a ? 'var(--purple-soft)' : 'var(--bg)',
                  color: layer.textStyle?.textAlign === a ? 'var(--purple)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {a[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Color
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={layer.textStyle?.color ?? '#ffffff'}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={layer.textStyle?.color ?? '#ffffff'}
            onChange={(e) => onColorChange(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg text-xs"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
      </div>
    </div>
  )
}

function ShapeProperties({
  layer,
  brandKit,
  onColorChange,
}: {
  layer: TemplateLayer
  brandKit: BrandKit | null
  onColorChange: (val: string) => void
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold flex items-center gap-1.5">
        <Square size={14} style={{ color: 'var(--purple)' }} />
        Shape Properties
      </h3>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Fill Color
        </label>
        {brandKit && (
          <div className="flex gap-1 mb-2">
            {[brandKit.primaryColor, brandKit.secondaryColor, brandKit.accentColor].map((c, i) => (
              <button
                key={i}
                onClick={() => onColorChange(c)}
                className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-all"
                style={{ background: c, border: '1px solid var(--border)' }}
                title={['Primary', 'Secondary', 'Accent'][i]}
              />
            ))}
          </div>
        )}
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={layer.shapeColor ?? '#000000'}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={layer.shapeColor ?? '#000000'}
            onChange={(e) => onColorChange(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg text-xs"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Type
        </label>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {layer.shapeType ?? 'rect'}
        </p>
      </div>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Position
        </label>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {layer.bounds.x}, {layer.bounds.y} -- {layer.bounds.width}x{layer.bounds.height}
        </p>
      </div>
    </div>
  )
}

function ImageProperties({
  layer,
  onUpload,
  hasImage,
}: {
  layer: TemplateLayer
  onUpload: () => void
  hasImage: boolean
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold flex items-center gap-1.5">
        <ImageIcon size={14} style={{ color: 'var(--purple)' }} />
        Image Properties
      </h3>

      <button
        onClick={onUpload}
        className="w-full py-3 rounded-lg text-xs font-medium transition-all hover:scale-[1.02]"
        style={{
          background: hasImage ? 'var(--green-soft)' : 'var(--purple-soft)',
          color: hasImage ? 'var(--green)' : 'var(--purple)',
          border: `1px dashed ${hasImage ? 'var(--green)' : 'var(--purple)'}`,
        }}
      >
        {hasImage ? 'Replace Image' : 'Upload Image'}
      </button>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Scale Mode
        </label>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {layer.imageScaleMode ?? 'cover'}
        </p>
      </div>

      <div>
        <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
          Dimensions
        </label>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {layer.bounds.width}x{layer.bounds.height}px
        </p>
      </div>
    </div>
  )
}
