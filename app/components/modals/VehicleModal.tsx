'use client'

import { useState } from 'react'
import { X, Car, Loader2 } from 'lucide-react'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

const EV_MAKES = ['Tesla', 'Ford', 'Chevrolet', 'Rivian', 'Hyundai', 'BMW', 'Volkswagen', 'Kia', 'Lucid', 'Mercedes', 'Audi', 'Porsche', 'Nissan', 'Other']

export default function VehicleModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    battery_capacity_kwh: '',
    license_plate: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        make: form.make,
        model: form.model,
        year: parseInt(form.year),
        battery_capacity_kwh: parseFloat(form.battery_capacity_kwh),
        license_plate: form.license_plate || undefined,
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Failed to add vehicle')
      setLoading(false)
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-brand-600" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">Add Vehicle</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Make *</label>
              <select
                value={form.make}
                onChange={e => set('make', e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select make</option>
                {EV_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Model *</label>
              <input
                type="text"
                placeholder="e.g. Model 3"
                value={form.model}
                onChange={e => set('model', e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Year *</label>
              <input
                type="number"
                min="2010"
                max={new Date().getFullYear() + 1}
                value={form.year}
                onChange={e => set('year', e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Battery (kWh) *</label>
              <input
                type="number"
                min="10"
                max="300"
                step="0.1"
                placeholder="e.g. 82"
                value={form.battery_capacity_kwh}
                onChange={e => set('battery_capacity_kwh', e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">License Plate</label>
            <input
              type="text"
              placeholder="Optional"
              value={form.license_plate}
              onChange={e => set('license_plate', e.target.value)}
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {error && (
            <p className="text-sm text-danger-600 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
