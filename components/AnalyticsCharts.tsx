'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import type { Card } from '@/types'

interface Review { rating: number; reviewed_at: string }

export default function AnalyticsCharts({ cards, reviews }: { cards: Card[]; reviews: Review[] }) {
  // Pattern distribution
  const patternMap: Record<string, number> = {}
  cards.forEach(c => c.pattern_tags?.forEach(p => { patternMap[p] = (patternMap[p] ?? 0) + 1 }))
  const patternData = Object.entries(patternMap).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([name, count]) => ({ name, count }))

  // Difficulty breakdown
  const diffMap: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 }
  cards.forEach(c => { if (c.difficulty) diffMap[c.difficulty]++ })
  const diffData = Object.entries(diffMap).map(([name, value]) => ({ name, value }))
  const DIFF_COLORS = ['#4ade80', '#fbbf24', '#f87171']

  // Language breakdown
  const langMap: Record<string, number> = {}
  cards.forEach(c => { if (c.language) langMap[c.language] = (langMap[c.language] ?? 0) + 1 })
  const langData = Object.entries(langMap).map(([name, value]) => ({ name, value }))
  const LANG_COLORS = ['#818cf8', '#60a5fa', '#34d399', '#fb923c', '#f472b6', '#a78bfa']

  // Reviews per week (last 8 weeks)
  const weekData: Record<string, number> = {}
  const now = new Date()
  for (let w = 7; w >= 0; w--) {
    const d = new Date(now)
    d.setDate(d.getDate() - w * 7)
    const key = `W${8 - w}`
    weekData[key] = 0
  }
  reviews.forEach(r => {
    const d = new Date(r.reviewed_at)
    const weeksAgo = Math.floor((now.getTime() - d.getTime()) / (7 * 86400000))
    if (weeksAgo <= 7) {
      const key = `W${8 - weeksAgo}`
      if (weekData[key] !== undefined) weekData[key]++
    }
  })
  const weekChartData = Object.entries(weekData).map(([week, count]) => ({ week, count }))

  // Solve heatmap — daily for last 90 days
  const dayMap: Record<string, number> = {}
  cards.forEach(c => {
    const day = new Date(c.created_at).toDateString()
    dayMap[day] = (dayMap[day] ?? 0) + 1
  })
  const heatmapDays: { date: Date; count: number }[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    heatmapDays.push({ date: d, count: dayMap[d.toDateString()] ?? 0 })
  }

  const totalReviews = reviews.length
  const goodOrEasy = reviews.filter(r => r.rating >= 3).length
  const retention = totalReviews > 0 ? Math.round((goodOrEasy / totalReviews) * 100) : 0

  const customTooltipStyle = { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fafafa', fontSize: 13 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Reviews', value: totalReviews },
          { label: 'Retention Rate', value: `${retention}%` },
          { label: 'Problems Logged', value: cards.length },
          { label: 'Languages Used', value: Object.keys(langMap).length },
        ].map(s => (
          <div key={s.label} style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 12, padding: '20px 24px' }}>
            <p style={{ color: '#71717a', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 8px' }}>{s.label.toUpperCase()}</p>
            <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Solve heatmap */}
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Solve Activity — Last 90 Days</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {heatmapDays.map((d, i) => {
            const intensity = d.count === 0 ? '#1a1a1a' : d.count === 1 ? '#1e3a5f' : d.count <= 3 ? '#2563eb' : '#6366f1'
            return (
              <div key={i} title={`${d.date.toDateString()}: ${d.count} solve${d.count !== 1 ? 's' : ''}`} style={{ width: 12, height: 12, borderRadius: 2, background: intensity, cursor: 'default' }} />
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <span style={{ color: '#71717a', fontSize: 11 }}>Less</span>
          {['#1a1a1a', '#1e3a5f', '#2563eb', '#6366f1'].map(c => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
          ))}
          <span style={{ color: '#71717a', fontSize: 11 }}>More</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Reviews per week */}
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Reviews per Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekChartData}>
              <XAxis dataKey="week" stroke="#71717a" tick={{ fontSize: 12 }} />
              <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty breakdown */}
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Difficulty Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={diffData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {diffData.map((_, i) => <Cell key={i} fill={DIFF_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pattern distribution */}
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Pattern Distribution</h3>
        {patternData.length === 0 ? (
          <p style={{ color: '#71717a', fontSize: 14 }}>No data yet. Start solving!</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patternData} layout="vertical">
              <XAxis type="number" stroke="#71717a" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" stroke="#71717a" tick={{ fontSize: 12 }} width={140} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Language breakdown */}
      {langData.length > 0 && (
        <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Language Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={langData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {langData.map((_, i) => <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
