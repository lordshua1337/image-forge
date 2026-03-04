import type { PlatformFormat } from '../types'

export const PLATFORM_FORMATS: readonly PlatformFormat[] = [
  { platform: 'Instagram', purpose: 'Post', label: 'Instagram Post', width: 1080, height: 1080, icon: 'Instagram' },
  { platform: 'Instagram', purpose: 'Story', label: 'Instagram Story', width: 1080, height: 1920, icon: 'Instagram' },
  { platform: 'Instagram', purpose: 'Carousel', label: 'Instagram Carousel', width: 1080, height: 1350, icon: 'Instagram' },
  { platform: 'Facebook', purpose: 'Ad', label: 'Facebook Ad', width: 1200, height: 628, icon: 'Facebook' },
  { platform: 'Facebook', purpose: 'Post', label: 'Facebook Post', width: 1200, height: 630, icon: 'Facebook' },
  { platform: 'LinkedIn', purpose: 'Post', label: 'LinkedIn Post', width: 1200, height: 627, icon: 'Linkedin' },
  { platform: 'LinkedIn', purpose: 'Banner', label: 'LinkedIn Banner', width: 1584, height: 396, icon: 'Linkedin' },
  { platform: 'Twitter/X', purpose: 'Post', label: 'Twitter Post', width: 1600, height: 900, icon: 'Twitter' },
  { platform: 'YouTube', purpose: 'Thumbnail', label: 'YouTube Thumbnail', width: 1280, height: 720, icon: 'Youtube' },
  { platform: 'YouTube', purpose: 'Banner', label: 'YouTube Banner', width: 2560, height: 1440, icon: 'Youtube' },
  { platform: 'Pinterest', purpose: 'Pin', label: 'Pinterest Pin', width: 1000, height: 1500, icon: 'Layers' },
  { platform: 'Email', purpose: 'Header', label: 'Email Header', width: 600, height: 200, icon: 'Mail' },
]

export function resizeCanvas(
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas')
  newCanvas.width = targetWidth
  newCanvas.height = targetHeight

  const dstCtx = newCanvas.getContext('2d')
  if (!dstCtx) throw new Error('Canvas context error')

  const sourceAspect = source.width / source.height
  const targetAspect = targetWidth / targetHeight

  let scale: number
  let srcX: number
  let srcY: number

  if (sourceAspect > targetAspect) {
    scale = targetHeight / source.height
    srcX = (source.width - targetWidth / scale) / 2
    srcY = 0
  } else {
    scale = targetWidth / source.width
    srcX = 0
    srcY = (source.height - targetHeight / scale) / 2
  }

  dstCtx.fillStyle = '#000000'
  dstCtx.fillRect(0, 0, targetWidth, targetHeight)

  dstCtx.drawImage(
    source,
    Math.max(0, srcX),
    Math.max(0, srcY),
    Math.min(source.width, targetWidth / scale),
    Math.min(source.height, targetHeight / scale),
    0,
    0,
    targetWidth,
    targetHeight
  )

  return newCanvas
}
