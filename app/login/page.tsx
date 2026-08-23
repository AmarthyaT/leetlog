'use client'
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function signInWithGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  async function signInWithEmail() {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
    if (!error) setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#6366f1', fontWeight: 700, fontSize: 20, textDecoration: 'none', marginBottom: 32 }}>⚡ LeetLog</Link>
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>Welcome back</h1>
          <p style={{ color: '#71717a', fontSize: 14, textAlign: 'center', margin: '0 0 28px' }}>Sign in to your LeetLog account</p>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Check your email</p>
              <p style={{ color: '#71717a', fontSize: 14 }}>We sent a magic link to <strong style={{ color: '#fafafa' }}>{email}</strong></p>
            </div>
          ) : (
            <>
              <button onClick={signInWithGoogle} disabled={loading} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 20px', color: '#fafafa', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
                <span style={{ color: '#71717a', fontSize: 12 }}>or</span>
                <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
              </div>

              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && signInWithEmail()} style={{ marginBottom: 12 }} />
              <button onClick={signInWithEmail} disabled={loading || !email} className="btn-primary" style={{ width: '100%' }}>
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </>
          )}
        </div>
        <p style={{ color: '#71717a', fontSize: 12, textAlign: 'center', marginTop: 20 }}>Free forever. No credit card.</p>
      </div>
    </div>
  )
}
