import type { Template } from './types'

export const TEMPLATES: readonly Template[] = [
  // ─── Instagram ───
  {
    id: 'inst-post',
    slug: 'instagram-post',
    platform: 'Instagram',
    purpose: 'Post',
    name: 'Instagram Post',
    description: 'Square post with headline and CTA',
    widthPx: 1080,
    heightPx: 1080,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1080, height: 1080 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#1a1a2e' },
      { id: 'accent-bar', type: 'shape', bounds: { x: 0, y: 0, width: 1080, height: 8 }, zIndex: 1, locked: false, shapeType: 'rect', shapeColor: '#e94560' },
      { id: 'product-img', type: 'image', bounds: { x: 140, y: 120, width: 800, height: 520 }, zIndex: 2, locked: false, imageScaleMode: 'cover' },
      { id: 'headline', type: 'text', bounds: { x: 60, y: 700, width: 960, height: 100 }, zIndex: 3, locked: false, textContent: 'Your Headline Here', textStyle: { fontSize: 52, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.2, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 28, maxFontSize: 60, verticalAlign: 'middle' } },
      { id: 'cta', type: 'text', bounds: { x: 340, y: 860, width: 400, height: 60 }, zIndex: 4, locked: false, textContent: 'SHOP NOW', textStyle: { fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1, letterSpacing: 2 }, textAuto: { sizeToFit: true, minFontSize: 14, maxFontSize: 28, verticalAlign: 'middle' } },
      { id: 'cta-bg', type: 'shape', bounds: { x: 340, y: 850, width: 400, height: 60 }, zIndex: 3, locked: false, shapeType: 'rect', shapeColor: '#e94560' },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Product Image', description: 'Main product or hero image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Main headline text', isEditable: true },
      { id: 'ph-cta', layerId: 'cta', label: 'CTA', description: 'Call to action button text', isEditable: true },
    ],
    colorMapping: [
      { templatePlaceholder: 'primary', brandKitField: 'primaryColor' },
      { templatePlaceholder: 'accent', brandKitField: 'accentColor' },
    ],
  },
  {
    id: 'inst-story',
    slug: 'instagram-story',
    platform: 'Instagram',
    purpose: 'Story',
    name: 'Instagram Story',
    description: 'Full-screen vertical story',
    widthPx: 1080,
    heightPx: 1920,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1080, height: 1920 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#0f0f23' },
      { id: 'product-img', type: 'image', bounds: { x: 0, y: 300, width: 1080, height: 900 }, zIndex: 1, locked: false, imageScaleMode: 'cover' },
      { id: 'headline', type: 'text', bounds: { x: 60, y: 1280, width: 960, height: 120 }, zIndex: 2, locked: false, textContent: 'Swipe Up', textStyle: { fontSize: 56, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.2, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 32, maxFontSize: 64, verticalAlign: 'middle' } },
      { id: 'subtitle', type: 'text', bounds: { x: 100, y: 1420, width: 880, height: 80 }, zIndex: 2, locked: false, textContent: 'Limited time offer', textStyle: { fontSize: 24, fontFamily: 'Inter', fontWeight: 'normal', color: '#a0a0b0', textAlign: 'center', lineHeight: 1.4, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 16, maxFontSize: 32, verticalAlign: 'middle' } },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Product Image', description: 'Full-width product image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Main message', isEditable: true },
    ],
    colorMapping: [{ templatePlaceholder: 'primary', brandKitField: 'primaryColor' }],
  },
  {
    id: 'inst-carousel',
    slug: 'instagram-carousel',
    platform: 'Instagram',
    purpose: 'Carousel',
    name: 'Instagram Carousel',
    description: 'Portrait carousel slide',
    widthPx: 1080,
    heightPx: 1350,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1080, height: 1350 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#16213e' },
      { id: 'product-img', type: 'image', bounds: { x: 60, y: 80, width: 960, height: 720 }, zIndex: 1, locked: false, imageScaleMode: 'cover' },
      { id: 'headline', type: 'text', bounds: { x: 60, y: 860, width: 960, height: 100 }, zIndex: 2, locked: false, textContent: 'Slide Title', textStyle: { fontSize: 48, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'left', lineHeight: 1.2, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 24, maxFontSize: 56, verticalAlign: 'middle' } },
      { id: 'body', type: 'text', bounds: { x: 60, y: 980, width: 960, height: 200 }, zIndex: 2, locked: false, textContent: 'Add your description here. Keep it short and impactful.', textStyle: { fontSize: 22, fontFamily: 'Inter', fontWeight: 'normal', color: '#b0b0c0', textAlign: 'left', lineHeight: 1.5, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 16, maxFontSize: 28, verticalAlign: 'top' } },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Image', description: 'Carousel slide image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Title', description: 'Slide title', isEditable: true },
      { id: 'ph-body', layerId: 'body', label: 'Description', description: 'Slide body text', isEditable: true },
    ],
    colorMapping: [{ templatePlaceholder: 'primary', brandKitField: 'primaryColor' }],
  },
  // ─── Facebook ───
  {
    id: 'fb-ad',
    slug: 'facebook-ad',
    platform: 'Facebook',
    purpose: 'Ad',
    name: 'Facebook Ad',
    description: 'Standard ad format 1200x628',
    widthPx: 1200,
    heightPx: 628,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1200, height: 628 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#ffffff' },
      { id: 'product-img', type: 'image', bounds: { x: 0, y: 0, width: 600, height: 628 }, zIndex: 1, locked: false, imageScaleMode: 'cover' },
      { id: 'text-bg', type: 'shape', bounds: { x: 600, y: 0, width: 600, height: 628 }, zIndex: 1, locked: false, shapeType: 'rect', shapeColor: '#1a1a2e' },
      { id: 'headline', type: 'text', bounds: { x: 640, y: 160, width: 520, height: 100 }, zIndex: 2, locked: false, textContent: 'Your Product Name', textStyle: { fontSize: 40, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'left', lineHeight: 1.2, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 24, maxFontSize: 48, verticalAlign: 'middle' } },
      { id: 'subtitle', type: 'text', bounds: { x: 640, y: 280, width: 520, height: 80 }, zIndex: 2, locked: false, textContent: 'Short value proposition goes here', textStyle: { fontSize: 18, fontFamily: 'Inter', fontWeight: 'normal', color: '#a0a0b0', textAlign: 'left', lineHeight: 1.5, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 14, maxFontSize: 24, verticalAlign: 'top' } },
      { id: 'cta', type: 'text', bounds: { x: 640, y: 440, width: 200, height: 50 }, zIndex: 3, locked: false, textContent: 'Learn More', textStyle: { fontSize: 16, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.1, letterSpacing: 1 }, textAuto: { sizeToFit: true, minFontSize: 12, maxFontSize: 20, verticalAlign: 'middle' } },
      { id: 'cta-bg', type: 'shape', bounds: { x: 640, y: 432, width: 200, height: 50 }, zIndex: 2, locked: false, shapeType: 'rect', shapeColor: '#3b82f6' },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Product Image', description: 'Left-side product image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Product or brand name', isEditable: true },
      { id: 'ph-subtitle', layerId: 'subtitle', label: 'Subtitle', description: 'Value proposition', isEditable: true },
      { id: 'ph-cta', layerId: 'cta', label: 'CTA', description: 'Call to action', isEditable: true },
    ],
    colorMapping: [
      { templatePlaceholder: 'primary', brandKitField: 'primaryColor' },
      { templatePlaceholder: 'accent', brandKitField: 'accentColor' },
    ],
  },
  {
    id: 'fb-post',
    slug: 'facebook-post',
    platform: 'Facebook',
    purpose: 'Post',
    name: 'Facebook Post',
    description: 'Standard feed post 1200x630',
    widthPx: 1200,
    heightPx: 630,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1200, height: 630 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#0a0a1a' },
      { id: 'product-img', type: 'image', bounds: { x: 100, y: 60, width: 1000, height: 380 }, zIndex: 1, locked: false, imageScaleMode: 'cover' },
      { id: 'headline', type: 'text', bounds: { x: 100, y: 480, width: 1000, height: 80 }, zIndex: 2, locked: false, textContent: 'Announcement Title', textStyle: { fontSize: 36, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.2, letterSpacing: -0.5 }, textAuto: { sizeToFit: true, minFontSize: 20, maxFontSize: 44, verticalAlign: 'middle' } },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Image', description: 'Main image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Post headline', isEditable: true },
    ],
    colorMapping: [{ templatePlaceholder: 'primary', brandKitField: 'primaryColor' }],
  },
  // ─── LinkedIn ───
  {
    id: 'li-post',
    slug: 'linkedin-post',
    platform: 'LinkedIn',
    purpose: 'Post',
    name: 'LinkedIn Post',
    description: 'Professional post 1200x627',
    widthPx: 1200,
    heightPx: 627,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1200, height: 627 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#0f172a' },
      { id: 'accent', type: 'shape', bounds: { x: 0, y: 0, width: 6, height: 627 }, zIndex: 1, locked: false, shapeType: 'rect', shapeColor: '#0077b5' },
      { id: 'headline', type: 'text', bounds: { x: 80, y: 160, width: 700, height: 120 }, zIndex: 2, locked: false, textContent: 'Key Insight or\nAnnouncement', textStyle: { fontSize: 44, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'left', lineHeight: 1.3, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 28, maxFontSize: 52, verticalAlign: 'middle' } },
      { id: 'subtitle', type: 'text', bounds: { x: 80, y: 320, width: 700, height: 80 }, zIndex: 2, locked: false, textContent: 'Supporting context or data point', textStyle: { fontSize: 20, fontFamily: 'Inter', fontWeight: 'normal', color: '#94a3b8', textAlign: 'left', lineHeight: 1.5, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 14, maxFontSize: 24, verticalAlign: 'top' } },
      { id: 'stat', type: 'text', bounds: { x: 880, y: 180, width: 260, height: 120 }, zIndex: 2, locked: false, textContent: '47%', textStyle: { fontSize: 72, fontFamily: 'Inter', fontWeight: 'bold', color: '#0077b5', textAlign: 'center', lineHeight: 1, letterSpacing: -2 }, textAuto: { sizeToFit: true, minFontSize: 40, maxFontSize: 80, verticalAlign: 'middle' } },
      { id: 'stat-label', type: 'text', bounds: { x: 880, y: 310, width: 260, height: 40 }, zIndex: 2, locked: false, textContent: 'increase in ROI', textStyle: { fontSize: 16, fontFamily: 'Inter', fontWeight: 'normal', color: '#64748b', textAlign: 'center', lineHeight: 1.3, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 12, maxFontSize: 20, verticalAlign: 'top' } },
    ],
    placeholderRegions: [
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Main message', isEditable: true },
      { id: 'ph-subtitle', layerId: 'subtitle', label: 'Subtitle', description: 'Supporting text', isEditable: true },
      { id: 'ph-stat', layerId: 'stat', label: 'Statistic', description: 'Key number', isEditable: true },
    ],
    colorMapping: [{ templatePlaceholder: 'primary', brandKitField: 'primaryColor' }],
  },
  // ─── Twitter/X ───
  {
    id: 'tw-post',
    slug: 'twitter-post',
    platform: 'Twitter/X',
    purpose: 'Post',
    name: 'Twitter Post',
    description: 'Tweet image 1600x900',
    widthPx: 1600,
    heightPx: 900,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1600, height: 900 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#15202b' },
      { id: 'product-img', type: 'image', bounds: { x: 900, y: 100, width: 600, height: 700 }, zIndex: 1, locked: false, imageScaleMode: 'contain' },
      { id: 'headline', type: 'text', bounds: { x: 80, y: 200, width: 760, height: 160 }, zIndex: 2, locked: false, textContent: 'Bold statement that\nstops the scroll', textStyle: { fontSize: 52, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'left', lineHeight: 1.2, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 28, maxFontSize: 60, verticalAlign: 'middle' } },
      { id: 'subtitle', type: 'text', bounds: { x: 80, y: 400, width: 760, height: 80 }, zIndex: 2, locked: false, textContent: 'Supporting detail or call to action', textStyle: { fontSize: 22, fontFamily: 'Inter', fontWeight: 'normal', color: '#8899a6', textAlign: 'left', lineHeight: 1.4, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 16, maxFontSize: 28, verticalAlign: 'top' } },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Image', description: 'Right-side image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Bold statement', isEditable: true },
    ],
    colorMapping: [{ templatePlaceholder: 'primary', brandKitField: 'primaryColor' }],
  },
  // ─── YouTube ───
  {
    id: 'yt-thumbnail',
    slug: 'youtube-thumbnail',
    platform: 'YouTube',
    purpose: 'Thumbnail',
    name: 'YouTube Thumbnail',
    description: 'Video thumbnail 1280x720',
    widthPx: 1280,
    heightPx: 720,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1280, height: 720 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#000000' },
      { id: 'product-img', type: 'image', bounds: { x: 0, y: 0, width: 1280, height: 720 }, zIndex: 1, locked: false, imageScaleMode: 'cover', imageOpacity: 0.6 },
      { id: 'headline', type: 'text', bounds: { x: 60, y: 220, width: 800, height: 180 }, zIndex: 2, locked: false, textContent: 'VIDEO TITLE', textStyle: { fontSize: 72, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'left', lineHeight: 1.1, letterSpacing: -2, textShadow: { offsetX: 3, offsetY: 3, blurRadius: 8, color: 'rgba(0,0,0,0.8)' } }, textAuto: { sizeToFit: true, minFontSize: 40, maxFontSize: 80, verticalAlign: 'middle' } },
      { id: 'badge', type: 'text', bounds: { x: 60, y: 500, width: 200, height: 50 }, zIndex: 3, locked: false, textContent: 'NEW', textStyle: { fontSize: 24, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1, letterSpacing: 2 }, textAuto: { sizeToFit: true, minFontSize: 16, maxFontSize: 28, verticalAlign: 'middle' } },
      { id: 'badge-bg', type: 'shape', bounds: { x: 60, y: 492, width: 200, height: 50 }, zIndex: 2, locked: false, shapeType: 'rect', shapeColor: '#ef4444' },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Background', description: 'Background image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Title', description: 'Video title', isEditable: true },
    ],
    colorMapping: [{ templatePlaceholder: 'accent', brandKitField: 'accentColor' }],
  },
  // ─── Google Ads ───
  {
    id: 'gad-display',
    slug: 'google-display',
    platform: 'Google Ads',
    purpose: 'Display',
    name: 'Google Display Ad',
    description: 'Responsive display 1200x628',
    widthPx: 1200,
    heightPx: 628,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1200, height: 628 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#ffffff' },
      { id: 'accent-top', type: 'shape', bounds: { x: 0, y: 0, width: 1200, height: 4 }, zIndex: 1, locked: false, shapeType: 'rect', shapeColor: '#4285f4' },
      { id: 'product-img', type: 'image', bounds: { x: 60, y: 60, width: 480, height: 508 }, zIndex: 1, locked: false, imageScaleMode: 'contain' },
      { id: 'headline', type: 'text', bounds: { x: 600, y: 120, width: 540, height: 100 }, zIndex: 2, locked: false, textContent: 'Product Name', textStyle: { fontSize: 40, fontFamily: 'Inter', fontWeight: 'bold', color: '#1a1a1a', textAlign: 'left', lineHeight: 1.2, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 24, maxFontSize: 48, verticalAlign: 'middle' } },
      { id: 'desc', type: 'text', bounds: { x: 600, y: 240, width: 540, height: 120 }, zIndex: 2, locked: false, textContent: 'Short description of your product or service. Highlight the key benefit.', textStyle: { fontSize: 18, fontFamily: 'Inter', fontWeight: 'normal', color: '#666666', textAlign: 'left', lineHeight: 1.5, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 14, maxFontSize: 22, verticalAlign: 'top' } },
      { id: 'cta', type: 'text', bounds: { x: 600, y: 440, width: 180, height: 48 }, zIndex: 3, locked: false, textContent: 'Get Started', textStyle: { fontSize: 16, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1, letterSpacing: 0.5 }, textAuto: { sizeToFit: true, minFontSize: 12, maxFontSize: 20, verticalAlign: 'middle' } },
      { id: 'cta-bg', type: 'shape', bounds: { x: 600, y: 432, width: 180, height: 48 }, zIndex: 2, locked: false, shapeType: 'rect', shapeColor: '#4285f4' },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Product Image', description: 'Product photo', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Product name', isEditable: true },
      { id: 'ph-desc', layerId: 'desc', label: 'Description', description: 'Product description', isEditable: true },
      { id: 'ph-cta', layerId: 'cta', label: 'CTA', description: 'Button text', isEditable: true },
    ],
    colorMapping: [
      { templatePlaceholder: 'primary', brandKitField: 'primaryColor' },
      { templatePlaceholder: 'accent', brandKitField: 'accentColor' },
    ],
  },
  // ─── Pinterest ───
  {
    id: 'pin-standard',
    slug: 'pinterest-pin',
    platform: 'Pinterest',
    purpose: 'Pin',
    name: 'Pinterest Pin',
    description: 'Vertical pin 1000x1500',
    widthPx: 1000,
    heightPx: 1500,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1000, height: 1500 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#faf5f0' },
      { id: 'product-img', type: 'image', bounds: { x: 0, y: 0, width: 1000, height: 900 }, zIndex: 1, locked: false, imageScaleMode: 'cover' },
      { id: 'headline', type: 'text', bounds: { x: 60, y: 960, width: 880, height: 100 }, zIndex: 2, locked: false, textContent: 'Pin Title Here', textStyle: { fontSize: 44, fontFamily: 'Inter', fontWeight: 'bold', color: '#2d2d2d', textAlign: 'center', lineHeight: 1.2, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 24, maxFontSize: 52, verticalAlign: 'middle' } },
      { id: 'desc', type: 'text', bounds: { x: 80, y: 1080, width: 840, height: 120 }, zIndex: 2, locked: false, textContent: 'Brief description with keywords for search discovery', textStyle: { fontSize: 20, fontFamily: 'Inter', fontWeight: 'normal', color: '#666666', textAlign: 'center', lineHeight: 1.5, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 14, maxFontSize: 24, verticalAlign: 'top' } },
      { id: 'cta', type: 'text', bounds: { x: 300, y: 1340, width: 400, height: 60 }, zIndex: 3, locked: false, textContent: 'Read More', textStyle: { fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1, letterSpacing: 1 }, textAuto: { sizeToFit: true, minFontSize: 14, maxFontSize: 22, verticalAlign: 'middle' } },
      { id: 'cta-bg', type: 'shape', bounds: { x: 300, y: 1332, width: 400, height: 60 }, zIndex: 2, locked: false, shapeType: 'rect', shapeColor: '#e60023' },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Image', description: 'Pin main image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Title', description: 'Pin title', isEditable: true },
    ],
    colorMapping: [{ templatePlaceholder: 'accent', brandKitField: 'accentColor' }],
  },
  // ─── Email ───
  {
    id: 'email-header',
    slug: 'email-header',
    platform: 'Email',
    purpose: 'Header',
    name: 'Email Header',
    description: 'Email header 600x200',
    widthPx: 600,
    heightPx: 200,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 600, height: 200 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#1a1a2e' },
      { id: 'headline', type: 'text', bounds: { x: 30, y: 40, width: 540, height: 60 }, zIndex: 1, locked: false, textContent: 'Newsletter Title', textStyle: { fontSize: 32, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1.2, letterSpacing: -0.5 }, textAuto: { sizeToFit: true, minFontSize: 20, maxFontSize: 40, verticalAlign: 'middle' } },
      { id: 'subtitle', type: 'text', bounds: { x: 60, y: 110, width: 480, height: 40 }, zIndex: 1, locked: false, textContent: 'A brief tagline for your email', textStyle: { fontSize: 16, fontFamily: 'Inter', fontWeight: 'normal', color: '#a0a0b0', textAlign: 'center', lineHeight: 1.4, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 12, maxFontSize: 20, verticalAlign: 'middle' } },
    ],
    placeholderRegions: [
      { id: 'ph-headline', layerId: 'headline', label: 'Title', description: 'Email header title', isEditable: true },
      { id: 'ph-subtitle', layerId: 'subtitle', label: 'Tagline', description: 'Email tagline', isEditable: true },
    ],
    colorMapping: [{ templatePlaceholder: 'primary', brandKitField: 'primaryColor' }],
  },
  // ─── Generic ───
  {
    id: 'gen-square',
    slug: 'square-poster',
    platform: 'General',
    purpose: 'Poster',
    name: 'Square Poster',
    description: 'Multipurpose 1080x1080',
    widthPx: 1080,
    heightPx: 1080,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1080, height: 1080 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#0f0f23' },
      { id: 'circle-accent', type: 'shape', bounds: { x: 690, y: -200, width: 800, height: 800 }, zIndex: 1, locked: false, shapeType: 'circle', shapeColor: '#e94560' },
      { id: 'headline', type: 'text', bounds: { x: 60, y: 300, width: 600, height: 200 }, zIndex: 2, locked: false, textContent: 'Big Bold\nMessage', textStyle: { fontSize: 64, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'left', lineHeight: 1.1, letterSpacing: -2 }, textAuto: { sizeToFit: true, minFontSize: 36, maxFontSize: 72, verticalAlign: 'middle' } },
      { id: 'subtitle', type: 'text', bounds: { x: 60, y: 540, width: 600, height: 80 }, zIndex: 2, locked: false, textContent: 'Supporting detail or date info', textStyle: { fontSize: 22, fontFamily: 'Inter', fontWeight: 'normal', color: '#a0a0b0', textAlign: 'left', lineHeight: 1.4, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 16, maxFontSize: 28, verticalAlign: 'top' } },
    ],
    placeholderRegions: [
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Main message', isEditable: true },
      { id: 'ph-subtitle', layerId: 'subtitle', label: 'Subtitle', description: 'Supporting text', isEditable: true },
    ],
    colorMapping: [
      { templatePlaceholder: 'primary', brandKitField: 'primaryColor' },
      { templatePlaceholder: 'accent', brandKitField: 'accentColor' },
    ],
  },
  {
    id: 'gen-hero',
    slug: 'hero-banner',
    platform: 'General',
    purpose: 'Hero',
    name: 'Hero Banner',
    description: 'Website hero 1200x800',
    widthPx: 1200,
    heightPx: 800,
    layerConfig: [
      { id: 'bg', type: 'shape', bounds: { x: 0, y: 0, width: 1200, height: 800 }, zIndex: 0, locked: false, shapeType: 'rect', shapeColor: '#0a0a1a' },
      { id: 'product-img', type: 'image', bounds: { x: 600, y: 50, width: 550, height: 700 }, zIndex: 1, locked: false, imageScaleMode: 'contain' },
      { id: 'headline', type: 'text', bounds: { x: 60, y: 200, width: 500, height: 160 }, zIndex: 2, locked: false, textContent: 'Hero Section\nHeadline', textStyle: { fontSize: 52, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'left', lineHeight: 1.2, letterSpacing: -1 }, textAuto: { sizeToFit: true, minFontSize: 28, maxFontSize: 60, verticalAlign: 'middle' } },
      { id: 'subtitle', type: 'text', bounds: { x: 60, y: 380, width: 500, height: 80 }, zIndex: 2, locked: false, textContent: 'Compelling description that drives action', textStyle: { fontSize: 20, fontFamily: 'Inter', fontWeight: 'normal', color: '#94a3b8', textAlign: 'left', lineHeight: 1.5, letterSpacing: 0 }, textAuto: { sizeToFit: true, minFontSize: 14, maxFontSize: 24, verticalAlign: 'top' } },
      { id: 'cta', type: 'text', bounds: { x: 60, y: 500, width: 200, height: 50 }, zIndex: 3, locked: false, textContent: 'Get Started', textStyle: { fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', lineHeight: 1, letterSpacing: 0.5 }, textAuto: { sizeToFit: true, minFontSize: 14, maxFontSize: 22, verticalAlign: 'middle' } },
      { id: 'cta-bg', type: 'shape', bounds: { x: 60, y: 492, width: 200, height: 50 }, zIndex: 2, locked: false, shapeType: 'rect', shapeColor: '#6366f1' },
    ],
    placeholderRegions: [
      { id: 'ph-img', layerId: 'product-img', label: 'Image', description: 'Hero image', isEditable: true },
      { id: 'ph-headline', layerId: 'headline', label: 'Headline', description: 'Hero title', isEditable: true },
      { id: 'ph-subtitle', layerId: 'subtitle', label: 'Subtitle', description: 'Description', isEditable: true },
      { id: 'ph-cta', layerId: 'cta', label: 'CTA', description: 'Button text', isEditable: true },
    ],
    colorMapping: [
      { templatePlaceholder: 'primary', brandKitField: 'primaryColor' },
      { templatePlaceholder: 'accent', brandKitField: 'accentColor' },
    ],
  },
] as const

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

export function getTemplatesByPlatform(platform: string): readonly Template[] {
  return TEMPLATES.filter((t) => t.platform === platform)
}

export function getPlatforms(): readonly string[] {
  return [...new Set(TEMPLATES.map((t) => t.platform))]
}
