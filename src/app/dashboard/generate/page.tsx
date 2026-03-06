'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2, Sparkles, Download, Loader2, AlertCircle, Image as ImageIcon, Paintbrush } from 'lucide-react'

const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square', desc: 'Instagram Post' },
  { value: '16:9', label: 'Landscape', desc: 'YouTube, LinkedIn' },
  { value: '9:16', label: 'Portrait', desc: 'Stories, Reels' },
  { value: '4:5', label: 'Tall', desc: 'Instagram Feed' },
] as const

const PROMPT_STARTERS = [
  'Professional SaaS product mockup on gradient background',
  'Minimalist social media ad for a coffee brand, warm tones',
  'Tech startup hero image with abstract geometric shapes',
  'Clean product photography setup, white background, dramatic lighting',
  'Modern office workspace with laptop and plant, editorial style',
  'Bold typographic poster design, neon colors on dark background',
] as const

const DEMO_IMAGES = [
  { prompt: 'Abstract gradient background, purple to blue', url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient></defs><rect fill="url(#g)" width="512" height="512"/><text x="256" y="256" text-anchor="middle" fill="white" font-size="20" font-family="sans-serif" opacity="0.7">AI Generated Preview</text></svg>') },
  { prompt: 'Warm sunset gradient', url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><linearGradient id="g" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#EF4444"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect fill="url(#g)" width="512" height="512"/><text x="256" y="256" text-anchor="middle" fill="white" font-size="20" font-family="sans-serif" opacity="0.7">AI Generated Preview</text></svg>') },
  { prompt: 'Cool ocean gradient', url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#06B6D4"/><stop offset="100%" stop-color="#1E40AF"/></linearGradient></defs><rect fill="url(#g)" width="512" height="512"/><text x="256" y="256" text-anchor="middle" fill="white" font-size="20" font-family="sans-serif" opacity="0.7">AI Generated Preview</text></svg>') },
]

type GenerateState = 'idle' | 'generating' | 'done' | 'error'

export default function GeneratePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [state, setState] = useState<GenerateState>('idle')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkApi() {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'test' }),
        })
        setIsLive(res.status !== 503)
      } catch {
        setIsLive(false)
      }
    }
    checkApi()
  }, [])

  const generate = useCallback(async () => {
    if (!prompt.trim()) return
    setState('generating')
    setError(null)
    setImageUrl(null)

    try {
      if (isLive) {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: prompt.trim(), aspectRatio }),
        })
        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setImageUrl(data.imageUrl)
        setState('done')
      } else {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 2000))
        const demoIdx = Math.floor(Math.random() * DEMO_IMAGES.length)
        setImageUrl(DEMO_IMAGES[demoIdx].url)
        setState('done')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
      setState('error')
    }
  }, [prompt, aspectRatio, isLive])

  const handleDownload = useCallback(() => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = `imageforge-${Date.now()}.webp`
    a.click()
  }, [imageUrl])

  const handleEditInCanvas = useCallback(() => {
    if (!imageUrl) return
    // Store the generated image in sessionStorage so the editor can load it
    sessionStorage.setItem('imageforge-generated-image', imageUrl)
    sessionStorage.setItem('imageforge-generated-prompt', prompt)
    sessionStorage.setItem('imageforge-generated-aspect', aspectRatio)
    router.push('/dashboard/editor?source=generate')
  }, [imageUrl, prompt, aspectRatio, router])

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Wand2 size={24} style={{ color: 'var(--purple)' }} />
            AI Generate
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Describe what you want. AI creates it. Edit it in the canvas.
          </p>
        </div>
        {isLive === false && (
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: 'var(--amber-soft, rgba(245,158,11,0.1))', color: 'var(--amber, #F59E0B)' }}
          >
            Demo Mode -- Add REPLICATE_API_TOKEN to go live
          </span>
        )}
        {isLive === true && (
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}
          >
            AI Live
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div>
          {/* Prompt */}
          <div className="mb-5">
            <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Professional SaaS product mockup on gradient background..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none focus:outline-none"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            />
          </div>

          {/* Aspect Ratio */}
          <div className="mb-5">
            <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value)}
                  className="px-3 py-2 rounded-lg text-left text-xs transition-all"
                  style={{
                    background: aspectRatio === ar.value ? 'var(--purple-soft)' : 'var(--surface)',
                    border: `1px solid ${aspectRatio === ar.value ? 'var(--purple)' : 'var(--border)'}`,
                    color: aspectRatio === ar.value ? 'var(--purple)' : 'var(--text-secondary)',
                  }}
                >
                  <div className="font-bold">{ar.label}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{ar.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={!prompt.trim() || state === 'generating'}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: 'var(--gradient-primary)' }}
          >
            {state === 'generating' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Image
              </>
            )}
          </button>

          {/* Starter prompts */}
          <div className="mt-5">
            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              Try one of these:
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {PROMPT_STARTERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="text-[11px] px-2.5 py-1 rounded-full transition-all hover:scale-105"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  {p.length > 40 ? p.slice(0, 40) + '...' : p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div>
          <div
            className="rounded-xl overflow-hidden flex items-center justify-center"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              minHeight: 400,
              aspectRatio: aspectRatio.replace(':', '/'),
            }}
          >
            {state === 'idle' && !imageUrl && (
              <div className="text-center p-8">
                <ImageIcon size={48} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Your generated image will appear here
                </p>
              </div>
            )}
            {state === 'generating' && (
              <div className="text-center p-8">
                <Loader2 size={48} style={{ color: 'var(--purple)' }} className="mx-auto mb-3 animate-spin" />
                <p className="text-sm font-medium" style={{ color: 'var(--purple)' }}>
                  Creating your image...
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  This usually takes 5-10 seconds
                </p>
              </div>
            )}
            {state === 'error' && (
              <div className="text-center p-8">
                <AlertCircle size={48} style={{ color: 'var(--red, #EF4444)' }} className="mx-auto mb-3" />
                <p className="text-sm font-medium" style={{ color: 'var(--red, #EF4444)' }}>
                  {error}
                </p>
                <button
                  onClick={generate}
                  className="mt-3 text-xs px-4 py-2 rounded-lg font-medium"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  Try Again
                </button>
              </div>
            )}
            {imageUrl && state === 'done' && (
              <img
                src={imageUrl}
                alt={prompt}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Actions */}
          {imageUrl && state === 'done' && (
            <div className="space-y-3 mt-4">
              <button
                onClick={handleEditInCanvas}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Paintbrush size={14} />
                Edit in Canvas
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => { setState('idle'); setImageUrl(null) }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <Sparkles size={14} />
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
