import type { BrandKit, Creation, CanvasState } from './types'

const STORAGE_KEY = 'image-forge-state'

export interface AppState {
  readonly brandKits: readonly BrandKit[]
  readonly creations: readonly Creation[]
}

function defaultState(): AppState {
  return { brandKits: [], creations: [] }
}

function save(state: AppState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return JSON.parse(raw) as AppState
  } catch {
    return defaultState()
  }
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ─── Brand Kit CRUD ───

export function createBrandKit(kit: BrandKit): AppState {
  const state = loadState()
  const next = { ...state, brandKits: [...state.brandKits, kit] }
  save(next)
  return next
}

export function updateBrandKit(id: string, updates: Partial<BrandKit>): AppState {
  const state = loadState()
  const next = {
    ...state,
    brandKits: state.brandKits.map((k) =>
      k.id === id ? { ...k, ...updates, updatedAt: new Date().toISOString() } : k
    ),
  }
  save(next)
  return next
}

export function deleteBrandKit(id: string): AppState {
  const state = loadState()
  const next = { ...state, brandKits: state.brandKits.filter((k) => k.id !== id) }
  save(next)
  return next
}

// ─── Creation CRUD ───

export function createCreation(creation: Creation): AppState {
  const state = loadState()
  const next = { ...state, creations: [...state.creations, creation] }
  save(next)
  return next
}

export function updateCreation(id: string, updates: Partial<Creation>): AppState {
  const state = loadState()
  const next = {
    ...state,
    creations: state.creations.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ),
  }
  save(next)
  return next
}

export function deleteCreation(id: string): AppState {
  const state = loadState()
  const next = { ...state, creations: state.creations.filter((c) => c.id !== id) }
  save(next)
  return next
}

export function getCreation(id: string): Creation | undefined {
  const state = loadState()
  return state.creations.find((c) => c.id === id)
}
