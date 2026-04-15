import { createClient } from '@/lib/supabase/server'
import type { StationStatus } from '@/lib/supabase/types'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') ?? '50', 10)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const supabase = await createClient()

  let query = supabase
    .from('stations')
    .select('*', { count: 'exact' })
    .order('name')
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status as StationStatus)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('stations')
    .insert({
      name: body.name,
      address: body.address,
      lat: body.lat,
      lng: body.lng,
      total_chargers: body.total_chargers,
      available_chargers: body.available_chargers ?? body.total_chargers,
      power_kw: body.power_kw,
      price_per_kwh: body.price_per_kwh,
      status: body.status ?? 'Available',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
