'use client';

import { useState, useEffect } from 'react';
import { X, Building2, MapPin, Zap, DollarSign, Hash } from 'lucide-react';
import type { Station } from '@/lib/types';

interface StationModalProps {
    mode: 'add' | 'view' | 'edit';
    station?: Station | null;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormState {
    name: string;
    address: string;
    lat: string;
    lng: string;
    total_chargers: string;
    power_kw: string;
    price_per_kwh: string;
    status: string;
}

export default function StationModal({ mode, station, onClose, onSuccess }: StationModalProps) {
    const [form, setForm] = useState<FormState>({
        name: '',
        address: '',
        lat: '',
        lng: '',
        total_chargers: '4',
        power_kw: '150',
        price_per_kwh: '0.35',
        status: 'Available',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const isReadOnly = mode === 'view';
    const title = mode === 'add' ? 'Add Station' : mode === 'edit' ? 'Edit Station' : 'Station Details';

    useEffect(() => {
        if (station) {
            setForm({
                name: station.name,
                address: station.address,
                lat: String(station.position[0]),
                lng: String(station.position[1]),
                total_chargers: String(station.chargers),
                power_kw: station.power.replace(' kW', ''),
                price_per_kwh: station.price.replace('$', '').replace('/kWh', ''),
                status: station.status,
            });
        }
    }, [station]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            name: form.name,
            address: form.address,
            lat: parseFloat(form.lat),
            lng: parseFloat(form.lng),
            total_chargers: parseInt(form.total_chargers, 10),
            available_chargers: parseInt(form.total_chargers, 10),
            power_kw: parseFloat(form.power_kw),
            price_per_kwh: parseFloat(form.price_per_kwh),
            status: form.status,
        };

        try {
            let res: Response;
            if (mode === 'add') {
                res = await fetch('/api/stations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`/api/stations/${station!.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to save');
            onSuccess();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const field = (
        label: string,
        key: keyof FormState,
        icon: React.ReactNode,
        type = 'text',
        placeholder = ''
    ) => (
        <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</div>
                <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    readOnly={isReadOnly}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${isReadOnly ? 'bg-neutral-50 text-neutral-600' : 'bg-white'}`}
                />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-brand-600" />
                        </div>
                        <h2 className="text-lg font-bold">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {field('Station Name', 'name', <Building2 className="w-4 h-4" />, 'text', 'e.g. Congress Center')}
                    {field('Address', 'address', <MapPin className="w-4 h-4" />, 'text', 'e.g. 1800 E Jackson Ave, Milwaukee')}

                    <div className="grid grid-cols-2 gap-4">
                        {field('Latitude', 'lat', <MapPin className="w-4 h-4" />, 'number', '43.0412')}
                        {field('Longitude', 'lng', <MapPin className="w-4 h-4" />, 'number', '-87.9137')}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {field('Total Chargers', 'total_chargers', <Hash className="w-4 h-4" />, 'number', '4')}
                        {field('Max Power (kW)', 'power_kw', <Zap className="w-4 h-4" />, 'number', '150')}
                    </div>

                    {field('Price per kWh ($)', 'price_per_kwh', <DollarSign className="w-4 h-4" />, 'number', '0.35')}

                    {!isReadOnly && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="Available">Available</option>
                                <option value="In Use">In Use</option>
                                <option value="Warning">Warning</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                    )}

                    {isReadOnly && (
                        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                            <span className="text-sm text-neutral-500">Status:</span>
                            <span className={`text-sm font-semibold ${
                                form.status === 'Available' ? 'text-success-600' :
                                form.status === 'Offline' ? 'text-danger-600' :
                                form.status === 'Warning' ? 'text-warning-600' : 'text-brand-600'
                            }`}>{form.status}</span>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-danger-600 bg-danger-50 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        {isReadOnly ? (
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors">
                                Close
                            </button>
                        ) : (
                            <>
                                <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-neutral-200 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 disabled:opacity-60 transition-colors">
                                    {saving ? 'Saving…' : mode === 'add' ? 'Add Station' : 'Save Changes'}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
