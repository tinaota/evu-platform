'use client';

import { PlugZap, BatteryCharging, AlertTriangle, MoreVertical } from 'lucide-react';

export default function Chargers() {
    const getStatusColors = (status: string) => {
        const colorMap = {
            Available: {
                border: 'border-neutral-200',
                bg: 'bg-white',
                icon: 'bg-success-50 text-success-500',
                badge: 'bg-success-100 text-success-700'
            },
            Charging: {
                border: 'border-brand-200',
                bg: 'bg-brand-50/30',
                icon: 'bg-brand-100 text-brand-500',
                badge: 'bg-brand-100 text-brand-700'
            },
            Warning: {
                border: 'border-warning-200',
                bg: 'bg-warning-50/30',
                icon: 'bg-warning-100 text-warning-500',
                badge: 'bg-warning-100 text-warning-700'
            },
            Offline: {
                border: 'border-danger-200',
                bg: 'bg-danger-50/30',
                icon: 'bg-danger-100 text-danger-500',
                badge: 'bg-danger-100 text-danger-700'
            }
        };
        return colorMap[status as keyof typeof colorMap] || colorMap.Available;
    };

    const chargers = [
        { id: '#1201', station: 'Congress Center', type: 'DC Fast (150kW)', status: 'Available', lastSession: '2h ago' },
        { id: '#1202', station: 'Congress Center', status: 'Charging', energy: '45 kWh', duration: '45 min', progress: 75 },
        { id: '#1203', station: 'Downtown Plaza', status: 'Warning', issue: 'Low Power', capacity: '60%' },
        { id: '#1204', station: 'East Side Hub', status: 'Offline', issue: 'No Connection', since: '2 hours ago' },
    ];

    return (
        <div className="dashboard-view">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <p className="text-xs sm:text-sm text-neutral-500 mb-1">Total Chargers</p>
                    <p className="text-xl sm:text-2xl font-bold">64</p>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <p className="text-xs sm:text-sm text-neutral-500 mb-1">Available</p>
                    <p className="text-xl sm:text-2xl font-bold text-success-600">32</p>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <p className="text-xs sm:text-sm text-neutral-500 mb-1">In Use</p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-600">24</p>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <p className="text-xs sm:text-sm text-neutral-500 mb-1">Warning</p>
                    <p className="text-xl sm:text-2xl font-bold text-warning-600">5</p>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 col-span-2 sm:col-span-1">
                    <p className="text-xs sm:text-sm text-neutral-500 mb-1">Offline</p>
                    <p className="text-xl sm:text-2xl font-bold text-danger-600">3</p>
                </div>
            </div>

            {/* Chargers Grid */}
            <div className="bg-white rounded-xl border border-neutral-200">
                <div className="p-3 sm:p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h3 className="font-semibold">All Chargers</h3>
                        <select className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 w-full sm:w-auto">
                            <option>All Stations</option>
                            <option>Congress Center</option>
                            <option>Public Market</option>
                            <option>Downtown Plaza</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-neutral-100 rounded-lg border border-neutral-200 tap-target">
                            <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button className="p-2 hover:bg-neutral-100 rounded-lg border border-neutral-200 tap-target">
                            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {chargers.map((charger, idx) => {
                        const colors = getStatusColors(charger.status);

                        return (
                            <div key={idx} className={`border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer ${colors.border} ${colors.bg}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                                        {charger.status}
                                    </span>
                                    <MoreVertical className="w-4 h-4 text-neutral-400" />
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.icon}`}>
                                        {charger.status === 'Charging' ? (
                                            <BatteryCharging className="w-6 h-6" />
                                        ) : charger.status === 'Warning' ? (
                                            <AlertTriangle className="w-6 h-6" />
                                        ) : (
                                            <PlugZap className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">Charger {charger.id}</p>
                                        <p className="text-xs text-neutral-500">{charger.station}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    {charger.type && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Type</span>
                                            <span className="font-medium">{charger.type}</span>
                                        </div>
                                    )}
                                    {charger.energy && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Energy</span>
                                                <span className="font-medium">{charger.energy}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Duration</span>
                                                <span>{charger.duration}</span>
                                            </div>
                                            <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${charger.progress}%` }}></div>
                                            </div>
                                        </>
                                    )}
                                    {charger.issue && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-500">Issue</span>
                                                <span className={`font-medium ${charger.status === 'Warning' ? 'text-warning-600' : 'text-danger-600'}`}>{charger.issue}</span>
                                            </div>
                                            {charger.capacity && (
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-500">Capacity</span>
                                                    <span>{charger.capacity}</span>
                                                </div>
                                            )}
                                            {charger.since && (
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-500">Since</span>
                                                    <span>{charger.since}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {charger.lastSession && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Last Session</span>
                                            <span>{charger.lastSession}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
