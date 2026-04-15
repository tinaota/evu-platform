import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { make, model, year, battery_capacity_kwh, license_plate, vin } = body

  if (!make || !model || !year || !battery_capacity_kwh) {
    return NextResponse.json(
      { error: 'make, model, year, and battery_capacity_kwh are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('vehicles')
    .insert({ user_id: user.id, make, model, year, battery_capacity_kwh, license_plate, vin })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data }, { status: 201 })
}
