'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ActiveSession } from '@/lib/types'

export function useRealtimeSessions() {
  const [sessions, setSessions] = useState<ActiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useRef(createClient()).current
  const channelName = useRef(`active-sessions-${Math.random().toString(36).slice(2)}`).current

  const fetchSessions = useCallback(async () => {
    const { data, error } = await supabase
      .from('charging_sessions')
      .select(
        `id, started_at, energy_kwh, cost_usd,
         stations(name),
         vehicles(make, model, battery_capacity_kwh),
         profiles(full_name, avatar_url)`
      )
      .eq('status', 'active')
      .order('started_at', { ascending: false })

    if (error) { console.error('sessions fetch error', error); return }

    const mapped: ActiveSession[] = (data ?? []).map((row: any) => {
      const elapsedMs = Date.now() - new Date(row.started_at).getTime()
      const elapsedMin = Math.round(elapsedMs / 60000)
      const battCap = row.vehicles?.battery_capacity_kwh ?? 75
      const progress = Math.min(100, Math.round((row.energy_kwh / battCap) * 100))

      return {
        id: row.id,
        stationName: row.stations?.name ?? 'Unknown',
        sessionId: row.id.slice(0, 8).toUpperCase(),
        avatar: (row.profiles?.full_name ?? 'U').charAt(0).toUpperCase(),
        energy: Number(row.energy_kwh),
        duration: elapsedMin,
        cost: Number(row.cost_usd),
        progress,
        status: 'Charging',
      }
    })

    setSessions(mapped)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchSessions()

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'charging_sessions' },
        () => fetchSessions()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchSessions, supabase, channelName])

  return { sessions, loading }
}
