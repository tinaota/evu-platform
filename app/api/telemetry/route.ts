import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { vehicle_id, session_id, battery_pct, lat, lng, speed_kmh, soc_kwh } = body

  if (!vehicle_id || battery_pct === undefined) {
    return NextResponse.json({ error: 'vehicle_id and battery_pct are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('telemetry')
    .insert({ vehicle_id, session_id, battery_pct, lat, lng, speed_kmh, soc_kwh })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update vehicle's current battery level
  await supabase
    .from('vehicles')
    .update({ current_battery_pct: battery_pct })
    .eq('id', vehicle_id)

  return NextResponse.json({ data }, { status: 201 })
}
