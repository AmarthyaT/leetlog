'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [email, setEmail] = useState('')
  const [emailNotif, setEmailNotif] = useState(false)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data as Profile)
        setUsername(data.leetcode_username ?? '')
        setGroqKey(data.groq_api_key ?? '')
        setEmailNotif(data.email_notifications ?? false)
      }
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    setMsg(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      // Validate LeetCode username if changed
      if (username && username !== profile?.leetcode_username) {
        const res = await fetch(`/api/validate-username?username=${username}`)
        const data = await res.json()
        if (!data.valid) {
          setMsg({ text: `LeetCode user "${username}" not found`, ok: false })
          setSaving(false)
          return
        }
      }

      await supabase.from('profiles').update({
        leetcode_username: username || null,
        groq_api_key: groqKey || null,
        email_notifications: emailNotif,
      }).eq('id', user.id)

      setMsg({ text: 'Settings saved!', ok: true })
    } catch (e: unknown) {
      setMsg({ text: (e as Error).message, ok: false })
    } finally {
      setSaving(false)
    }
  }

  async function syncNow() {
    setSyncing(true)
    setMsg(null)
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const data = await res.json()
      setMsg({ text: data.message ?? 'Sync complete!', ok: true })
    } catch {
      setMsg({ text: 'Sync failed', ok: false })
    } finally {
      setSyncing(false)
    }
  }

  async function testEmail() {
    const res = await fetch('/api/test-email', { method: 'POST' })
    const d = await res.json()
    setMsg({ text: d.message ?? 'Test email sent!', ok: res.ok })
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28, marginBottom: 24 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>{title}</h2>
      {children}
    </div>
  )

  const Label = ({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) => (
    <div style={{ marginBottom: 8 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: '#fafafa' }}>{children}</label>
      {sub && <p style={{ color: '#71717a', fontSize: 12, margin: '2px 0 0' }}>{sub}</p>}
    </div>
  )

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 32px' }}>Settings</h1>

      {msg && (
        <div style={{ background: msg.ok ? '#0d2818' : '#3a1a1a', border: `1px solid ${msg.ok ? '#166534' : '#7f1d1d'}`, borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: msg.ok ? '#4ade80' : '#f87171', fontSize: 14 }}>
          {msg.text}
        </div>
      )}

      {/* LeetCode */}
      <Section title="🔗 LeetCode Connection">
        <Label sub="We'll auto-import your accepted submissions hourly">LeetCode Username</Label>
        <div style={{ display: 'flex', gap: 12 }}>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. amarthya41" style={{ flex: 1 }} />
          <button onClick={syncNow} disabled={syncing || !username} className="btn-ghost" style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}>
            {syncing ? '⟳ Syncing…' : '⟳ Sync Now'}
          </button>
        </div>
        {profile?.last_sync_at && (
          <p style={{ color: '#71717a', fontSize: 12, marginTop: 8 }}>Last sync: {new Date(profile.last_sync_at).toLocaleString()}</p>
        )}
      </Section>

      {/* Groq */}
      <Section title="🤖 Groq API Key">
        <Label sub={<>Get a free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>console.groq.com</a> — used to generate AI revision cards</>}>API Key</Label>
        <input type="password" value={groqKey} onChange={e => setGroqKey(e.target.value)} placeholder="gsk_…" />
        <p style={{ color: '#71717a', fontSize: 12, marginTop: 8 }}>Your key is stored encrypted. Never shared.</p>
      </Section>

      {/* Email notifications */}
      <Section title="📧 Email Notifications">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Weekly Digest</p>
            <p style={{ color: '#71717a', fontSize: 12, margin: '2px 0 0' }}>Every Sunday — due cards, streak, weak patterns</p>
          </div>
          <button onClick={() => setEmailNotif(!emailNotif)} style={{ width: 44, height: 24, borderRadius: 12, background: emailNotif ? '#6366f1' : '#2a2a2a', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: emailNotif ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
        </div>
        {emailNotif && (
          <div>
            <Label>Email address</Label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input value={email} disabled style={{ flex: 1, opacity: 0.7 }} />
              <button onClick={testEmail} className="btn-ghost" style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}>Send Test</button>
            </div>
            <p style={{ color: '#71717a', fontSize: 12, marginTop: 8 }}>Using your sign-in email. Change via account settings.</p>
          </div>
        )}
      </Section>

      {/* Save */}
      <button onClick={save} disabled={saving} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  )
}
