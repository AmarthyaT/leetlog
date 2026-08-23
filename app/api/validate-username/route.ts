import { verifyUsername } from '@/lib/leetcode'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')
  if (!username) return NextResponse.json({ valid: false })
  const valid = await verifyUsername(username)
  return NextResponse.json({ valid })
}
