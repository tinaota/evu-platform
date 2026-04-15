import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [activeSessions, todaySessions, stations] = await Promise.all([
    supabase.from('charging_sessions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('charging_sessions').select('energy_kwh, cost_usd').gte('started_at', todayStart.toISOString()).eq('status', 'completed'),
    supabase.from('stations').select('status'),
  ])

  const energyToday = (todaySessions.data ?? []).reduce((sum, s) => sum + Number(s.energy_kwh), 0)
  const revenueToday = (todaySessions.data ?? []).reduce((sum, s) => sum + Number(s.cost_usd), 0)
  const stationList = stations.data ?? []
  const stationsOnline = stationList.filter(s => s.status !== 'Offline').length

  return NextResponse.json({
    activeSessions: activeSessions.count ?? 0,
    energyToday: Math.round(energyToday * 10) / 10,
    revenueToday: Math.round(revenueToday * 100) / 100,
    stationsOnline,
    stationsTotal: stationList.length,
  })
}
