'use client';

import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';

interface ActiveSession {
    id: string;
    stationName: string;
    sessionId: string;
    avatar: string;
    energy: number;
    duration: number;
    cost: number;
    progress: number;
    status: 'Charging';
}

interface HistoricalSession {
    id: string;
    station: string;
    startTime: string;
    duration: string;
    energy: string;
    revenue: string;
    status: 'Completed';
}

interface SessionsByHour {
    hour: string;
    count: number;
}

export default function Sessions() {
    const [filterPeriod, setFilterPeriod] = useState('Today');

    // Mock data for active sessions
    const activeSessions: ActiveSession[] = [
        {
            id: '1',
            stationName: 'Congress Center #1',
            sessionId: 'SES-20260129-001',
            avatar: '04',
            energy: 45.2,
            duration: 45,
            cost: 13.56,
            progress: 75,
            status: 'Charging'
        },
        {
            id: '2',
            stationName: 'Public Market #2',
            sessionId: 'SES-20260129-002',
            avatar: '04',
            energy: 28.1,
            duration: 28,
            cost: 8.43,
            progress: 45,
            status: 'Charging'
        }
    ];

    // Mock data for session history
    const sessionHistory: HistoricalSession[] = [
        {
            id: 'SES-001',
            station: 'Congress Center #1',
            startTime: '10:30 AM',
            duration: '52 min',
            energy: '62.4 kWh',
            revenue: '$18.72',
            status: 'Completed'
        },
        {
            id: 'SES-002',
            station: 'Public Market #2',
            startTime: '09:15 AM',
            duration: '38 min',
            energy: '41.2 kWh',
            revenue: '$12.36',
            status: 'Completed'
        }
    ];

    // Sessions by hour data
    const sessionsByHour: SessionsByHour[] = [
        { hour: '6AM', count: 15 },
        { hour: '9AM', count: 25 },
        { hour: '12PM', count: 45 },
        { hour: '3PM', count: 52 },
        { hour: '6PM', count: 38 }
    ];

    const maxSessions = Math.max(...sessionsByHour.map(s => s.count));

    return (
        <div className="dashboard-content">
            {/* Redundant header removed as it is provided by the parent layout */}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Active Sessions & History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Sessions */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-lg font-semibold text-neutral-900">Active Sessions</h2>
                                <p className="text-sm text-neutral-500 mt-0.5">24 sessions in progress</p>
                            </div>
                            <button className="text-brand-600 text-sm font-medium hover:text-brand-700 flex items-center gap-1">
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>

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
                                                <span className="px-2.5 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-full">
                                                    {session.status}
                                                </span>
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
                                                    <p className="text-sm font-semibold text-brand-600 mt-0.5">${session.cost}</p>
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
                                                ></div>
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
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-neutral-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Session ID</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Station</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Start Time</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Duration</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Energy</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Revenue</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessionHistory.map((session) => (
                                        <tr key={session.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                            <td className="py-3 px-4 text-sm text-neutral-900">{session.id}</td>
                                            <td className="py-3 px-4 text-sm text-neutral-900">{session.station}</td>
                                            <td className="py-3 px-4 text-sm text-neutral-600">{session.startTime}</td>
                                            <td className="py-3 px-4 text-sm text-neutral-600">{session.duration}</td>
                                            <td className="py-3 px-4 text-sm text-brand-600 font-medium">{session.energy}</td>
                                            <td className="py-3 px-4 text-sm text-success-600 font-medium">{session.revenue}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2.5 py-1 bg-success-100 text-success-700 text-xs font-medium rounded-full">
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

                {/* Right Column - Today's Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-6">Today's Summary</h2>

                        <div className="space-y-5 mb-8">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-600">Total Sessions</span>
                                <span className="text-2xl font-bold text-neutral-900">156</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-600">Energy Delivered</span>
                                <span className="text-2xl font-bold text-neutral-900">5,146 kWh</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-600">Total Revenue</span>
                                <span className="text-2xl font-bold text-success-600">$1,543.80</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-neutral-600">Avg. Duration</span>
                                <span className="text-2xl font-bold text-neutral-900">42 min</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Sessions by Hour</h3>
                            <div className="space-y-3">
                                {sessionsByHour.map((item) => (
                                    <div key={item.hour} className="flex items-center gap-3">
                                        <span className="text-xs text-neutral-500 w-10 text-right">{item.hour}</span>
                                        <div className="flex-1 h-8 bg-neutral-100 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-brand-500 rounded transition-all duration-300"
                                                style={{ width: `${(item.count / maxSessions) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-neutral-600 w-8">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                                <span className="text-xs text-neutral-500">6AM</span>
                                <span className="text-xs text-neutral-500">12PM</span>
                                <span className="text-xs text-neutral-500">6PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
