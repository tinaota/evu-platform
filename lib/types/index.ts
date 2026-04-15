/**
 * Shared domain types used across dashboard components.
 * Replaces the three duplicated Station interfaces in Overview, LiveMap, MapComponent.
 */

export type StationStatus = 'Available' | 'In Use' | 'Warning' | 'Offline'
export type StationColor = 'success' | 'brand' | 'warning' | 'danger'

export interface Station {
  id: string
  name: string
  status: StationStatus
  address: string
  position: [number, number] // [latitude, longitude]
  chargers: number
  available_chargers: number
  power: string   // e.g. "150 kW"
  price: string   // e.g. "$0.35/kWh"
  color: StationColor
  lastUpdate?: string
}

export interface ActiveSession {
  id: string
  stationName: string
  sessionId: string
  avatar: string
  energy: number    // kWh delivered so far
  duration: number  // minutes elapsed
  cost: number      // $ so far
  progress: number  // 0–100
  status: 'Charging'
}

export interface HistoricalSession {
  id: string
  station: string
  startTime: string
  duration: string
  energy: string    // e.g. "62.4 kWh"
  revenue: string   // e.g. "$18.72"
  status: 'Completed'
}

export interface Charger {
  id: string
  station: string
  type: 'L2' | 'DCFC'
  status: 'Available' | 'Charging' | 'Warning' | 'Offline'
  lastSession?: string
  energy?: number
  duration?: number
  progress?: number
  issue?: string
  capacity?: string
  since?: string
}

export type UserRole = 'operator' | 'owner' | 'technician' | 'admin'

export interface UserProfile {
  id: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
}

/** Maps station DB status → UI color token */
export const STATUS_COLOR: Record<StationStatus, StationColor> = {
  Available: 'success',
  'In Use': 'brand',
  Warning: 'warning',
  Offline: 'danger',
}

/** Converts a DB station row to the UI Station shape */
export function dbStationToUI(s: {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  available_chargers: number
  total_chargers: number
  status: StationStatus
  power_kw: number
  price_per_kwh: number
}): Station {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    position: [s.lat, s.lng],
    chargers: s.total_chargers,
    available_chargers: s.available_chargers,
    status: s.status,
    power: `${s.power_kw} kW`,
    price: `$${Number(s.price_per_kwh).toFixed(2)}/kWh`,
    color: STATUS_COLOR[s.status],
  }
}
