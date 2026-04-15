import { createClient } from '@/lib/supabase/server'
import type { SessionStatus } from '@/lib/supabase/types'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const supabase = await createClient()

  let query = supabase
    .from('charging_sessions')
    .select(
      `*, stations(name, address), vehicles(make, model), profiles(full_name)`,
      { count: 'exact' }
    )
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status as SessionStatus)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { vehicle_id, charger_id, station_id, battery_start_pct } = body

  if (!vehicle_id || !charger_id || !station_id) {
    return NextResponse.json({ error: 'vehicle_id, charger_id, and station_id are required' }, { status: 400 })
  }

  // Mark charger as in use
  await supabase
    .from('chargers')
    .update({ status: 'Charging' })
    .eq('id', charger_id)

  const { data, error } = await supabase
    .from('charging_sessions')
    .insert({
      vehicle_id,
      charger_id,
      station_id,
      user_id: user.id,
      battery_start_pct,
      status: 'active',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data }, { status: 201 })
}
