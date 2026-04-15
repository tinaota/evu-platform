'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface TelemetryReading {
  battery_pct: number
  lat: number | null
  lng: number | null
  speed_kmh: number
  soc_kwh: number | null
  recorded_at: string
}

export function useRealtimeTelemetry(vehicleId: string | null) {
  const [latest, setLatest] = useState<TelemetryReading | null>(null)
  const supabase = useRef(createClient()).current

  useEffect(() => {
    if (!vehicleId) return

    supabase
      .from('telemetry')
      .select('battery_pct, lat, lng, speed_kmh, soc_kwh, recorded_at')
      .eq('vehicle_id', vehicleId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setLatest(data) })

    const channelName = `telemetry-${vehicleId}-${Math.random().toString(36).slice(2)}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'telemetry', filter: `vehicle_id=eq.${vehicleId}` },
        (payload) => {
          const reading = payload.new as TelemetryReading
          setLatest(reading)
          if (reading.battery_pct < 20) {
            supabase.functions
              .invoke('low-battery-alert', { body: { vehicle_id: vehicleId, battery_pct: reading.battery_pct } })
              .catch(console.error)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [vehicleId, supabase])

  return latest
}
