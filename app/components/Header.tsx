'use client';

import { Menu, Search, Calendar, Bell, Plus, ChevronDown } from 'lucide-react';

interface HeaderProps {
    onMenuToggle: () => void;
    pageTitle: string;
    pageSubtitle: string;
}

export default function Header({ onMenuToggle, pageTitle, pageSubtitle }: HeaderProps) {
    return (
        <header className="h-14 sm:h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-3 sm:px-6 shrink-0">
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
                <button className="relative p-2 hover:bg-neutral-100 rounded-lg tap-target">
                    <Bell className="w-5 h-5 text-neutral-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                </button>

                {/* Quick Actions */}
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors tap-target">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Add Station</span>
                </button>
            </div>
        </header>
    );
}
