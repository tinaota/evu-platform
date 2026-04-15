'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { dbStationToUI, type Station } from '@/lib/types'

/**
 * Fetches stations and subscribes to real-time updates.
 *
 * Usage:
 *   const { stations, loading } = useStations()
 */
export function useStations() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchStations = useCallback(async () => {
    const { data, error } = await supabase
      .from('stations')
      .select('id, name, address, lat, lng, total_chargers, available_chargers, status, power_kw, price_per_kwh')
      .order('name')

    if (error) { console.error('stations fetch error', error); return }

    setStations((data ?? []).map(dbStationToUI))
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStations()

    const channel = supabase
      .channel('stations-watch')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stations' },
        () => fetchStations()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchStations])

  return { stations, loading }
}
