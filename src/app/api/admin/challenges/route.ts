import { NextResponse } from 'next/server'
import { NotificationService } from '@/lib/supabase/services'

export async function GET() {
  const data = await NotificationService.getChallenges()
  return NextResponse.json({ items: data })
}
