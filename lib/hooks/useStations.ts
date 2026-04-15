'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { dbStationToUI, type Station } from '@/lib/types'

export function useStations() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useRef(createClient()).current
  const channelName = useRef(`stations-${Math.random().toString(36).slice(2)}`).current

  const fetchStations = useCallback(async () => {
    const { data, error } = await supabase
      .from('stations')
      .select('id, name, address, lat, lng, total_chargers, available_chargers, status, power_kw, price_per_kwh')
      .order('name')

    if (error) { console.error('stations fetch error', error); return }

    setStations((data ?? []).map(dbStationToUI))
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchStations()

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stations' },
        () => fetchStations()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchStations, supabase, channelName])

  return { stations, loading }
}
