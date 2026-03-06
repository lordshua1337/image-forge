'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Layers, Palette, FolderOpen, Wand2 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Templates', icon: Layers },
  { href: '/dashboard/generate', label: 'Generate', icon: Wand2 },
  { href: '/dashboard/brand', label: 'Brand Kit', icon: Palette },
  { href: '/dashboard/library', label: 'Library', icon: FolderOpen },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="flex items-center justify-between px-6 py-3"
      style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
    >
      <Link href="/dashboard" className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-sm font-black">Image Forge</span>
      </Link>
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: isActive ? 'var(--purple-soft)' : 'transparent',
                color: isActive ? 'var(--purple)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={14} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
