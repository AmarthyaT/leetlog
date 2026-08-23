export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Card } from '@/types'
import { PATTERN_COLORS } from '@/types'
import { isDue } from '@/lib/fsrs'

function difficultyColor(d: string | null) {
  if (d === 'Hard') return { bg: '#3a1a1a', text: '#f87171' }
  if (d === 'Medium') return { bg: '#3a2a10', text: '#fbbf24' }
  return { bg: '#1a3a1a', text: '#4ade80' }
}

function EssenceCard({ card }: { card: Card }) {
  const dc = difficultyColor(card.difficulty)
  const due = isDue(card)

  if (card.card_status === 'pending' || card.card_status === 'generating') {
    return (
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24, opacity: 0.7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ background: dc.bg, color: dc.text, borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{card.difficulty}</span>
          <span style={{ color: '#71717a', fontSize: 12 }}>#{card.problem_id}</span>
        </div>
        <p style={{ fontWeight: 600, fontSize: 15, margin: '0 0 12px' }}>{card.problem_title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#71717a', fontSize: 13 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#6366f1', animation: 'pulse 1s infinite' }} />
          Generating AI card…
        </div>
      </div>
    )
  }

  if (card.card_status === 'failed') {
    return (
      <div style={{ background: '#111111', border: '1px solid #3a1a1a', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ background: dc.bg, color: dc.text, borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{card.difficulty}</span>
          <span style={{ color: '#71717a', fontSize: 12 }}>#{card.problem_id}</span>
        </div>
        <p style={{ fontWeight: 600, fontSize: 15, margin: '0 0 12px' }}>{card.problem_title}</p>
        <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 12px' }}>AI card generation failed.</p>
        <form action={`/api/retry-card?id=${card.id}`} method="POST">
          <button type="submit" style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>Retry</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ background: '#111111', border: `1px solid ${due ? '#4c1d95' : '#2a2a2a'}`, borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: dc.bg, color: dc.text, borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{card.difficulty}</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>#{card.problem_id} · {card.problem_title}</span>
        </div>
        <a href={`https://leetcode.com/problems/${card.problem_slug}`} target="_blank" rel="noreferrer" style={{ color: '#71717a', fontSize: 11, textDecoration: 'none' }}>↗ LC</a>
      </div>

      <div style={{ padding: 20 }}>
        {/* Pattern tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {card.pattern_tags?.map(tag => {
            const colors = PATTERN_COLORS[tag] ?? { bg: '#1a1a2e', text: '#818cf8' }
            return <span key={tag} style={{ background: colors.bg, color: colors.text, borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{tag}</span>
          })}
          {card.language && <span style={{ background: '#1a1a1a', color: '#71717a', borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 500, marginLeft: 'auto' }}>{card.language}</span>}
        </div>

        {/* Core intuition */}
        {card.core_intuition && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 6px' }}>CORE INTUITION</p>
            <p style={{ color: '#fafafa', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{card.core_intuition}</p>
          </div>
        )}

        {/* Your approach vs Optimal */}
        {(card.approach_summary || card.optimal_approach) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#1a1a1a', borderRadius: 8, padding: 12 }}>
              <p style={{ color: '#71717a', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 6px' }}>YOUR APPROACH</p>
              <p style={{ color: '#fafafa', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{card.approach_summary}</p>
            </div>
            <div style={{ background: '#0d2a1a', borderRadius: 8, padding: 12, border: '1px solid #166534' }}>
              <p style={{ color: '#4ade80', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 6px' }}>OPTIMAL</p>
              <p style={{ color: '#fafafa', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{card.optimal_approach}</p>
            </div>
          </div>
        )}

        {/* Gotchas */}
        {card.gotchas?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 8px' }}>GOTCHAS</p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {card.gotchas.map((g, i) => (
                <li key={i} style={{ color: '#fbbf24', fontSize: 13, lineHeight: 1.6 }}><span style={{ color: '#fafafa' }}>{g}</span></li>
              ))}
            </ul>
          </div>
        )}

        {/* TC / SC */}
        <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid #1a1a1a' }}>
          <span style={{ color: '#71717a', fontSize: 12 }}>⏱ <span style={{ color: '#fafafa', fontFamily: 'monospace' }}>{card.time_complexity}</span></span>
          <span style={{ color: '#71717a', fontSize: 12 }}>💾 <span style={{ color: '#fafafa', fontFamily: 'monospace' }}>{card.space_complexity}</span></span>
          {due && <span style={{ marginLeft: 'auto', background: '#2d1b4e', color: '#a78bfa', borderRadius: 100, padding: '1px 8px', fontSize: 11, fontWeight: 600 }}>Due</span>}
        </div>
      </div>
    </div>
  )
}

export default async function CardsPage({ searchParams }: { searchParams: { pattern?: string; difficulty?: string; q?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  let cards = (data ?? []) as Card[]

  if (searchParams.difficulty) cards = cards.filter(c => c.difficulty === searchParams.difficulty)
  if (searchParams.pattern) cards = cards.filter(c => c.pattern_tags?.includes(searchParams.pattern!))
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    cards = cards.filter(c => c.problem_title.toLowerCase().includes(q))
  }

  const allPatterns = Array.from(new Set((data ?? []).flatMap((c: Card) => c.pattern_tags ?? [])))
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>All Cards</h1>
        <p style={{ color: '#71717a', fontSize: 14, margin: 0 }}>{cards.length} problems</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <a href="/cards" style={{ textDecoration: 'none', background: !searchParams.difficulty && !searchParams.pattern ? '#6366f1' : '#1a1a1a', color: '#fafafa', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 500, border: '1px solid #2a2a2a' }}>All</a>
        {['Easy', 'Medium', 'Hard'].map(d => (
          <a key={d} href={`/cards?difficulty=${d}`} style={{ textDecoration: 'none', background: searchParams.difficulty === d ? '#6366f1' : '#1a1a1a', color: '#fafafa', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 500, border: '1px solid #2a2a2a' }}>{d}</a>
        ))}
      </div>

      {cards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16 }}>No cards yet. Connect LeetCode and start solving!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {cards.map(card => <EssenceCard key={card.id} card={card} />)}
        </div>
      )}
    </div>
  )
}
