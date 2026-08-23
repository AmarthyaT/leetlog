export const dynamic = 'force-dynamic'

export default async function RecallPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 12px' }}>All caught up!</h1>
      <p style={{ color: '#71717a', marginBottom: 32 }}>No cards due right now. Connect LeetCode in Settings to start.</p>
    </div>
  )
}