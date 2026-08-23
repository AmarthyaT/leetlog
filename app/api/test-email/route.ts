import { createClient } from '@/lib/supabase/server'
import { sendWeeklyDigest } from '@/lib/notifications/email'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

    const { data: cards } = await supabase.from('cards').select('*').eq('user_id', user.id).eq('card_status', 'ready').limit(3)

    await sendWeeklyDigest({
      userName: user.email.split('@')[0],
      userEmail: user.email,
      dueCount: 5,
      streak: 3,
      weakPattern: 'Dynamic Programming',
      topDue: (cards ?? []) as Parameters<typeof sendWeeklyDigest>[0]['topDue'],
    })

    return NextResponse.json({ message: 'Test email sent to ' + user.email })
  } catch (e: unknown) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
