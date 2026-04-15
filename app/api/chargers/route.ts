import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { NextResponse } from 'next/server'

type ChargerStatus = Database['public']['Enums']['charger_status']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stationId = searchParams.get('station_id')
  const status = searchParams.get('status')

  const supabase = await createClient()

  let query = supabase
    .from('chargers')
    .select('*, stations(name)')
    .order('created_at')

  if (stationId) query = query.eq('station_id', stationId)
  if (status) query = query.eq('status', status as ChargerStatus)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}
