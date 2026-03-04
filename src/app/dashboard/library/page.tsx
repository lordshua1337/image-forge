'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FolderOpen, Trash2, Pencil } from 'lucide-react'
import { loadState, deleteCreation } from '@/lib/state'
import { getTemplateById } from '@/lib/templates'
import type { AppState } from '@/lib/state'

export default function LibraryPage() {
  const [state, setState] = useState<AppState>({ brandKits: [], creations: [] })

  useEffect(() => {
    setState(loadState())
  }, [])

  const handleDelete = (id: string) => {
    setState(deleteCreation(id))
  }

  const sorted = [...state.creations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Your Library</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          All your saved creations. Click to edit, export, or resize.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            No creations yet.
          </p>
          <Link
            href="/dashboard"
            className="text-xs font-medium"
            style={{ color: 'var(--purple)' }}
          >
            Start by choosing a template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((creation) => {
            const template = getTemplateById(creation.templateId)
            return (
              <div
                key={creation.id}
                className="rounded-xl overflow-hidden group"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden" style={{ background: 'var(--bg-alt)' }}>
                  {creation.thumbnailDataUrl ? (
                    <img
                      src={creation.thumbnailDataUrl}
                      alt={creation.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        No preview
                      </p>
                    </div>
                  )}

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <Link
                      href={`/dashboard/editor?id=${creation.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                      style={{ background: 'var(--purple)' }}
                    >
                      <Pencil size={11} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(creation.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: 'var(--red-soft)', color: 'var(--red)' }}
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-bold truncate">{creation.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {template?.platform ?? 'Custom'} -- {creation.canvasState.width}x{creation.canvasState.height}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(creation.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
