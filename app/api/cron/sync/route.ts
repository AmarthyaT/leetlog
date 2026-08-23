import { createServiceClient } from '@/lib/supabase/server'
import { getRecentAccepted, getProblemDetail } from '@/lib/leetcode'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = createServiceClient()
  const { data: profiles } = await service
    .from('profiles')
    .select('id, leetcode_username, groq_api_key, last_submission_timestamp')
    .not('leetcode_username', 'is', null)

  if (!profiles?.length) return NextResponse.json({ processed: 0 })

  let totalImported = 0

  for (const profile of profiles) {
    try {
      const submissions = await getRecentAccepted(profile.leetcode_username, 20)
      const lastTs = profile.last_submission_timestamp ?? 0
      const newSubs = submissions.filter((s: { timestamp: string }) => parseInt(s.timestamp) > lastTs)

      for (const sub of newSubs.reverse()) {
        try {
          const detail = await getProblemDetail(sub.titleSlug)
          const card = {
            user_id: profile.id,
            problem_id: parseInt(detail.questionId),
            problem_title: detail.title,
            problem_slug: detail.titleSlug,
            difficulty: detail.difficulty,
            lc_topic_tags: detail.topicTags.map((t: { name: string }) => t.name),
            language: sub.lang,
            submission_timestamp: parseInt(sub.timestamp),
            card_status: 'pending',
          }

          const { data: inserted } = await service
            .from('cards')
            .upsert(card, { onConflict: 'user_id,problem_id', ignoreDuplicates: true })
            .select()
            .single()

          if (inserted) {
            totalImported++
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-card`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cardId: inserted.id, userId: profile.id }),
            })
          }
          await new Promise(r => setTimeout(r, 300))
        } catch (e) {
          console.error('Problem import error:', sub.titleSlug, e)
        }
      }

      if (newSubs.length > 0) {
        const maxTs = Math.max(...newSubs.map((s: { timestamp: string }) => parseInt(s.timestamp)))
        await service.from('profiles').update({
          last_sync_at: new Date().toISOString(),
          last_submission_timestamp: maxTs,
        }).eq('id', profile.id)
      }

      await new Promise(r => setTimeout(r, 500)) // rate limit between users
    } catch (e) {
      console.error('User sync error:', profile.id, e)
    }
  }

  return NextResponse.json({ processed: profiles.length, imported: totalImported })
}
