'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, RefreshCw, Plus, Square, Car } from 'lucide-react'
import { useRealtimeSessions } from '@/lib/hooks/useRealtimeSessions'
import StartSessionModal from '@/app/components/modals/StartSessionModal'
import VehicleModal from '@/app/components/modals/VehicleModal'

interface HistoricalSession {
  id: string
  station: string
  startTime: string
  duration: string
  energy: string
  revenue: string
  status: 'Completed' | 'Failed'
}

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  battery_capacity_kwh: number
  current_battery_pct: number
}

const PERIOD_DAYS: Record<string, number> = {
  Today: 0,
  Yesterday: 1,
  'Last 7 Days': 7,
  'Last 30 Days': 30,
}

export default function Sessions() {
  const [filterPeriod, setFilterPeriod] = useState('Today')
  const [history, setHistory] = useState<HistoricalSession[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showStartModal, setShowStartModal] = useState(false)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [stoppingId, setStoppingId] = useState<string | null>(null)

  const { sessions: activeSessions, loading: activeLoading } = useRealtimeSessions()

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    const days = PERIOD_DAYS[filterPeriod] ?? 0
    const since = new Date()
    if (days === 0) since.setHours(0, 0, 0, 0)
    else since.setDate(since.getDate() - days)

    const res = await fetch(`/api/sessions?status=completed&limit=50&offset=0`)
    const json = await res.json()

    const rows: HistoricalSession[] = (json.data ?? []).map((s: any) => {
      const start = new Date(s.started_at)
      const end = s.ended_at ? new Date(s.ended_at) : new Date()
      const durationMin = Math.round((end.getTime() - start.getTime()) / 60000)
      return {
        id: s.id.slice(0, 8).toUpperCase(),
        station: s.stations?.name ?? 'Unknown',
        startTime: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${durationMin} min`,
        energy: `${Number(s.energy_kwh).toFixed(1)} kWh`,
        revenue: `$${Number(s.cost_usd).toFixed(2)}`,
        status: s.status === 'failed' ? 'Failed' : 'Completed',
      }
    })
    setHistory(rows)
    setHistoryLoading(false)
  }, [filterPeriod])

  const fetchVehicles = useCallback(async () => {
    const res = await fetch('/api/vehicles')
    const json = await res.json()
    setVehicles(json.data ?? [])
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])
  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  const handleStopSession = async (sessionId: string) => {
    if (!confirm('Stop this charging session?')) return
    setStoppingId(sessionId)

    const session = activeSessions.find(s => s.id === sessionId)
    const energyKwh = session?.energy ?? 0
    const costUsd = session?.cost ?? 0

    await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed', energy_kwh: energyKwh, cost_usd: costUsd }),
    })
    setStoppingId(null)
  }

  const exportCSV = () => {
    const header = 'Session ID,Station,Start Time,Duration,Energy,Revenue,Status'
    const rows = history.map(s => `${s.id},${s.station},${s.startTime},${s.duration},${s.energy},${s.revenue},${s.status}`)
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `sessions-${filterPeriod.replace(/ /g, '-').toLowerCase()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const sessionsByHour = [6, 9, 12, 15, 18].map(h => ({
    hour: h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`,
    count: history.filter(s => {
      const t = parseInt(s.startTime)
      return t >= h && t < h + 3
    }).length,
  }))
  const maxSessions = Math.max(...sessionsByHour.map(s => s.count), 1)

  return (
    <div className="dashboard-content">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sessions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Active Sessions</h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {activeLoading ? 'Loading...' : `${activeSessions.length} session${activeSessions.length !== 1 ? 's' : ''} in progress`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStartModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Start Charging
                </button>
              </div>
            </div>

            {activeLoading && (
              <div className="py-8 text-center text-neutral-400 text-sm">Loading sessions...</div>
            )}

            {!activeLoading && activeSessions.length === 0 && (
              <div className="py-8 text-center text-neutral-400 text-sm">No active sessions right now</div>
            )}

            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="border border-neutral-200 rounded-lg p-4 hover:border-brand-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-700 font-semibold text-sm">{session.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-neutral-900">{session.stationName}</h3>
                          <p className="text-xs text-neutral-500 mt-0.5">{session.sessionId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-full">
                            {session.status}
                          </span>
                          <button
                            onClick={() => handleStopSession(session.id)}
                            disabled={stoppingId === session.id}
                            className="flex items-center gap-1 px-2.5 py-1 bg-danger-100 hover:bg-danger-200 text-danger-700 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                          >
                            <Square className="w-3 h-3" />
                            Stop
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-neutral-500">Energy</p>
                          <p className="text-sm font-semibold text-neutral-900 mt-0.5">{session.energy} kWh</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Duration</p>
                          <p className="text-sm font-semibold text-neutral-900 mt-0.5">{session.duration} min</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Cost</p>
                          <p className="text-sm font-semibold text-brand-600 mt-0.5">${session.cost.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Progress</p>
                          <p className="text-sm font-semibold text-neutral-900 mt-0.5">{session.progress}%</p>
                        </div>
                      </div>
                      <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-brand-600 rounded-full transition-all duration-300"
                          style={{ width: `${session.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session History */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-neutral-900">Session History</h2>
              <div className="flex items-center gap-3">
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    {['Session ID', 'Station', 'Start Time', 'Duration', 'Energy', 'Revenue', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyLoading && (
                    <tr><td colSpan={7} className="py-8 text-center text-neutral-400 text-sm">Loading history...</td></tr>
                  )}
                  {!historyLoading && history.length === 0 && (
                    <tr><td colSpan={7} className="py-8 text-center text-neutral-400 text-sm">No completed sessions found</td></tr>
                  )}
                  {history.map((session) => (
                    <tr key={session.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-neutral-900">{session.id}</td>
                      <td className="py-3 px-4 text-sm text-neutral-900">{session.station}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{session.startTime}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{session.duration}</td>
                      <td className="py-3 px-4 text-sm text-brand-600 font-medium">{session.energy}</td>
                      <td className="py-3 px-4 text-sm text-success-600 font-medium">{session.revenue}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full
                          ${session.status === 'Completed' ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Today's Summary */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Today's Summary</h2>
            <div className="space-y-5 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Active Now</span>
                <span className="text-2xl font-bold text-brand-600">{activeSessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Completed Today</span>
                <span className="text-2xl font-bold text-neutral-900">{history.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Energy Today</span>
                <span className="text-2xl font-bold text-neutral-900">
                  {history.reduce((s, h) => s + parseFloat(h.energy), 0).toFixed(1)} kWh
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Revenue Today</span>
                <span className="text-2xl font-bold text-success-600">
                  ${history.reduce((s, h) => s + parseFloat(h.revenue.replace('$', '')), 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Sessions by Hour</h3>
              <div className="space-y-3">
                {sessionsByHour.map((item) => (
                  <div key={item.hour} className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 w-10 text-right">{item.hour}</span>
                    <div className="flex-1 h-8 bg-neutral-100 rounded overflow-hidden">
                      <div className="h-full bg-brand-500 rounded transition-all duration-300"
                        style={{ width: `${(item.count / maxSessions) * 100}%` }} />
                    </div>
                    <span className="text-xs text-neutral-600 w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Vehicles */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">My Vehicles</h2>
              <button
                onClick={() => setShowVehicleModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="py-6 text-center">
                <Car className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No vehicles yet</p>
                <button onClick={() => setShowVehicleModal(true)} className="text-sm text-brand-600 hover:text-brand-700 mt-1">
                  Add your first vehicle
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.map(v => (
                  <div key={v.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{v.year} {v.make} {v.model}</p>
                      <p className="text-xs text-neutral-500">{v.battery_capacity_kwh} kWh</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-neutral-900">{v.current_battery_pct}%</p>
                      <div className="w-12 h-1.5 bg-neutral-200 rounded-full mt-1">
                        <div className="h-full bg-success-500 rounded-full"
                          style={{ width: `${v.current_battery_pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showStartModal && (
        <StartSessionModal
          station={null}
          onClose={() => setShowStartModal(false)}
          onSuccess={() => { setShowStartModal(false); fetchHistory() }}
        />
      )}

      {showVehicleModal && (
        <VehicleModal
          onClose={() => setShowVehicleModal(false)}
          onSuccess={() => { setShowVehicleModal(false); fetchVehicles() }}
        />
      )}
    </div>
  )
}
