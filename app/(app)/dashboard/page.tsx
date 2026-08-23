export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDueCards } from '@/lib/fsrs'
import type { Card, Profile } from '@/types'
import Link from 'next/link'
import SyncButton from '@/components/SyncButton'

function difficultyColor(d: string | null) {
  if (d === 'Hard') return { bg: '#3a1a1a', text: '#f87171' }
  if (d === 'Medium') return { bg: '#3a2a10', text: '#fbbf24' }
  return { bg: '#1a3a1a', text: '#4ade80' }
}

function PatternTag({ tag }: { tag: string }) {
  return (
    <span style={{ background: '#1e1b4b', color: '#818cf8', borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{tag}</span>
  )
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: allCards }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('cards').select('*').eq('user_id', user.id).eq('card_status', 'ready').order('created_at', { ascending: false }),
  ])

  const cards = (allCards ?? []) as Card[]
  const dueCards = getDueCards(cards)

  // Streak: consecutive days with a review
  const { data: reviews } = await supabase
    .from('review_logs')
    .select('reviewed_at')
    .eq('user_id', user.id)
    .order('reviewed_at', { ascending: false })

  const reviewDays = new Set(
    (reviews ?? []).map(r => new Date(r.reviewed_at).toDateString())
  )
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (reviewDays.has(d.toDateString())) streak++
    else if (i > 0) break
  }

  // Weak pattern
  const patternCounts: Record<string, { total: number; count: number }> = {}
  cards.forEach(c => {
    c.pattern_tags?.forEach(p => {
      if (!patternCounts[p]) patternCounts[p] = { total: 0, count: 0 }
      patternCounts[p].count++
    })
  })
  const weakPattern = Object.entries(patternCounts)
    .filter(([, v]) => v.count < 3)
    .sort((a, b) => a[1].count - b[1].count)[0]?.[0] ?? null

  const p = profile as Profile | null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#71717a', fontSize: 14, margin: '4px 0 0' }}>
            {p?.leetcode_username ? `Syncing @${p.leetcode_username}` : 'Connect your LeetCode to start'}
            {p?.last_sync_at && <span style={{ marginLeft: 8 }}>· Last sync: {new Date(p.last_sync_at).toLocaleString()}</span>}
          </p>
        </div>
        <SyncButton hasUsername={!!p?.leetcode_username} />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Streak', value: `🔥 ${streak}`, sub: 'days' },
          { label: 'Total Cards', value: cards.length, sub: 'problems logged' },
          { label: 'Due Today', value: dueCards.length, sub: 'need review', accent: dueCards.length > 0 },
          { label: 'Weakest Pattern', value: weakPattern ?? '—', sub: 'focus here' },
        ].map(s => (
          <div key={s.label} style={{ background: '#111111', border: `1px solid ${s.accent ? '#6366f1' : '#2a2a2a'}`, borderRadius: 12, padding: '20px 24px' }}>
            <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 8px' }}>{s.label.toUpperCase()}</p>
            <p style={{ fontSize: s.label === 'Weakest Pattern' ? 16 : 28, fontWeight: 700, margin: '0 0 4px', color: s.accent ? '#6366f1' : '#fafafa' }}>{s.value}</p>
            <p style={{ color: '#71717a', fontSize: 12, margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* No LeetCode connected */}
      {!p?.leetcode_username && (
        <div style={{ background: '#111111', border: '2px dashed #2a2a2a', borderRadius: 16, padding: 40, textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔗</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Connect your LeetCode account</h2>
          <p style={{ color: '#71717a', fontSize: 14, marginBottom: 24 }}>Enter your username and we'll auto-import all your accepted submissions.</p>
          <Link href="/settings" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 14, display: 'inline-block' }}>Go to Settings →</Link>
        </div>
      )}

      {/* Due cards */}
      {dueCards.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Due for review ({dueCards.length})</h2>
            <Link href="/recall" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, display: 'inline-block' }}>Start Session →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dueCards.slice(0, 8).map(card => {
              const dc = difficultyColor(card.difficulty)
              const daysOverdue = Math.floor((Date.now() - new Date(card.due_date).getTime()) / 86400000)
              return (
                <div key={card.id} style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ background: dc.bg, color: dc.text, borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{card.difficulty}</span>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{card.problem_title}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {card.pattern_tags?.slice(0, 2).map(t => <PatternTag key={t} tag={t} />)}
                  </div>
                  {daysOverdue > 0 && <span style={{ color: '#f87171', fontSize: 12, whiteSpace: 'nowrap' }}>{daysOverdue}d overdue</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent cards */}
      {cards.length > 0 && dueCards.length === 0 && (
        <div style={{ background: '#0d2818', border: '1px solid #166534', borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 32 }}>
          <p style={{ color: '#4ade80', fontWeight: 600, fontSize: 16, margin: 0 }}>🎉 All caught up! No cards due.</p>
        </div>
      )}

      {/* Recent solves */}
      {cards.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Recent solves</h2>
            <Link href="/cards" style={{ color: '#6366f1', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {cards.slice(0, 6).map(card => {
              const dc = difficultyColor(card.difficulty)
              return (
                <div key={card.id} style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ background: dc.bg, color: dc.text, borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{card.difficulty}</span>
                    <span style={{ color: '#71717a', fontSize: 12 }}>#{card.problem_id}</span>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 10px' }}>{card.problem_title}</p>
                  {card.core_intuition && <p style={{ color: '#71717a', fontSize: 13, lineHeight: 1.5, margin: '0 0 12px' }}>{card.core_intuition}</p>}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {card.pattern_tags?.slice(0, 2).map(t => <PatternTag key={t} tag={t} />)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
