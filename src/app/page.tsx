'use client'

import Link from 'next/link'
import {
  Paintbrush,
  Layers,
  Palette,
  Download,
  Zap,
  Monitor,
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Layers,
    title: '13 Templates',
    desc: 'Instagram, Facebook, LinkedIn, Twitter, YouTube, Pinterest, Email, and more.',
  },
  {
    icon: Paintbrush,
    title: 'Canvas Editor',
    desc: 'Edit text, colors, and images directly on a live canvas preview.',
  },
  {
    icon: Palette,
    title: 'Brand Kit',
    desc: 'Save your brand colors, fonts, and logo. Auto-apply to every creation.',
  },
  {
    icon: Download,
    title: 'One-Click Export',
    desc: 'Export as PNG, JPG, or WebP. Download instantly, no account needed.',
  },
  {
    icon: Monitor,
    title: 'Platform Resize',
    desc: 'Resize any design to 12 platform formats with one click.',
  },
  {
    icon: Zap,
    title: 'Instant Preview',
    desc: 'See every change in real-time on a live canvas.',
  },
]

const PLATFORMS = [
  { name: 'Instagram', count: 3 },
  { name: 'Facebook', count: 2 },
  { name: 'LinkedIn', count: 1 },
  { name: 'Twitter/X', count: 1 },
  { name: 'YouTube', count: 1 },
  { name: 'Google Ads', count: 1 },
  { name: 'Pinterest', count: 1 },
  { name: 'Email', count: 1 },
  { name: 'General', count: 2 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-black">Image Forge</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:scale-105"
          style={{ background: 'var(--purple)' }}
        >
          Open App
          <ArrowRight size={14} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{ background: 'var(--purple-soft)', color: 'var(--purple)' }}
        >
          <ImageIcon size={12} />
          Ad & Social Media Image Maker
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
          Create stunning ads
          <br />
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            in seconds
          </span>
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
          13 platform-ready templates, a full canvas editor, brand kit management, and one-click export to every social platform.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold transition-all hover:scale-105"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Start Creating
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard/generate"
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ background: 'var(--surface)', border: '1px solid var(--purple)', color: 'var(--purple)' }}
          >
            <Sparkles size={14} />
            Generate with AI
          </Link>
        </div>
      </section>

      {/* Platforms Strip */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div
          className="flex flex-wrap items-center justify-center gap-3 p-4 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {PLATFORMS.map((p) => (
            <span
              key={p.name}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'var(--bg-alt)', color: 'var(--text-secondary)' }}
            >
              {p.name} ({p.count})
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-black text-center mb-10">Everything you need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-5 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <Icon size={20} style={{ color: 'var(--purple)' }} className="mb-3" />
              <h3 className="text-sm font-bold mb-1">{title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-black text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Pick a template', desc: 'Choose from 13 platform-optimized templates.' },
            { step: '2', title: 'Edit in canvas', desc: 'Change text, colors, and images. Apply your brand kit.' },
            { step: '3', title: 'Export & share', desc: 'Download as PNG/JPG/WebP or resize for any platform.' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-black text-white"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {s.step}
              </div>
              <h3 className="text-sm font-bold mb-1">{s.title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
      >
        <p className="text-xs">
          Image Forge -- Part of the Pick & Shovel Suite
        </p>
      </footer>
    </div>
  )
}
