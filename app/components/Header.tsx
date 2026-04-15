'use client';

import { Menu, Search, Calendar, Bell, Plus, ChevronDown, X, Zap, Clock } from 'lucide-react';
import { useState } from 'react';
import { useRealtimeSessions } from '@/lib/hooks/useRealtimeSessions';

interface HeaderProps {
    onMenuToggle: () => void;
    pageTitle: string;
    pageSubtitle: string;
    onAddStation?: () => void;
}

export default function Header({ onMenuToggle, pageTitle, pageSubtitle, onAddStation }: HeaderProps) {
    const [notifOpen, setNotifOpen] = useState(false);
    const { sessions: activeSessions } = useRealtimeSessions();

    return (
        <header className="h-14 sm:h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-3 sm:px-6 shrink-0 relative">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <button onClick={onMenuToggle} className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg shrink-0 tap-target">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold truncate">{pageTitle}</h2>
                    <p className="text-xs sm:text-sm text-neutral-500 truncate hidden sm:block">{pageSubtitle}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {/* Mobile Search Button */}
                <button className="md:hidden p-2 hover:bg-neutral-100 rounded-lg tap-target">
                    <Search className="w-5 h-5 text-neutral-600" />
                </button>

                {/* Search (Desktop) */}
                <div className="relative hidden md:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search stations, chargers..."
                        className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-neutral-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>

                {/* Date Range (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg cursor-pointer hover:bg-neutral-200">
                    <Calendar className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm">Jan 22 - Jan 28, 2026</span>
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative p-2 hover:bg-neutral-100 rounded-lg tap-target"
                    >
                        <Bell className="w-5 h-5 text-neutral-600" />
                        {activeSessions.length > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 z-50">
                            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                                <h4 className="font-semibold text-sm">Notifications</h4>
                                <button onClick={() => setNotifOpen(false)} className="p-1 hover:bg-neutral-100 rounded-lg">
                                    <X className="w-4 h-4 text-neutral-500" />
                                </button>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {activeSessions.length === 0 ? (
                                    <div className="p-6 text-center text-neutral-400 text-sm">No active notifications</div>
                                ) : (
                                    activeSessions.slice(0, 5).map((session) => (
                                        <div key={session.id} className="p-4 border-b border-neutral-50 hover:bg-neutral-50">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                                                    <Zap className="w-4 h-4 text-brand-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{session.stationName}</p>
                                                    <p className="text-xs text-neutral-500">{session.energy.toFixed(1)} kWh · ${session.cost.toFixed(2)}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Clock className="w-3 h-3 text-neutral-400" />
                                                        <span className="text-xs text-neutral-400">{session.duration} min elapsed</span>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 shrink-0">Live</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {activeSessions.length > 0 && (
                                <div className="p-3 border-t border-neutral-100">
                                    <p className="text-xs text-center text-neutral-500">{activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <button
                    onClick={onAddStation}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors tap-target"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Add Station</span>
                </button>
            </div>
        </header>
    );
}
