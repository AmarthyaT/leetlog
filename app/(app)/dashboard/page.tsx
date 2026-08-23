export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 32px' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Streak', value: '0', sub: 'days' },
          { label: 'Total Cards', value: '0', sub: 'problems' },
          { label: 'Due Today', value: '0', sub: 'need review' },
          { label: 'Weakest Pattern', value: '—', sub: 'focus here' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 12, padding: '20px 24px' }}>
            <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, margin: '0 0 8px' }}>{s.label.toUpperCase()}</p>
            <p style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>{s.value}</p>
            <p style={{ color: '#71717a', fontSize: 12, margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Connect your LeetCode account</h2>
        <p style={{ fontSize: 14, marginBottom: 24 }}>Go to Settings and enter your username to start tracking.</p>
      </div>
    </div>
  )
}