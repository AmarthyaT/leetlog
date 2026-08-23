import { createServiceClient } from '@/lib/supabase/server'
import { generateEssenceCard } from '@/lib/groq'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { cardId, userId } = await req.json()
    if (!cardId || !userId) return NextResponse.json({ error: 'Missing cardId or userId' }, { status: 400 })

    const service = createServiceClient()

    // Get card + user's Groq key
    const [{ data: card }, { data: profile }] = await Promise.all([
      service.from('cards').select('*').eq('id', cardId).single(),
      service.from('profiles').select('groq_api_key').eq('id', userId).single(),
    ])

    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    if (!profile?.groq_api_key) {
      await service.from('cards').update({ card_status: 'failed' }).eq('id', cardId)
      return NextResponse.json({ error: 'No Groq API key. Add one in Settings.' }, { status: 400 })
    }

    // Mark as generating
    await service.from('cards').update({ card_status: 'generating' }).eq('id', cardId)

    const generated = await generateEssenceCard({
      problem_title: card.problem_title,
      problem_id: card.problem_id,
      difficulty: card.difficulty ?? 'Medium',
      lc_topic_tags: card.lc_topic_tags ?? [],
      language: card.language ?? 'unknown',
      submitted_code: card.submitted_code,
    }, profile.groq_api_key)

    await service.from('cards').update({
      card_status: 'ready',
      pattern_tags: generated.pattern_tags,
      core_intuition: generated.core_intuition,
      approach_summary: generated.approach_summary,
      optimal_approach: generated.optimal_approach,
      time_complexity: generated.time_complexity,
      space_complexity: generated.space_complexity,
      gotchas: generated.gotchas,
      struggle_assessment: generated.struggle_assessment,
      updated_at: new Date().toISOString(),
    }).eq('id', cardId)

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    console.error('Card generation error:', e)
    const { cardId } = await (async () => { try { return await (req.clone() as Request).json() } catch { return {} } })()
    if (cardId) {
      const service = createServiceClient()
      await service.from('cards').update({ card_status: 'failed' }).eq('id', cardId)
    }
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
