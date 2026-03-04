// ─── Core Types ───

export interface CanvasBounds {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface TextShadow {
  readonly offsetX: number
  readonly offsetY: number
  readonly blurRadius: number
  readonly color: string
}

export interface TextStyle {
  readonly fontSize: number
  readonly fontFamily: string
  readonly fontWeight: 'normal' | 'bold' | '400' | '700'
  readonly color: string
  readonly textAlign: 'left' | 'center' | 'right'
  readonly lineHeight: number
  readonly letterSpacing: number
  readonly textShadow?: TextShadow
}

export interface TextAuto {
  readonly sizeToFit: boolean
  readonly minFontSize: number
  readonly maxFontSize: number
  readonly verticalAlign: 'top' | 'middle' | 'bottom'
}

export interface TemplateLayer {
  readonly id: string
  readonly type: 'image' | 'text' | 'shape' | 'logo'
  readonly bounds: CanvasBounds
  readonly zIndex: number
  readonly locked: boolean
  readonly imageUrl?: string
  readonly imageScaleMode?: 'cover' | 'contain' | 'stretch'
  readonly imageOpacity?: number
  readonly textContent?: string
  readonly textStyle?: TextStyle
  readonly textAuto?: TextAuto
  readonly shapeType?: 'rect' | 'circle'
  readonly shapeColor?: string
  readonly shapeStroke?: { readonly width: number; readonly color: string }
}

export interface PlaceholderRegion {
  readonly id: string
  readonly layerId: string
  readonly label: string
  readonly description: string
  readonly isEditable: boolean
}

export interface ColorMapping {
  readonly templatePlaceholder: string
  readonly brandKitField: 'primaryColor' | 'secondaryColor' | 'accentColor'
}

export interface Template {
  readonly id: string
  readonly slug: string
  readonly platform: string
  readonly purpose: string
  readonly name: string
  readonly description: string
  readonly widthPx: number
  readonly heightPx: number
  readonly layerConfig: readonly TemplateLayer[]
  readonly placeholderRegions: readonly PlaceholderRegion[]
  readonly colorMapping: readonly ColorMapping[]
}

export interface BrandKit {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly primaryColor: string
  readonly secondaryColor: string
  readonly accentColor: string
  readonly fontPrimary: string
  readonly fontSecondary: string
  readonly logoUrl: string | null
  readonly isDefault: boolean
  readonly createdAt: string
  readonly updatedAt: string
}

export interface Creation {
  readonly id: string
  readonly brandKitId: string | null
  readonly templateId: string
  readonly title: string
  readonly description: string | null
  readonly campaignTag: string | null
  readonly canvasState: CanvasState
  readonly thumbnailDataUrl: string | null
  readonly createdAt: string
  readonly updatedAt: string
}

export interface CanvasState {
  readonly layers: readonly TemplateLayer[]
  readonly width: number
  readonly height: number
  readonly zoom: number
}

export interface PlatformFormat {
  readonly platform: string
  readonly purpose: string
  readonly label: string
  readonly width: number
  readonly height: number
  readonly icon: string
}

// ─── Webhook Types (from Pipeline Simulator) ───

export interface PipelineReadyPayload {
  readonly source: string
  readonly timestamp: string
  readonly pipelineId: string
  readonly product: string
  readonly stage: string
  readonly metrics: Record<string, unknown>
}
