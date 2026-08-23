'use client'
export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 32px' }}>Settings</h1>

      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>🔗 LeetCode Connection</h2>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#fafafa' }}>LeetCode Username</label>
          <p style={{ color: '#71717a', fontSize: 12, margin: '2px 0 0' }}>We'll auto-import your accepted submissions hourly</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input placeholder="amarthyat" style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fafafa', padding: '10px 14px', fontSize: 14, fontFamily: 'inherit' }} />
          <button style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 8, padding: '10px 16px', color: '#71717a', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>⟳ Sync Now</button>
        </div>
      </div>

      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>🤖 Groq API Key</h2>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#fafafa' }}>API Key</label>
          <p style={{ color: '#71717a', fontSize: 12, margin: '2px 0 0' }}>Get a free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>console.groq.com</a></p>
        </div>
        <input type="password" placeholder="gsk_..." style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fafafa', padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', width: '100%' }} />
        <p style={{ color: '#71717a', fontSize: 12, marginTop: 8 }}>Your key is stored encrypted. Never shared.</p>
      </div>

      <button style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', padding: '14px', fontSize: 15, fontWeight: 600, borderRadius: 8, cursor: 'pointer' }}>Save Settings</button>
    </div>
  )
}