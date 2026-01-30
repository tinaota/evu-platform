'use client';

import { Zap, LayoutDashboard, Map, Building2, PlugZap, Activity, DollarSign, BatteryCharging, FileBarChart, Wrench, AlertTriangle, Users, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
    currentRole: string;
    onRoleChange: (role: string) => void;
    onNavigate: (view: string) => void;
    currentView: string;
    onClose: () => void;
    isOpen: boolean;
}

export default function Sidebar({ currentRole, onRoleChange, onNavigate, currentView, onClose, isOpen }: SidebarProps) {
    const roleLabels: Record<string, string> = {
        'operator': 'Operator',
        'owner': 'Owner / Finance',
        'technician': 'Service Technician',
        'admin': 'System Admin'
    };

    const shouldShowMenuItem = (itemRole?: string) => {
        if (!itemRole) return true;
        if (currentRole === 'admin') return true;
        return currentRole === itemRole;
    };

    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Dashboard', section: 'main' },
        { id: 'map', icon: Map, label: 'Live Map', section: 'main' },
        { id: 'stations', icon: Building2, label: 'Stations', section: 'main' },
        { id: 'chargers', icon: PlugZap, label: 'Chargers', section: 'main' },
        { id: 'sessions', icon: Activity, label: 'Sessions', section: 'main' },
        { id: 'revenue', icon: DollarSign, label: 'Revenue', section: 'analytics', role: 'owner' },
        { id: 'energy', icon: BatteryCharging, label: 'Energy', section: 'analytics' },
        { id: 'reports', icon: FileBarChart, label: 'Reports', section: 'analytics' },
        { id: 'diagnostics', icon: Wrench, label: 'Diagnostics', section: 'maintenance', role: 'technician' },
        { id: 'alerts', icon: AlertTriangle, label: 'Alerts', section: 'maintenance', role: 'technician', badge: '3' },
        { id: 'users', icon: Users, label: 'User Management', section: 'admin', role: 'admin' },
        { id: 'settings', icon: Settings, label: 'Settings', section: 'admin', role: 'admin' },
    ];

    const sections = [
        { id: 'main', label: 'Main' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'maintenance', label: 'Maintenance', role: 'technician' },
        { id: 'admin', label: 'Administration', role: 'admin' },
    ];

    return (
        <aside id="sidebar" className={`sidebar-transition w-64 bg-neutral-900 text-white flex flex-col z-50 ${isOpen ? 'sidebar-open' : ''}`}>
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-neutral-700">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-bold text-lg">EVU Platform</h1>
                        <p className="text-xs text-neutral-400">Charging Management</p>
                    </div>
                </div>
                {/* Mobile Close Button */}
                <button onClick={onClose} className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg ml-2">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Role Selector */}
            <div className="px-3 py-4 border-b border-neutral-700">
                <label className="text-xs text-neutral-400 uppercase tracking-wider mb-2 block">View As</label>
                <select
                    value={currentRole}
                    onChange={(e) => onRoleChange(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="operator">Operator (CPO)</option>
                    <option value="owner">Owner / Finance</option>
                    <option value="technician">Service Technician</option>
                    <option value="admin">System Admin</option>
                </select>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {sections.map(section => {
                    const sectionItems = navItems.filter(item => item.section === section.id);
                    const hasVisibleItems = sectionItems.some(item => shouldShowMenuItem(item.role));

                    if (!hasVisibleItems || (section.role && !shouldShowMenuItem(section.role))) {
                        return null;
                    }

                    return (
                        <div key={section.id}>
                            <div className="px-3 mb-2 mt-6 first:mt-0">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">{section.label}</p>
                            </div>
                            {sectionItems.map(item => {
                                if (!shouldShowMenuItem(item.role)) return null;

                                const Icon = item.icon;
                                const isActive = currentView === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onNavigate(item.id)}
                                        className={`nav-item flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg mb-1 w-[calc(100%-1rem)] ${isActive
                                            ? 'bg-brand-500/20 text-brand-400'
                                            : 'text-neutral-300 hover:bg-neutral-800'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <span className="ml-auto bg-danger-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-neutral-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-sm font-semibold">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">John Doe</p>
                        <p className="text-xs text-neutral-400 truncate">{roleLabels[currentRole]}</p>
                    </div>
                    <button className="p-2 hover:bg-neutral-800 rounded-lg">
                        <LogOut className="w-4 h-4 text-neutral-400" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
