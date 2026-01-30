'use client';

import { useState, useEffect } from 'react';
import { Search, Layers, Maximize2, Plus, Minus, Locate, X, Zap, Clock, DollarSign, Navigation } from 'lucide-react';

interface Station {
    id: number;
    name: string;
    status: 'Available' | 'In Use' | 'Warning' | 'Offline';
    count: number;
    address: string;
    distance: string;
    color: 'success' | 'brand' | 'warning' | 'danger';
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    chargers: number;
    power: string;
    price: string;
    lastUpdate: string;
}

export default function LiveMap() {
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdateTime(new Date());
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const getColorClasses = (color: string) => {
        const colorMap = {
            success: {
                bg: 'bg-success-500',
                bgLight: 'bg-success-100',
                text: 'text-success-700',
                textLight: 'text-success-400',
                border: 'border-success-500'
            },
            brand: {
                bg: 'bg-brand-500',
                bgLight: 'bg-brand-100',
                text: 'text-brand-700',
                textLight: 'text-brand-400',
                border: 'border-brand-500'
            },
            warning: {
                bg: 'bg-warning-500',
                bgLight: 'bg-warning-100',
                text: 'text-warning-700',
                textLight: 'text-warning-400',
                border: 'border-warning-500'
            },
            danger: {
                bg: 'bg-danger-500',
                bgLight: 'bg-danger-100',
                text: 'text-danger-700',
                textLight: 'text-danger-400',
                border: 'border-danger-500'
            }
        };
        return colorMap[color as keyof typeof colorMap] || colorMap.success;
    };

    const allStations: Station[] = [
        { id: 1, name: 'Congress Center', status: 'Available', count: 4, address: '1800 E Jackson Ave, Milwaukee', distance: '0.3 mi', color: 'success', top: '15%', left: '20%', chargers: 8, power: '150 kW', price: '$0.35/kWh', lastUpdate: '2 min ago' },
        { id: 2, name: 'Public Market', status: 'In Use', count: 2, address: '400 N Water St, Milwaukee', distance: '0.5 mi', color: 'brand', top: '30%', left: '45%', chargers: 6, power: '150 kW', price: '$0.32/kWh', lastUpdate: '1 min ago' },
        { id: 3, name: 'Downtown Plaza', status: 'Warning', count: 1, address: '123 Main St, Milwaukee', distance: '0.7 mi', color: 'warning', top: '25%', right: '25%', chargers: 4, power: '100 kW', price: '$0.30/kWh', lastUpdate: '3 min ago' },
        { id: 4, name: 'East Side Hub', status: 'Offline', count: 0, address: '567 East Blvd, Milwaukee', distance: '1.2 mi', color: 'danger', bottom: '30%', left: '30%', chargers: 6, power: '150 kW', price: '$0.33/kWh', lastUpdate: '15 min ago' },
        { id: 5, name: 'Lakefront Station', status: 'Available', count: 5, address: '890 Lakefront Dr, Milwaukee', distance: '1.5 mi', color: 'success', bottom: '20%', right: '20%', chargers: 10, power: '350 kW', price: '$0.38/kWh', lastUpdate: 'Just now' },
        { id: 6, name: 'Tech Park', status: 'Available', count: 3, address: '456 Innovation Way, Milwaukee', distance: '2.1 mi', color: 'success', top: '50%', left: '60%', chargers: 6, power: '150 kW', price: '$0.34/kWh', lastUpdate: '1 min ago' },
        { id: 7, name: 'Airport Hub', status: 'In Use', count: 1, address: '5300 S Howell Ave, Milwaukee', distance: '3.2 mi', color: 'brand', bottom: '40%', left: '50%', chargers: 12, power: '350 kW', price: '$0.40/kWh', lastUpdate: 'Just now' },
        { id: 8, name: 'University Station', status: 'Available', count: 6, address: '2200 E Kenwood Blvd, Milwaukee', distance: '1.8 mi', color: 'success', top: '40%', right: '35%', chargers: 8, power: '150 kW', price: '$0.31/kWh', lastUpdate: '2 min ago' },
    ];

    // Filter stations based on active filter and search query
    const filteredStations = allStations.filter(station => {
        const matchesFilter = activeFilter === 'All' || station.status === activeFilter;
        const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const statusCounts = {
        Available: allStations.filter(s => s.status === 'Available').length,
        'In Use': allStations.filter(s => s.status === 'In Use').length,
        Warning: allStations.filter(s => s.status === 'Warning').length,
        Offline: allStations.filter(s => s.status === 'Offline').length,
    };

    const handleStationClick = (station: Station) => {
        setSelectedStation(station);
    };

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
        setSelectedStation(null);
    };

    const getTimeAgo = () => {
        const seconds = Math.floor((new Date().getTime() - lastUpdateTime.getTime()) / 1000);
        if (seconds < 10) return 'Just now';
        if (seconds < 60) return `${seconds}s ago`;
        return `${Math.floor(seconds / 60)}m ago`;
    };

    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 h-auto lg:h-[calc(100vh-180px)]">
                {/* Map Area */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
                    <div className="p-3 sm:p-4 border-b border-neutral-100 shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Search locations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full sm:w-48 lg:w-64 bg-neutral-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                                <div className="filter-scroll flex items-center gap-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                                    <button
                                        onClick={() => handleFilterClick('All')}
                                        className={`px-3 py-1.5 text-sm rounded-lg font-medium whitespace-nowrap transition-colors ${activeFilter === 'All'
                                            ? 'bg-brand-50 text-brand-600'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => handleFilterClick('Available')}
                                        className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors ${activeFilter === 'Available'
                                            ? 'bg-success-50 text-success-700'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-success-500"></span> Available
                                    </button>
                                    <button
                                        onClick={() => handleFilterClick('In Use')}
                                        className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors ${activeFilter === 'In Use'
                                            ? 'bg-brand-50 text-brand-700'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-brand-500"></span> In Use
                                    </button>
                                    <button
                                        onClick={() => handleFilterClick('Offline')}
                                        className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors ${activeFilter === 'Offline'
                                            ? 'bg-danger-50 text-danger-700'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-danger-500"></span> Offline
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <button className="p-2 hover:bg-neutral-100 rounded-lg tap-target">
                                    <Layers className="w-5 h-5 text-neutral-500" />
                                </button>
                                <button className="p-2 hover:bg-neutral-100 rounded-lg tap-target">
                                    <Maximize2 className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-brand-50 to-neutral-100 relative min-h-[400px]">
                        {/* Grid lines for map effect */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#0A7FD4 1px, transparent 1px), linear-gradient(90deg, #0A7FD4 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

                        {/* Station markers */}
                        {filteredStations.map((station) => {
                            const colors = getColorClasses(station.color);
                            const isSelected = selectedStation?.id === station.id;
                            return (
                                <div
                                    key={station.id}
                                    className="absolute cursor-pointer group"
                                    style={{
                                        top: station.top,
                                        left: station.left,
                                        right: station.right,
                                        bottom: station.bottom
                                    }}
                                    onClick={() => handleStationClick(station)}
                                >
                                    <div className={`w-10 h-10 rounded-full ${colors.bg} border-4 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold transition-all ${isSelected ? 'scale-125 ring-4 ring-brand-300' : 'hover:scale-110'} ${station.color === 'danger' ? 'status-pulse' : ''}`}>
                                        {station.count}
                                    </div>
                                    {!isSelected && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                            {station.name}<br />
                                            <span className={colors.textLight}>{station.count} {station.status}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Selected Station Popup */}
                        {selectedStation && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl border border-neutral-200 p-5 w-80 max-w-[90vw] z-20 animate-in fade-in zoom-in duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{selectedStation.name}</h3>
                                        <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                                            <Navigation className="w-3 h-3" />
                                            {selectedStation.distance} away
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedStation(null)}
                                        className="p-1 hover:bg-neutral-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5 text-neutral-500" />
                                    </button>
                                </div>

                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getColorClasses(selectedStation.color).bgLight} ${getColorClasses(selectedStation.color).text} text-sm font-medium mb-4`}>
                                    <span className={`w-2 h-2 rounded-full ${getColorClasses(selectedStation.color).bg}`}></span>
                                    {selectedStation.count} of {selectedStation.chargers} {selectedStation.status}
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 flex items-center gap-2">
                                            <Zap className="w-4 h-4" />
                                            Max Power
                                        </span>
                                        <span className="font-semibold">{selectedStation.power}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            Pricing
                                        </span>
                                        <span className="font-semibold">{selectedStation.price}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Last Update
                                        </span>
                                        <span className="font-semibold">{selectedStation.lastUpdate}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-neutral-500 mb-4">{selectedStation.address}</p>

                                <div className="flex gap-2">
                                    <button className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                                        Get Directions
                                    </button>
                                    <button className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Map controls */}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors">
                                <Plus className="w-5 h-5 text-neutral-600" />
                            </button>
                            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors">
                                <Minus className="w-5 h-5 text-neutral-600" />
                            </button>
                            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors">
                                <Locate className="w-5 h-5 text-neutral-600" />
                            </button>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="p-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-success-500"></span>
                                <span className="text-sm text-neutral-600">Available ({statusCounts.Available})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-brand-500"></span>
                                <span className="text-sm text-neutral-600">In Use ({statusCounts['In Use']})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-warning-500"></span>
                                <span className="text-sm text-neutral-600">Warning ({statusCounts.Warning})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-danger-500"></span>
                                <span className="text-sm text-neutral-600">Offline ({statusCounts.Offline})</span>
                            </div>
                        </div>
                        <span className="text-sm text-neutral-400">Last updated: {getTimeAgo()}</span>
                    </div>
                </div>

                {/* Station List Sidebar */}
                <div className="bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 shrink-0">
                        <h3 className="font-semibold">Nearby Stations</h3>
                        <p className="text-sm text-neutral-500">{filteredStations.length} stations {activeFilter !== 'All' ? `(${activeFilter})` : 'in view'}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
                        {filteredStations.map((station) => {
                            const colors = getColorClasses(station.color);
                            const isSelected = selectedStation?.id === station.id;
                            return (
                                <div
                                    key={station.id}
                                    onClick={() => handleStationClick(station)}
                                    className={`p-4 cursor-pointer transition-colors ${isSelected ? 'bg-brand-50 border-l-4 border-brand-500' : 'hover:bg-neutral-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm">{station.name}</span>
                                        <span className={`text-xs ${colors.bgLight} ${colors.text} px-2 py-0.5 rounded-full`}>
                                            {station.count} {station.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500">{station.address}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs text-neutral-400">{station.distance} away</p>
                                        <p className="text-xs font-medium text-brand-600">{station.power}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
