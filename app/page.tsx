import Link from 'next/link'

const features = [
  { icon: '⚡', title: 'Auto-Import', desc: 'Connects to your LeetCode. Every accepted submission is pulled in automatically — no manual logging.' },
  { icon: '🧠', title: 'AI Essence Cards', desc: 'Groq AI reads your code and generates: pattern, core intuition, your approach vs optimal, TC/SC, gotchas.' },
  { icon: '🔄', title: 'Spaced Repetition', desc: 'FSRS algorithm (same science as Anki) schedules when each problem resurfaces — hard ones sooner, easy ones later.' },
  { icon: '📊', title: 'Pattern Analytics', desc: 'See your strength across all 25 DSA patterns. Know exactly where you\'re weak before an interview.' },
  { icon: '📧', title: 'Weekly Digest', desc: 'Every Sunday, get an email showing your due cards, current streak, and weakest patterns.' },
  { icon: '🔒', title: 'Your Data', desc: 'All stored in your own Supabase instance. Self-host for free. No vendor lock-in.' },
]

const steps = [
  { n: '01', title: 'Connect LeetCode', desc: 'Enter your LeetCode username. We pull your accepted submissions hourly.' },
  { n: '02', title: 'Cards Auto-Generate', desc: 'Each solve gets an AI Essence Card — pattern, intuition, gotchas. While you sleep.' },
  { n: '03', title: 'Revise Weekly', desc: 'Log in, hit Recall, rate cards. FSRS handles the schedule. Never blank in an interview again.' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #2a2a2a', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#0a0a0aee', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#6366f1' }}>⚡ LeetLog</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#71717a', textDecoration: 'none', fontSize: 14 }}>Sign in</Link>
          <Link href="/login" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14, borderRadius: 8, background: '#6366f1', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '100px 24px 80px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#1e1b4b', border: '1px solid #4338ca', borderRadius: 100, padding: '6px 16px', fontSize: 12, color: '#818cf8', fontWeight: 600, marginBottom: 24, letterSpacing: '0.05em' }}>FREE · OPEN SOURCE · SELF-HOSTABLE</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 20px', color: '#fafafa' }}>
          Stop forgetting what<br />
          <span style={{ color: '#6366f1' }}>you solve on LeetCode</span>
        </h1>
        <p style={{ fontSize: 18, color: '#71717a', lineHeight: 1.6, margin: '0 0 40px', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
          Connect your account. Every accepted submission gets an AI revision card. FSRS schedules reviews. Weekly digest keeps you sharp.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 16, display: 'inline-block' }}>Connect LeetCode →</Link>
          <a href="https://github.com" style={{ background: 'transparent', color: '#fafafa', textDecoration: 'none', padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: 16, border: '1px solid #2a2a2a', display: 'inline-block' }}>⭐ Star on GitHub</a>
        </div>
      </div>

      {/* Sample card */}
      <div style={{ maxWidth: 600, margin: '0 auto 100px', padding: '0 24px' }}>
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ background: '#854d0e', color: '#fde68a', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600, marginRight: 8 }}>Medium</span>
              <span style={{ color: '#fafafa', fontWeight: 600 }}>#3 · Longest Substring Without Repeating Chars</span>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span style={{ background: '#1a3a2a', color: '#4ade80', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>Sliding Window</span>
              <span style={{ background: '#3b2a1a', color: '#fb923c', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>Hash Map</span>
            </div>
            <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, margin: '0 0 6px', letterSpacing: '0.05em' }}>CORE INTUITION</p>
            <p style={{ color: '#fafafa', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>Expand right pointer, shrink left when duplicate found. HashMap tracks last seen index for O(1) window adjustment.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: '#1a1a1a', borderRadius: 8, padding: 12 }}>
                <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, margin: '0 0 6px', letterSpacing: '0.05em' }}>YOUR APPROACH</p>
                <p style={{ color: '#fafafa', fontSize: 13, margin: 0 }}>Used Set + two pointers, O(2n) time</p>
              </div>
              <div style={{ background: '#1a1a1a', borderRadius: 8, padding: 12 }}>
                <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, margin: '0 0 6px', letterSpacing: '0.05em' }}>OPTIMAL</p>
                <p style={{ color: '#fafafa', fontSize: 13, margin: 0 }}>HashMap → index, single pass O(n)</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ color: '#71717a', fontSize: 12 }}>⏱ <span style={{ color: '#fafafa' }}>O(n)</span></span>
              <span style={{ color: '#71717a', fontSize: 12 }}>💾 <span style={{ color: '#fafafa' }}>O(min(n,m))</span></span>
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', color: '#71717a', fontSize: 13, marginTop: 12 }}>↑ Auto-generated from your submitted code</p>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 900, margin: '0 auto 100px', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 60 }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {steps.map(s => (
            <div key={s.n} style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28 }}>
              <div style={{ color: '#6366f1', fontSize: 13, fontWeight: 700, fontFamily: 'monospace', marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>{s.title}</h3>
              <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: '0 auto 100px', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 60 }}>Everything you need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid #2a2a2a' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 16px' }}>Ready to actually remember what you grind?</h2>
        <p style={{ color: '#71717a', marginBottom: 32 }}>Free forever. No card needed. Just connect your LeetCode.</p>
        <Link href="/login" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', padding: '16px 40px', borderRadius: 12, fontWeight: 700, fontSize: 18, display: 'inline-block' }}>Start for free →</Link>
      </div>
    </div>
  )
}
