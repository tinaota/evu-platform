'use client';

import { useState } from 'react';
import { Search, Layers, Maximize2, Minimize2, X, Zap, Clock, DollarSign, Navigation, CheckCircle2, AlertTriangle, WifiOff } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useStations } from '@/lib/hooks/useStations';
import type { Station } from '@/lib/types';
import StartSessionModal from '@/app/components/modals/StartSessionModal';

const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-neutral-100 animate-pulse flex items-center justify-center text-neutral-400">Loading Map...</div>
});

export default function LiveMap() {
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showStartModal, setShowStartModal] = useState(false);
    const [satelliteLayer, setSatelliteLayer] = useState(false);
    const [sidebarHidden, setSidebarHidden] = useState(false);

    const { stations: allStations, loading } = useStations();

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

    const getColorClasses = (color: string) => {
        const colorMap: Record<string, { bg: string; bgLight: string; text: string; border: string }> = {
            success: { bg: 'bg-success-500', bgLight: 'bg-success-100', text: 'text-success-700', border: 'border-success-500' },
            brand: { bg: 'bg-brand-500', bgLight: 'bg-brand-100', text: 'text-brand-700', border: 'border-brand-500' },
            warning: { bg: 'bg-warning-500', bgLight: 'bg-warning-100', text: 'text-warning-700', border: 'border-warning-500' },
            danger: { bg: 'bg-danger-500', bgLight: 'bg-danger-100', text: 'text-danger-700', border: 'border-danger-500' },
        };
        return colorMap[color] || colorMap.success;
    };

    return (
        <>
        <div className="dashboard-view">
            <div className={`grid grid-cols-1 gap-4 sm:gap-6 h-auto lg:h-[calc(100vh-180px)] ${sidebarHidden ? '' : 'lg:grid-cols-4'}`}>
                {/* Map Area */}
                <div className={`${sidebarHidden ? 'col-span-full' : 'lg:col-span-3'} bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col`}>
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
                                <button
                                    onClick={() => setSatelliteLayer(v => !v)}
                                    className={`p-2 rounded-lg tap-target transition-colors ${satelliteLayer ? 'bg-brand-50 text-brand-600' : 'hover:bg-neutral-100 text-neutral-500'}`}
                                    title={satelliteLayer ? 'Street view' : 'Satellite view'}
                                >
                                    <Layers className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSidebarHidden(v => !v)}
                                    className="p-2 hover:bg-neutral-100 rounded-lg tap-target"
                                    title={sidebarHidden ? 'Show sidebar' : 'Expand map'}
                                >
                                    {sidebarHidden ? <Minimize2 className="w-5 h-5 text-neutral-500" /> : <Maximize2 className="w-5 h-5 text-neutral-500" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-neutral-100 relative min-h-[400px]">
                        <MapComponent
                            stations={filteredStations}
                            selectedStation={selectedStation}
                            onStationClick={handleStationClick}
                            satelliteLayer={satelliteLayer}
                        />

                        {/* Selected Station Overlay - Keeping the custom UI but showing it when selected */}
                        {selectedStation && (
                            <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 p-5 z-[1000] animate-in fade-in zoom-in duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{selectedStation.name}</h3>
                                        <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                                            <Navigation className="w-3 h-3" />
                                            {selectedStation.address}
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
                                    {selectedStation.available_chargers} of {selectedStation.chargers} available
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
                                    {selectedStation.lastUpdate && (
                                      <div className="flex items-center justify-between text-sm">
                                          <span className="text-neutral-500 flex items-center gap-2">
                                              <Clock className="w-4 h-4" />
                                              Last Update
                                          </span>
                                          <span className="font-semibold">{selectedStation.lastUpdate}</span>
                                      </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {selectedStation.status !== 'Offline' && selectedStation.available_chargers > 0 && (
                                      <button
                                          onClick={() => setShowStartModal(true)}
                                          className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
                                      >
                                          Start Charging Here
                                      </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedStation(null)}
                                        className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
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
                        <span className="text-sm text-neutral-400">{loading ? 'Loading...' : `${allStations.length} stations loaded`}</span>
                    </div>
                </div>

                {/* Station List Sidebar */}
                {!sidebarHidden && <div className="bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 shrink-0">
                        <h3 className="font-semibold">Nearby Stations</h3>
                        <p className="text-sm text-neutral-500">{filteredStations.length} stations {activeFilter !== 'All' ? `(${activeFilter})` : 'in view'}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
                        {loading && (
                            <div className="p-4 text-center text-neutral-400 text-sm">Loading stations...</div>
                        )}
                        {filteredStations.map((station) => {
                            const colors = getColorClasses(station.color);
                            const isSelected = selectedStation?.id === station.id;

                            const StatusIcon =
                                station.status === 'Available' ? CheckCircle2 :
                                station.status === 'In Use' ? Zap :
                                station.status === 'Warning' ? AlertTriangle :
                                WifiOff;

                            return (
                                <div
                                    key={station.id}
                                    onClick={() => handleStationClick(station)}
                                    className={`p-4 cursor-pointer transition-colors ${isSelected ? 'bg-brand-50 border-l-4 border-brand-500' : 'hover:bg-neutral-50'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm">{station.name}</span>
                                        <span className={`text-xs ${colors.bgLight} ${colors.text} px-2 py-0.5 rounded-full`}>
                                            {station.available_chargers} avail
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500">{station.address}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className={`flex items-center gap-1 text-xs ${colors.text} font-medium`}>
                                            <StatusIcon className="w-3 h-3" aria-hidden="true" />
                                            {station.status}
                                        </span>
                                        <p className="text-xs font-medium text-brand-600">{station.power}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>}
            </div>
        </div>

        {showStartModal && selectedStation && (
            <StartSessionModal
                station={{ id: selectedStation.id, name: selectedStation.name, price_per_kwh: parseFloat(selectedStation.price.replace('$', '').replace('/kWh', '')) }}
                onClose={() => setShowStartModal(false)}
                onSuccess={() => setShowStartModal(false)}
            />
        )}
        </>
    );
}
