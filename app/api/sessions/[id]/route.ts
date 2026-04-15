import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { NextResponse } from 'next/server'

type SessionUpdate = Database['public']['Tables']['charging_sessions']['Update']

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { energy_kwh, cost_usd, battery_end_pct, status } = body

  const updates: SessionUpdate = {}
  if (energy_kwh !== undefined) updates.energy_kwh = energy_kwh
  if (cost_usd !== undefined) updates.cost_usd = cost_usd
  if (battery_end_pct !== undefined) updates.battery_end_pct = battery_end_pct
  if (status !== undefined) {
    updates.status = status as SessionUpdate['status']
    if (status === 'completed' || status === 'failed') {
      updates.ended_at = new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('charging_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Free up the charger when session ends
  if (status === 'completed' || status === 'failed') {
    await supabase
      .from('chargers')
      .update({ status: 'Available' })
      .eq('id', data.charger_id)
  }

  return NextResponse.json({ data })
}
