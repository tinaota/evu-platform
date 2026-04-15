'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Charger } from '@/lib/types'

interface DBCharger {
  id: string
  station_id: string
  type: 'L2' | 'DCFC'
  status: 'Available' | 'Charging' | 'Warning' | 'Offline'
  last_maintenance_at: string | null
  created_at: string
  stations: { name: string } | null
}

function dbChargerToUI(c: DBCharger): Charger {
  return {
    id: `#${c.id.slice(0, 4).toUpperCase()}`,
    station: c.stations?.name ?? 'Unknown',
    type: c.type,
    status: c.status,
  }
}

export function useChargers(stationId?: string) {
  const [chargers, setChargers] = useState<Charger[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useRef(createClient()).current
  const channelName = useRef(`chargers-${Math.random().toString(36).slice(2)}`).current

  const fetchChargers = useCallback(async () => {
    let query = supabase
      .from('chargers')
      .select('*, stations(name)')
      .order('created_at')

    if (stationId) query = (query as any).eq('station_id', stationId)

    const { data, error } = await query
    if (error) { console.error('chargers fetch error', error); return }

    setChargers((data as DBCharger[] ?? []).map(dbChargerToUI))
    setLoading(false)
  }, [stationId, supabase])

  useEffect(() => {
    fetchChargers()

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chargers' }, () => fetchChargers())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchChargers, supabase, channelName])

  return { chargers, loading, refetch: fetchChargers }
}
