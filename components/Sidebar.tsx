'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/dashboard', icon: '⚡', label: 'Dashboard' },
  { href: '/recall', icon: '🧠', label: 'Recall' },
  { href: '/cards', icon: '📚', label: 'All Cards' },
  { href: '/analytics', icon: '📊', label: 'Analytics' },
  { href: '/settings', icon: '⚙️', label: 'Settings' },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside style={{ width: 220, background: '#0d0d0d', borderRight: '1px solid #2a2a2a', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40 }}>
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block', marginBottom: 32, padding: '0 8px' }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#6366f1' }}>⚡ LeetLog</span>
      </Link>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {nav.map(item => {
          const active = path === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              color: active ? '#fafafa' : '#71717a',
              background: active ? '#1a1a2e' : 'transparent',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <button onClick={() => {}} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '10px 12px', color: '#71717a', fontSize: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>🚪</span> Sign out
      </button>
    </aside>
  )
}