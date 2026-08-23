export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Analytics</h1>
      <p style={{ color: '#71717a', fontSize: 14, margin: '0 0 32px' }}>Track your DSA progress over time</p>
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
        <p style={{ fontSize: 16 }}>No data yet. Connect your LeetCode in Settings!</p>
      </div>
    </div>
  )
}