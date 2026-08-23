import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If logged in, go to dashboard. Otherwise go to settings to set up
  if (user) {
    redirect('/dashboard')
  }

  // If not logged in, go directly to settings (no login needed)
  redirect('/settings')
}