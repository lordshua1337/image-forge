'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TEMPLATES, getPlatforms } from '@/lib/templates'

export default function TemplatesPage() {
  const platforms = getPlatforms()
  const [activePlatform, setActivePlatform] = useState<string | null>(null)

  const filtered = activePlatform
    ? TEMPLATES.filter((t) => t.platform === activePlatform)
    : TEMPLATES

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Choose a Template</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Select a template to start creating. All templates are fully customizable.
        </p>
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setActivePlatform(null)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: !activePlatform ? 'var(--purple-soft)' : 'var(--surface)',
            color: !activePlatform ? 'var(--purple)' : 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          All ({TEMPLATES.length})
        </button>
        {platforms.map((p) => {
          const count = TEMPLATES.filter((t) => t.platform === p).length
          return (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activePlatform === p ? 'var(--purple-soft)' : 'var(--surface)',
                color: activePlatform === p ? 'var(--purple)' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {p} ({count})
            </button>
          )
        })}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((template) => {
          const aspect = template.widthPx / template.heightPx
          return (
            <Link
              key={template.id}
              href={`/dashboard/editor?template=${template.id}`}
              className="rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg group"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {/* Preview */}
              <div
                className="relative overflow-hidden"
                style={{
                  paddingBottom: `${Math.min(100 / aspect, 100)}%`,
                  background: 'var(--bg-alt)',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <TemplatePreview template={template} />
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold">{template.name}</h3>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                    style={{ background: 'var(--purple-soft)', color: 'var(--purple)' }}
                  >
                    {template.platform}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {template.description}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {template.widthPx} x {template.heightPx}px
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function TemplatePreview({ template }: { template: typeof TEMPLATES[number] }) {
  const bgLayer = template.layerConfig.find((l) => l.id === 'bg')
  const bgColor = bgLayer?.shapeColor ?? '#1a1a2e'

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: bgColor }}
    >
      <div className="text-center p-4">
        <p className="text-sm font-bold text-white/80">{template.purpose}</p>
        <p className="text-[10px] text-white/40 mt-1">{template.widthPx}x{template.heightPx}</p>
      </div>
    </div>
  )
}
