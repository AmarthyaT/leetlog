import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getRecentAccepted, getProblemDetail } from '@/lib/leetcode'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!profile?.leetcode_username) {
      return NextResponse.json({ message: 'No LeetCode username set. Go to Settings.' })
    }

    const submissions = await getRecentAccepted(profile.leetcode_username, 20)
    const lastTs = profile.last_submission_timestamp ?? 0
    const newSubs = submissions.filter(s => parseInt(s.timestamp) > lastTs)

    if (newSubs.length === 0) {
      await supabase.from('profiles').update({ last_sync_at: new Date().toISOString() }).eq('id', user.id)
      return NextResponse.json({ message: 'Already up to date!' })
    }

    const service = createServiceClient()
    let imported = 0

    for (const sub of newSubs.reverse()) {
      try {
        const detail = await getProblemDetail(sub.titleSlug)
        const card = {
          user_id: user.id,
          problem_id: parseInt(detail.questionId),
          problem_title: detail.title,
          problem_slug: detail.titleSlug,
          difficulty: detail.difficulty as 'Easy' | 'Medium' | 'Hard',
          lc_topic_tags: detail.topicTags.map(t => t.name),
          language: sub.lang,
          submission_timestamp: parseInt(sub.timestamp),
          card_status: 'pending',
        }

        const { data: inserted } = await service
          .from('cards')
          .upsert(card, { onConflict: 'user_id,problem_id', ignoreDuplicates: false })
          .select()
          .single()

        if (inserted) {
          imported++
          // Trigger AI card generation async (fire and forget)
          fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-card`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardId: inserted.id, userId: user.id }),
          }).catch(() => {})
        }

        await new Promise(r => setTimeout(r, 300)) // small delay
      } catch (e) {
        console.error('Error importing', sub.titleSlug, e)
      }
    }

    const maxTs = Math.max(...newSubs.map(s => parseInt(s.timestamp)))
    await service.from('profiles').update({
      last_sync_at: new Date().toISOString(),
      last_submission_timestamp: maxTs,
    }).eq('id', user.id)

    return NextResponse.json({ message: `Imported ${imported} new solve${imported !== 1 ? 's' : ''}!` })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
