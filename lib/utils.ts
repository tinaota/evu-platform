/**
 * Derives a short, human-readable station code from the station name and its
 * position in the sorted list.
 *
 * Examples:
 *   stationCode("Congress Center", 0)  → "CC-001"
 *   stationCode("Public Market", 1)    → "PM-002"
 *   stationCode("East Side Hub", 2)    → "ESH-003"
 */
export function stationCode(name: string, index: number): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .join('')
  const num = String(index + 1).padStart(3, '0')
  return `${initials}-${num}`
}

/**
 * Returns the current week as a formatted date-range label.
 * e.g. "Apr 14 – Apr 20, 2026"
 */
export function currentWeekLabel(): string {
  const now = new Date()
  const day = now.getDay() // 0 = Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return `${fmt(monday)} – ${fmt(sunday)}, ${sunday.getFullYear()}`
}
