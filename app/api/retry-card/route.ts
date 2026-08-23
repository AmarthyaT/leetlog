import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.redirect('/')

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect('/login')

  const { data: card } = await supabase.from('cards').select('id').eq('id', id).eq('user_id', user.id).single()
  if (!card) return NextResponse.redirect('/cards')

  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId: id, userId: user.id }),
  })

  return NextResponse.redirect(new URL('/cards', req.url))
}
