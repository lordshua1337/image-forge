'use client'

import { useState, useEffect } from 'react'
import { Palette, Plus, Trash2, Star, X } from 'lucide-react'
import { loadState, createBrandKit, updateBrandKit, deleteBrandKit, generateId } from '@/lib/state'
import type { BrandKit } from '@/lib/types'
import type { AppState } from '@/lib/state'

const DEFAULT_FONTS = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display', 'Lora', 'Raleway', 'Georgia', 'Courier New']

export default function BrandKitPage() {
  const [state, setState] = useState<AppState>({ brandKits: [], creations: [] })
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    setState(loadState())
  }, [])

  const [form, setForm] = useState({
    name: '',
    description: '',
    primaryColor: '#8b5cf6',
    secondaryColor: '#1a1a2e',
    accentColor: '#ec4899',
    fontPrimary: 'Inter',
    fontSecondary: 'Inter',
  })

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      primaryColor: '#8b5cf6',
      secondaryColor: '#1a1a2e',
      accentColor: '#ec4899',
      fontPrimary: 'Inter',
      fontSecondary: 'Inter',
    })
  }

  const handleCreate = () => {
    if (!form.name.trim()) return
    const now = new Date().toISOString()
    const kit: BrandKit = {
      id: generateId('brand'),
      name: form.name.trim(),
      description: form.description.trim(),
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      accentColor: form.accentColor,
      fontPrimary: form.fontPrimary,
      fontSecondary: form.fontSecondary,
      logoUrl: null,
      isDefault: state.brandKits.length === 0,
      createdAt: now,
      updatedAt: now,
    }
    setState(createBrandKit(kit))
    resetForm()
    setShowCreate(false)
  }

  const handleDelete = (id: string) => {
    setState(deleteBrandKit(id))
  }

  const handleSetDefault = (id: string) => {
    for (const kit of state.brandKits) {
      if (kit.id === id) {
        setState(updateBrandKit(id, { isDefault: true }))
      } else if (kit.isDefault) {
        updateBrandKit(kit.id, { isDefault: false })
      }
    }
    setState(loadState())
  }

  const startEdit = (kit: BrandKit) => {
    setEditingId(kit.id)
    setForm({
      name: kit.name,
      description: kit.description,
      primaryColor: kit.primaryColor,
      secondaryColor: kit.secondaryColor,
      accentColor: kit.accentColor,
      fontPrimary: kit.fontPrimary,
      fontSecondary: kit.fontSecondary,
    })
  }

  const handleSaveEdit = () => {
    if (!editingId || !form.name.trim()) return
    setState(
      updateBrandKit(editingId, {
        name: form.name.trim(),
        description: form.description.trim(),
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        accentColor: form.accentColor,
        fontPrimary: form.fontPrimary,
        fontSecondary: form.fontSecondary,
      })
    )
    setEditingId(null)
    resetForm()
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Brand Kits</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Save your brand colors, fonts, and logo. Auto-apply to creations.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreate(true); setEditingId(null) }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
          style={{ background: 'var(--purple)' }}
        >
          <Plus size={14} />
          New Kit
        </button>
      </div>

      {/* Brand Kit Cards */}
      {state.brandKits.length === 0 ? (
        <div className="text-center py-16">
          <Palette size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            No brand kits yet.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="text-xs font-medium"
            style={{ color: 'var(--purple)' }}
          >
            Create your first brand kit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {state.brandKits.map((kit) => (
            <div
              key={kit.id}
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {/* Color preview strip */}
              <div className="flex h-3">
                <div className="flex-1" style={{ background: kit.primaryColor }} />
                <div className="flex-1" style={{ background: kit.secondaryColor }} />
                <div className="flex-1" style={{ background: kit.accentColor }} />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-1.5">
                      {kit.name}
                      {kit.isDefault && (
                        <Star size={11} style={{ color: 'var(--amber)' }} fill="var(--amber)" />
                      )}
                    </h3>
                    {kit.description && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {kit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Colors */}
                <div className="flex gap-2 mb-3">
                  {[
                    { label: 'Primary', color: kit.primaryColor },
                    { label: 'Secondary', color: kit.secondaryColor },
                    { label: 'Accent', color: kit.accentColor },
                  ].map((c) => (
                    <div key={c.label} className="text-center">
                      <div
                        className="w-8 h-8 rounded-lg mb-1"
                        style={{ background: c.color, border: '1px solid var(--border)' }}
                      />
                      <p className="text-[8px]" style={{ color: 'var(--text-muted)' }}>
                        {c.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Fonts */}
                <p className="text-[10px] mb-3" style={{ color: 'var(--text-muted)' }}>
                  {kit.fontPrimary} / {kit.fontSecondary}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(kit)}
                    className="px-2 py-1 rounded text-[10px] font-medium transition-all"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    Edit
                  </button>
                  {!kit.isDefault && (
                    <button
                      onClick={() => handleSetDefault(kit.id)}
                      className="px-2 py-1 rounded text-[10px] font-medium transition-all"
                      style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(kit.id)}
                    className="p-1 rounded transition-all hover:bg-[var(--red-soft)]"
                  >
                    <Trash2 size={12} style={{ color: 'var(--red)' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(showCreate || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-full max-w-md rounded-xl p-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {editingId ? 'Edit Brand Kit' : 'New Brand Kit'}
              </h2>
              <button onClick={() => { setShowCreate(false); setEditingId(null); resetForm() }}>
                <X size={18} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  placeholder="e.g., My Brand"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Description
                </label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  placeholder="Optional description"
                />
              </div>

              {/* Colors */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'primaryColor' as const, label: 'Primary' },
                  { key: 'secondaryColor' as const, label: 'Secondary' },
                  { key: 'accentColor' as const, label: 'Accent' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {label}
                    </label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="flex-1 px-2 py-1 rounded text-[10px]"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Fonts */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'fontPrimary' as const, label: 'Primary Font' },
                  { key: 'fontSecondary' as const, label: 'Secondary Font' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {label}
                    </label>
                    <select
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg text-xs"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    >
                      {DEFAULT_FONTS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <button
                onClick={editingId ? handleSaveEdit : handleCreate}
                disabled={!form.name.trim()}
                className="w-full py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: 'var(--purple)' }}
              >
                {editingId ? 'Save Changes' : 'Create Brand Kit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
