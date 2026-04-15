'use client'

import { useState, useEffect } from 'react'
import { X, Car, Zap, CheckCircle, Loader2 } from 'lucide-react'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  battery_capacity_kwh: number
  current_battery_pct: number
}

interface Charger {
  id: string
  type: 'L2' | 'DCFC'
  status: string
  stations: { name: string } | null
}

interface Station {
  id: string
  name: string
  price_per_kwh: number
}

interface Props {
  station?: Station | null
  onClose: () => void
  onSuccess: () => void
}

type Step = 'vehicle' | 'charger' | 'confirm'

export default function StartSessionModal({ station, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('vehicle')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [chargers, setChargers] = useState<Charger[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/vehicles')
      .then(r => r.json())
      .then(({ data }) => setVehicles(data ?? []))
  }, [])

  useEffect(() => {
    if (step === 'charger') {
      const url = station
        ? `/api/chargers?station_id=${station.id}&status=Available`
        : '/api/chargers?status=Available'
      fetch(url)
        .then(r => r.json())
        .then(({ data }) => setChargers(data ?? []))
    }
  }, [step, station])

  const handleStart = async () => {
    if (!selectedVehicle || !selectedCharger) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicle_id: selectedVehicle.id,
        charger_id: selectedCharger.id,
        station_id: (selectedCharger as any).station_id,
        battery_start_pct: selectedVehicle.current_battery_pct,
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Failed to start session')
      setLoading(false)
      return
    }

    onSuccess()
  }

  const steps: Step[] = ['vehicle', 'charger', 'confirm']
  const stepIndex = steps.indexOf(step)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Start Charging</h2>
            {station && <p className="text-sm text-neutral-500 mt-0.5">{station.name}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 pt-4">
          {['Vehicle', 'Charger', 'Confirm'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
                ${i < stepIndex ? 'bg-success-500 text-white' : i === stepIndex ? 'bg-brand-600 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${i === stepIndex ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>{label}</span>
              {i < 2 && <div className="flex-1 h-px bg-neutral-200" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'vehicle' && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-600 mb-4">Select the vehicle you want to charge</p>
              {vehicles.length === 0 && (
                <p className="text-sm text-neutral-500 text-center py-4">No vehicles found. Add a vehicle first.</p>
              )}
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVehicle(v); setStep('charger') }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors
                    ${selectedVehicle?.id === v.id ? 'border-brand-500 bg-brand-50' : 'border-neutral-200 hover:border-brand-300'}`}
                >
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900">{v.year} {v.make} {v.model}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{v.battery_capacity_kwh} kWh battery</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900">{v.current_battery_pct}%</p>
                    <p className="text-xs text-neutral-500">charged</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'charger' && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-600 mb-4">Select an available charger</p>
              {chargers.length === 0 && (
                <p className="text-sm text-neutral-500 text-center py-4">No available chargers at this station.</p>
              )}
              {chargers.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCharger(c); setStep('confirm') }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors
                    ${selectedCharger?.id === c.id ? 'border-brand-500 bg-brand-50' : 'border-neutral-200 hover:border-brand-300'}`}
                >
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{c.type === 'DCFC' ? 'DC Fast Charger' : 'Level 2'}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{c.stations?.name ?? 'Unknown station'}</p>
                  </div>
                  <span className="px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded-full">
                    {c.status}
                  </span>
                </button>
              ))}
              <button onClick={() => setStep('vehicle')} className="text-sm text-brand-600 hover:text-brand-700 mt-2">
                ← Back
              </button>
            </div>
          )}

          {step === 'confirm' && selectedVehicle && selectedCharger && (
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Vehicle</span>
                  <span className="font-medium">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Charger</span>
                  <span className="font-medium">{selectedCharger.type === 'DCFC' ? 'DC Fast Charger' : 'Level 2'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Station</span>
                  <span className="font-medium">{selectedCharger.stations?.name ?? station?.name ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Battery start</span>
                  <span className="font-medium">{selectedVehicle.current_battery_pct}%</span>
                </div>
                {station && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Rate</span>
                    <span className="font-medium">${Number(station.price_per_kwh).toFixed(2)}/kWh</span>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                onClick={handleStart}
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {loading ? 'Starting...' : 'Start Charging'}
              </button>
              <button onClick={() => setStep('charger')} className="text-sm text-brand-600 hover:text-brand-700">
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
