export const dynamic = 'force-dynamic'

export default async function CardsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>All Cards</h1>
        <p style={{ color: '#71717a', fontSize: 14, margin: 0 }}>0 problems</p>
      </div>
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
        <p style={{ fontSize: 16 }}>No cards yet. Connect LeetCode and start solving!</p>
      </div>
    </div>
  )
}