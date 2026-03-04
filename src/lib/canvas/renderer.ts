import type { TemplateLayer, CanvasBounds, TextStyle, TextAuto } from '../types'

export interface RenderOptions {
  readonly layers: readonly TemplateLayer[]
  readonly width: number
  readonly height: number
  readonly assets?: Record<string, HTMLImageElement>
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = options.width
  canvas.height = options.height

  ctx.clearRect(0, 0, options.width, options.height)

  const sorted = [...options.layers].sort((a, b) => a.zIndex - b.zIndex)

  for (const layer of sorted) {
    switch (layer.type) {
      case 'shape':
        renderShape(ctx, layer)
        break
      case 'text':
        renderText(ctx, layer)
        break
      case 'image':
        renderImage(ctx, layer, options.assets)
        break
      case 'logo':
        break
    }
  }
}

function renderShape(ctx: CanvasRenderingContext2D, layer: TemplateLayer): void {
  const { bounds, shapeType, shapeColor, shapeStroke } = layer
  if (!bounds) return

  ctx.fillStyle = shapeColor ?? '#000000'

  if (shapeType === 'circle') {
    ctx.beginPath()
    ctx.arc(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
      Math.min(bounds.width, bounds.height) / 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
  } else {
    ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height)
  }

  if (shapeStroke) {
    ctx.strokeStyle = shapeStroke.color
    ctx.lineWidth = shapeStroke.width
    ctx.stroke()
  }
}

function renderText(ctx: CanvasRenderingContext2D, layer: TemplateLayer): void {
  const { bounds, textContent, textStyle, textAuto } = layer
  if (!bounds || !textContent || !textStyle) return

  let fontSize = textStyle.fontSize

  ctx.font = buildFont(textStyle, fontSize)

  if (textAuto?.sizeToFit) {
    const lines = textContent.split('\n')
    const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b), '')

    let metrics = ctx.measureText(longestLine)
    while (metrics.width > bounds.width && fontSize > (textAuto.minFontSize ?? 12)) {
      fontSize -= 1
      ctx.font = buildFont(textStyle, fontSize)
      metrics = ctx.measureText(longestLine)
    }
  }

  ctx.font = buildFont(textStyle, fontSize)
  ctx.fillStyle = textStyle.color
  ctx.textAlign = textStyle.textAlign

  if (textStyle.textShadow) {
    ctx.shadowColor = textStyle.textShadow.color
    ctx.shadowOffsetX = textStyle.textShadow.offsetX
    ctx.shadowOffsetY = textStyle.textShadow.offsetY
    ctx.shadowBlur = textStyle.textShadow.blurRadius
  }

  const lineHeight = fontSize * (textStyle.lineHeight ?? 1.2)
  const lines = textContent.split('\n')
  const totalTextHeight = lines.length * lineHeight

  let startY = bounds.y + fontSize
  if (textAuto?.verticalAlign === 'middle') {
    startY = bounds.y + (bounds.height - totalTextHeight) / 2 + fontSize
  } else if (textAuto?.verticalAlign === 'bottom') {
    startY = bounds.y + bounds.height - totalTextHeight + fontSize
  }

  let textX = bounds.x
  if (textStyle.textAlign === 'center') {
    textX = bounds.x + bounds.width / 2
  } else if (textStyle.textAlign === 'right') {
    textX = bounds.x + bounds.width
  }

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], textX, startY + i * lineHeight)
  }

  ctx.shadowColor = 'transparent'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 0
}

function renderImage(
  ctx: CanvasRenderingContext2D,
  layer: TemplateLayer,
  assets?: Record<string, HTMLImageElement>
): void {
  const { bounds, id } = layer
  if (!bounds) return

  const img = assets?.[id]
  if (!img) {
    ctx.fillStyle = '#2a2a3e'
    ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height)

    ctx.fillStyle = '#666680'
    ctx.font = '16px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      'Drop image here',
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2
    )
    return
  }

  const opacity = layer.imageOpacity ?? 1
  ctx.globalAlpha = opacity

  const mode = layer.imageScaleMode ?? 'cover'
  if (mode === 'cover') {
    const scale = Math.max(bounds.width / img.width, bounds.height / img.height)
    const w = img.width * scale
    const h = img.height * scale
    const x = bounds.x + (bounds.width - w) / 2
    const y = bounds.y + (bounds.height - h) / 2

    ctx.save()
    ctx.beginPath()
    ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height)
    ctx.clip()
    ctx.drawImage(img, x, y, w, h)
    ctx.restore()
  } else if (mode === 'contain') {
    const scale = Math.min(bounds.width / img.width, bounds.height / img.height)
    const w = img.width * scale
    const h = img.height * scale
    const x = bounds.x + (bounds.width - w) / 2
    const y = bounds.y + (bounds.height - h) / 2
    ctx.drawImage(img, x, y, w, h)
  } else {
    ctx.drawImage(img, bounds.x, bounds.y, bounds.width, bounds.height)
  }

  ctx.globalAlpha = 1
}

function buildFont(style: TextStyle, size: number): string {
  const weight = style.fontWeight === 'bold' || style.fontWeight === '700' ? 'bold' : 'normal'
  return `${weight} ${size}px ${style.fontFamily}, sans-serif`
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg' | 'webp' = 'png',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' }[format]
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Canvas export failed'))
        resolve(blob)
      },
      mimeType,
      quality
    )
  })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
