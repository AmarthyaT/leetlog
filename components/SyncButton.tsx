'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SyncButton({ hasUsername }: { hasUsername: boolean }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function sync() {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const data = await res.json()
      setMsg(data.message ?? 'Synced!')
      router.refresh()
    } catch {
      setMsg('Sync failed')
    } finally {
      setLoading(false)
    }
  }

  if (!hasUsername) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {msg && <span style={{ color: '#71717a', fontSize: 13 }}>{msg}</span>}
      <button onClick={sync} disabled={loading} className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>
        {loading ? '⟳ Syncing…' : '⟳ Sync Now'}
      </button>
    </div>
  )
}
