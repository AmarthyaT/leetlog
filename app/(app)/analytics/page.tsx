export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Card } from '@/types'
import AnalyticsCharts from '@/components/AnalyticsCharts'

export default async function AnalyticsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: cards }, { data: reviews }] = await Promise.all([
    supabase.from('cards').select('*').eq('user_id', user.id).eq('card_status', 'ready'),
    supabase.from('review_logs').select('*').eq('user_id', user.id).order('reviewed_at', { ascending: true }),
  ])

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Analytics</h1>
      <p style={{ color: '#71717a', fontSize: 14, margin: '0 0 32px' }}>Track your DSA progress over time</p>
      <AnalyticsCharts cards={(cards ?? []) as Card[]} reviews={reviews ?? []} />
    </div>
  )
}
