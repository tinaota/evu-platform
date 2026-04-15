import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('stations')
    .update({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.address !== undefined && { address: body.address }),
      ...(body.lat !== undefined && { lat: body.lat }),
      ...(body.lng !== undefined && { lng: body.lng }),
      ...(body.total_chargers !== undefined && { total_chargers: body.total_chargers }),
      ...(body.power_kw !== undefined && { power_kw: body.power_kw }),
      ...(body.price_per_kwh !== undefined && { price_per_kwh: body.price_per_kwh }),
      ...(body.status !== undefined && { status: body.status }),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { error } = await supabase.from('stations').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
