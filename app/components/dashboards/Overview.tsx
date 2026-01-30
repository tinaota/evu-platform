'use client';

import { Activity, Zap, DollarSign, HeartPulse, TrendingUp, TrendingDown, AlertTriangle, MapPin } from 'lucide-react';
import { EnergyBarChart, PerformanceBarChart } from '../ChartComponents';

export default function Overview() {
    return (
        <div className="dashboard-view">
            {/* Alert Banner */}
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-warning-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-warning-800 text-sm sm:text-base">3 Chargers Require Attention</p>
                        <p className="text-xs sm:text-sm text-warning-600 truncate">Station Milwaukee-01: Charger #1203 offline</p>
                    </div>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 bg-warning-500 text-white rounded-lg text-sm font-medium hover:bg-warning-600 tap-target">
                    View Details
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
                {/* Active Sessions */}
                <div className="bg-white rounded-xl p-3 sm:p-5 border border-neutral-200 card-hover">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500" />
                        </div>
                        <span className="flex items-center gap-1 text-success-600 text-xs sm:text-sm font-medium">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            +12%
                        </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">24</p>
                    <p className="text-neutral-500 text-xs sm:text-sm">Active Sessions</p>
                    <div className="mt-2 sm:mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 sm:h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-xs text-neutral-500 hidden sm:inline">60%</span>
                    </div>
                </div>

                {/* Energy Delivered */}
                <div className="bg-white rounded-xl p-3 sm:p-5 border border-neutral-200 card-hover">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success-50 flex items-center justify-center">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-success-500" />
                        </div>
                        <span className="flex items-center gap-1 text-success-600 text-xs sm:text-sm font-medium">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            +8%
                        </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">5,146 <span className="text-sm sm:text-lg font-normal text-neutral-400">kWh</span></p>
                    <p className="text-neutral-500 text-xs sm:text-sm">Energy Today</p>
                    <div className="mt-2 sm:mt-3 text-xs text-neutral-500 hidden sm:block">
                        <span className="text-success-600 font-medium">Peak:</span> 2-4 PM
                    </div>
                </div>

                {/* Revenue */}
                <div className="bg-white rounded-xl p-3 sm:p-5 border border-neutral-200 card-hover">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                        </div>
                        <span className="flex items-center gap-1 text-success-600 text-xs sm:text-sm font-medium">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            +15%
                        </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">$1,588</p>
                    <p className="text-neutral-500 text-xs sm:text-sm">Revenue Today</p>
                    <div className="mt-2 sm:mt-3 text-xs text-neutral-500 hidden sm:block">
                        Avg: <span className="text-neutral-700 font-medium">$18.50</span>
                    </div>
                </div>

                {/* Station Health */}
                <div className="bg-white rounded-xl p-3 sm:p-5 border border-neutral-200 card-hover">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />
                        </div>
                        <span className="flex items-center gap-1 text-danger-600 text-xs sm:text-sm font-medium">
                            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            -2%
                        </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">92%</p>
                    <p className="text-neutral-500 text-xs sm:text-sm">Uptime</p>
                    <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-success-500"></span>
                            37 Online
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-danger-500"></span>
                            3 Offline
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map View */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    <div className="p-3 sm:p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base">Live Station Map</h3>
                            <p className="text-xs sm:text-sm text-neutral-500">Real-time charger status across all locations</p>
                        </div>
                        <div className="filter-scroll flex items-center gap-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                            <button className="px-3 py-1.5 text-sm bg-brand-50 text-brand-600 rounded-lg font-medium whitespace-nowrap">All</button>
                            <button className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg whitespace-nowrap">Available</button>
                            <button className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg whitespace-nowrap">In Use</button>
                            <button className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg whitespace-nowrap">Offline</button>
                        </div>
                    </div>
                    <div className="h-80 bg-neutral-100 relative">
                        {/* Map placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-3 map-pulse">
                                    <MapPin className="w-8 h-8 text-brand-500" />
                                </div>
                                <p className="text-neutral-500">Interactive Map View</p>
                                <p className="text-sm text-neutral-400">Showing 40 stations across Milwaukee</p>
                            </div>
                        </div>
                        {/* Station markers simulation */}
                        <div className="absolute top-16 left-20 w-8 h-8 rounded-full bg-success-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform">4</div>
                        <div className="absolute top-32 left-48 w-8 h-8 rounded-full bg-success-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform">2</div>
                        <div className="absolute top-24 right-32 w-8 h-8 rounded-full bg-warning-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform">3</div>
                        <div className="absolute bottom-20 left-32 w-8 h-8 rounded-full bg-danger-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform status-pulse">1</div>
                        <div className="absolute bottom-32 right-20 w-8 h-8 rounded-full bg-success-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform">5</div>
                    </div>
                    {/* Legend */}
                    <div className="p-3 sm:p-4 border-t border-neutral-100 flex flex-wrap items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-success-500"></span>
                            <span className="text-xs sm:text-sm text-neutral-600">Available (32)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-brand-500"></span>
                            <span className="text-xs sm:text-sm text-neutral-600">In Use (24)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-warning-500"></span>
                            <span className="text-xs sm:text-sm text-neutral-600">Warning (5)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-danger-500"></span>
                            <span className="text-xs sm:text-sm text-neutral-600">Offline (3)</span>
                        </div>
                    </div>
                </div>

                {/* Live Sessions */}
                <div className="bg-white rounded-xl border border-neutral-200">
                    <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Live Sessions</h3>
                            <p className="text-sm text-neutral-500">Currently charging</p>
                        </div>
                        <button className="text-brand-500 text-sm font-medium hover:text-brand-600">View All</button>
                    </div>
                    <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
                        {[
                            { name: 'Congress Center #1', energy: '45 kWh', cost: '$13.50', progress: 75, time: '45 min ago', status: 'Charging' },
                            { name: 'Public Market #2', energy: '28 kWh', cost: '$8.40', progress: 45, time: '28 min ago', status: 'Charging' },
                            { name: 'Downtown Plaza #3', energy: '62 kWh', cost: '$18.60', progress: 95, time: '1h 12m ago', status: 'Finishing' },
                            { name: 'East Side Hub #1', energy: '12 kWh', cost: '$3.60', progress: 20, time: '10 min ago', status: 'Charging' },
                        ].map((session, idx) => (
                            <div key={idx} className="p-4 hover:bg-neutral-50 cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{session.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${session.status === 'Finishing'
                                        ? 'bg-success-100 text-success-700'
                                        : 'bg-brand-100 text-brand-700'
                                        }`}>{session.status}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500">{session.energy} delivered</span>
                                    <span className="text-neutral-700 font-medium">{session.cost}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${session.status === 'Finishing' ? 'bg-success-500' : 'bg-brand-500'
                                                }`}
                                            style={{ width: `${session.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-neutral-500">{session.progress}%</span>
                                </div>
                                <p className="text-xs text-neutral-400 mt-2">Started {session.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Energy Usage Chart */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold">Energy Consumption</h3>
                            <p className="text-sm text-neutral-500">Last 7 days</p>
                        </div>
                        <select className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                    {/* Interactive Energy Chart */}
                    <EnergyBarChart
                        data={[
                            { day: 'Mon', kwh: 4200 },
                            { day: 'Tue', kwh: 5100 },
                            { day: 'Wed', kwh: 3600 },
                            { day: 'Thu', kwh: 5800 },
                            { day: 'Fri', kwh: 4500 },
                            { day: 'Sat', kwh: 6400 },
                            { day: 'Sun', kwh: 4458 },
                        ]}
                        height={192}
                    />
                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">Total this week</p>
                            <p className="text-xl font-bold">32,458 kWh</p>
                        </div>
                        <div className="flex items-center gap-1 text-success-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">+12.5% vs last week</span>
                        </div>
                    </div>
                </div>

                {/* Station Performance */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold">Top Performing Stations</h3>
                            <p className="text-sm text-neutral-500">By sessions this week</p>
                        </div>
                        <button className="text-brand-500 text-sm font-medium hover:text-brand-600">View All</button>
                    </div>
                    <PerformanceBarChart
                        data={[
                            { name: 'Congress Center', sessions: 342 },
                            { name: 'Public Market', sessions: 298 },
                            { name: 'Downtown Plaza', sessions: 256 },
                            { name: 'East Side Hub', sessions: 201 },
                            { name: 'Lakefront Station', sessions: 187 },
                        ]}
                        height={250}
                    />
                </div>
            </div>
        </div>
    );
}
