'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Card, Rating } from '@/types'
import { PATTERN_COLORS } from '@/types'
import { getDueCards, scheduleCard } from '@/lib/fsrs'
import Link from 'next/link'

type Phase = 'loading' | 'empty' | 'question' | 'answer' | 'done'

export default function RecallPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [ratings, setRatings] = useState<Rating[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('cards').select('*').eq('user_id', user.id).eq('card_status', 'ready')
      const due = getDueCards((data ?? []) as Card[])
      setCards(due)
      setPhase(due.length === 0 ? 'empty' : 'question')
      setStartTime(Date.now())
    }
    load()
  }, [])

  const current = cards[idx]

  const rate = useCallback(async (rating: Rating) => {
    if (!current) return
    const elapsed = Math.round((Date.now() - startTime) / 1000)
    const updated = scheduleCard(current, rating)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await Promise.all([
      supabase.from('cards').update({ ...updated, updated_at: new Date().toISOString() }).eq('id', current.id),
      supabase.from('review_logs').insert({ card_id: current.id, user_id: user.id, rating, time_spent_seconds: elapsed }),
    ])

    setRatings(r => [...r, rating])
    if (idx + 1 >= cards.length) {
      setPhase('done')
    } else {
      setIdx(i => i + 1)
      setPhase('question')
      setStartTime(Date.now())
    }
  }, [current, idx, cards.length, startTime])

  if (phase === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <p style={{ color: '#71717a' }}>Loading your review queue…</p>
      </div>
    )
  }

  if (phase === 'empty') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 12px' }}>All caught up!</h1>
        <p style={{ color: '#71717a', marginBottom: 32 }}>No cards due right now. Come back tomorrow.</p>
        <Link href="/dashboard" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 10, fontWeight: 600 }}>Back to Dashboard</Link>
      </div>
    )
  }

  if (phase === 'done') {
    const counts = { again: ratings.filter(r => r === 1).length, hard: ratings.filter(r => r === 2).length, good: ratings.filter(r => r === 3).length, easy: ratings.filter(r => r === 4).length }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>Session complete!</h1>
        <p style={{ color: '#71717a', marginBottom: 32 }}>{cards.length} cards reviewed</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40, width: '100%', maxWidth: 400 }}>
          {[['Again', counts.again, '#f87171'], ['Hard', counts.hard, '#fb923c'], ['Good', counts.good, '#4ade80'], ['Easy', counts.easy, '#60a5fa']].map(([label, count, color]) => (
            <div key={label as string} style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 12, padding: '16px 8px' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: color as string }}>{count as number}</div>
              <div style={{ color: '#71717a', fontSize: 12, marginTop: 4 }}>{label as string}</div>
            </div>
          ))}
        </div>
        <Link href="/dashboard" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 10, fontWeight: 600 }}>Back to Dashboard</Link>
      </div>
    )
  }

  if (!current) return null

  const dc = current.difficulty === 'Hard' ? { bg: '#3a1a1a', text: '#f87171' } : current.difficulty === 'Medium' ? { bg: '#3a2a10', text: '#fbbf24' } : { bg: '#1a3a1a', text: '#4ade80' }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 0' }}>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ color: '#71717a', fontSize: 14 }}>Card {idx + 1} of {cards.length}</span>
        <div style={{ flex: 1, height: 4, background: '#2a2a2a', borderRadius: 2, margin: '0 16px' }}>
          <div style={{ width: `${((idx) / cards.length) * 100}%`, height: '100%', background: '#6366f1', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <Link href="/dashboard" style={{ color: '#71717a', fontSize: 13, textDecoration: 'none' }}>✕ Exit</Link>
      </div>

      {/* Card */}
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
        {/* Problem header - always shown */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ background: dc.bg, color: dc.text, borderRadius: 100, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{current.difficulty}</span>
            <span style={{ color: '#71717a', fontSize: 13 }}>#{current.problem_id}</span>
            <a href={`https://leetcode.com/problems/${current.problem_slug}`} target="_blank" rel="noreferrer" style={{ color: '#6366f1', fontSize: 12, textDecoration: 'none', marginLeft: 'auto' }}>View on LeetCode ↗</a>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>{current.problem_title}</h2>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {current.pattern_tags?.map(tag => {
              const colors = PATTERN_COLORS[tag] ?? { bg: '#1a1a2e', text: '#818cf8' }
              return <span key={tag} style={{ background: colors.bg, color: colors.text, borderRadius: 100, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{tag}</span>
            })}
          </div>
        </div>

        {/* Question phase */}
        {phase === 'question' && (
          <div style={{ padding: '28px 28px', textAlign: 'center' }}>
            <p style={{ color: '#71717a', fontSize: 15, marginBottom: 12 }}>Can you recall:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['The core intuition?', 'Time & space complexity?', 'The main gotchas?'].map(q => (
                <li key={q} style={{ color: '#fafafa', fontSize: 15 }}>• {q}</li>
              ))}
            </ul>
            <button onClick={() => setPhase('answer')} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              Reveal Answer
            </button>
          </div>
        )}

        {/* Answer phase */}
        {phase === 'answer' && (
          <div style={{ padding: '24px 28px' }}>
            {current.core_intuition && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 6px' }}>CORE INTUITION</p>
                <p style={{ color: '#fafafa', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{current.core_intuition}</p>
              </div>
            )}
            {(current.approach_summary || current.optimal_approach) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div style={{ background: '#1a1a1a', borderRadius: 10, padding: 14 }}>
                  <p style={{ color: '#71717a', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 6px' }}>YOUR APPROACH</p>
                  <p style={{ color: '#fafafa', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{current.approach_summary}</p>
                </div>
                <div style={{ background: '#0d2818', border: '1px solid #166534', borderRadius: 10, padding: 14 }}>
                  <p style={{ color: '#4ade80', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 6px' }}>OPTIMAL</p>
                  <p style={{ color: '#fafafa', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{current.optimal_approach}</p>
                </div>
              </div>
            )}
            {current.gotchas?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 8px' }}>GOTCHAS</p>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {current.gotchas.map((g, i) => <li key={i} style={{ color: '#fafafa', fontSize: 13, lineHeight: 1.6 }}>{g}</li>)}
                </ul>
              </div>
            )}
            <div style={{ display: 'flex', gap: 16, paddingTop: 16, borderTop: '1px solid #1a1a1a' }}>
              <span style={{ color: '#71717a', fontSize: 13 }}>⏱ <span style={{ color: '#fafafa', fontFamily: 'monospace' }}>{current.time_complexity}</span></span>
              <span style={{ color: '#71717a', fontSize: 13 }}>💾 <span style={{ color: '#fafafa', fontFamily: 'monospace' }}>{current.space_complexity}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* Rating buttons */}
      {phase === 'answer' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {([
            { rating: 1 as Rating, label: 'Again', sub: 'Forgot', color: '#f87171', bg: '#3a1a1a', border: '#7f1d1d' },
            { rating: 2 as Rating, label: 'Hard', sub: 'Struggled', color: '#fb923c', bg: '#3a2a10', border: '#7c2d12' },
            { rating: 3 as Rating, label: 'Good', sub: 'Got it', color: '#4ade80', bg: '#1a3a1a', border: '#14532d' },
            { rating: 4 as Rating, label: 'Easy', sub: 'Nailed it', color: '#60a5fa', bg: '#1a2a3a', border: '#1e3a5f' },
          ]).map(({ rating, label, sub, color, bg, border }) => (
            <button key={rating} onClick={() => rate(rating)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '16px 8px', cursor: 'pointer', transition: 'opacity 0.15s', textAlign: 'center' }}>
              <div style={{ color, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{label}</div>
              <div style={{ color: '#71717a', fontSize: 11 }}>{sub}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
