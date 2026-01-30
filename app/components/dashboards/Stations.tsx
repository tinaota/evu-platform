'use client';

import { Building2, CheckCircle, XCircle, PlugZap, Search, Plus, Eye, Edit, MoreVertical, Wrench } from 'lucide-react';

export default function Stations() {
    const stations = [
        { id: 'STN-001', name: 'Congress Center', address: '1800 E Jackson Ave, Milwaukee', chargers: 4, available: 2, status: 'Online', sessions: 48, revenue: '$892', offline: false },
        { id: 'STN-002', name: 'Public Market', address: '400 N Water St, Milwaukee', chargers: 2, available: 0, status: 'Online', sessions: 36, revenue: '$654', offline: false },
        { id: 'STN-003', name: 'East Side Hub', address: '567 East Blvd, Milwaukee', chargers: 2, available: 0, status: 'Offline', sessions: 0, revenue: '$0', offline: true },
    ];

    return (
        <div className="dashboard-view">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl sm:text-2xl font-bold">40</p>
                            <p className="text-xs sm:text-sm text-neutral-500">Total Stations</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-success-50 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl sm:text-2xl font-bold">37</p>
                            <p className="text-xs sm:text-sm text-neutral-500">Online</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-danger-50 flex items-center justify-center shrink-0">
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-danger-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl sm:text-2xl font-bold">3</p>
                            <p className="text-xs sm:text-sm text-neutral-500">Offline</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                            <PlugZap className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl sm:text-2xl font-bold">64</p>
                            <p className="text-xs sm:text-sm text-neutral-500">Chargers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stations Table */}
            <div className="bg-white rounded-xl border border-neutral-200">
                <div className="p-3 sm:p-4 border-b border-neutral-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <h3 className="font-semibold">All Stations</h3>
                            <div className="filter-scroll flex items-center gap-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                                <button className="px-3 py-1.5 text-sm bg-brand-50 text-brand-600 rounded-lg font-medium whitespace-nowrap">All</button>
                                <button className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg whitespace-nowrap">Online</button>
                                <button className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg whitespace-nowrap">Offline</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 w-full sm:w-48 lg:w-64 bg-neutral-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium shrink-0 tap-target">
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add Station</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto table-responsive">
                    <table className="w-full">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Station</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Address</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Chargers</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Status</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Sessions Today</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Revenue Today</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {stations.map((station) => (
                                <tr key={station.id} className={`hover:bg-neutral-50 ${station.offline ? 'bg-danger-50/50' : ''}`}>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg ${station.offline ? 'bg-danger-100' : 'bg-brand-100'} flex items-center justify-center`}>
                                                <Building2 className={`w-5 h-5 ${station.offline ? 'text-danger-600' : 'text-brand-600'}`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{station.name}</p>
                                                <p className="text-xs text-neutral-500">ID: {station.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-neutral-600">{station.address}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{station.chargers}</span>
                                            <span className={`text-xs ${station.offline ? 'text-danger-500' : 'text-neutral-500'}`}>
                                                ({station.offline ? 'offline' : `${station.available} available`})
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${station.offline
                                                ? 'bg-danger-100 text-danger-700'
                                                : 'bg-success-100 text-success-700'
                                            }`}>
                                            {station.status}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-4 text-sm font-medium ${station.offline ? 'text-neutral-400' : ''}`}>
                                        {station.sessions}
                                    </td>
                                    <td className={`px-4 py-4 text-sm font-medium ${station.offline ? 'text-neutral-400' : 'text-success-600'}`}>
                                        {station.revenue}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1">
                                            <button className="p-2 hover:bg-neutral-100 rounded-lg">
                                                <Eye className="w-4 h-4 text-neutral-500" />
                                            </button>
                                            <button className="p-2 hover:bg-neutral-100 rounded-lg">
                                                {station.offline ? (
                                                    <Wrench className="w-4 h-4 text-danger-500" />
                                                ) : (
                                                    <Edit className="w-4 h-4 text-neutral-500" />
                                                )}
                                            </button>
                                            <button className="p-2 hover:bg-neutral-100 rounded-lg">
                                                <MoreVertical className="w-4 h-4 text-neutral-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 sm:p-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-neutral-500">Showing 1-10 of 40 stations</p>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button className="px-2 sm:px-3 py-1.5 border border-neutral-200 rounded-lg text-xs sm:text-sm hover:bg-neutral-50">Prev</button>
                        <button className="px-2.5 sm:px-3 py-1.5 bg-brand-500 text-white rounded-lg text-xs sm:text-sm">1</button>
                        <button className="px-2.5 sm:px-3 py-1.5 border border-neutral-200 rounded-lg text-xs sm:text-sm hover:bg-neutral-50">2</button>
                        <button className="px-2.5 sm:px-3 py-1.5 border border-neutral-200 rounded-lg text-xs sm:text-sm hover:bg-neutral-50 hidden sm:block">3</button>
                        <button className="px-2 sm:px-3 py-1.5 border border-neutral-200 rounded-lg text-xs sm:text-sm hover:bg-neutral-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
