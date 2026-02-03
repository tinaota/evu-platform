'use client';

import { RevenueLineChart, EnergyBarChart, StackedBarChart, TrendLineChart } from '../ChartComponents';
import { TrendingUp, DollarSign, Receipt, User, Percent, ArrowUpRight, ChevronRight, AlertCircle, AlertTriangle, CheckCircle2, XCircle, Thermometer, Zap, Info as InfoIcon, UserPlus, Edit, Trash2, FileText, Download, Building2, Palette, Bell, CreditCard, Plug, Shield } from 'lucide-react';
import { useState } from 'react';

// Revenue Dashboard with interactive charts
export function Revenue() {
    const [activeTab, setActiveTab] = useState('Revenue');

    const revenueData = [
        { date: 'Week 1', revenue: 12000 },
        { date: 'Week 2', revenue: 15400 },
        { date: 'Week 3', revenue: 11800 },
        { date: 'Week 4', revenue: 8692 },
    ];

    const revenueByStationData = [
        { name: 'Congress Center', revenue: '$12,450' },
        { name: 'Public Market', revenue: '$10,890' },
        { name: 'Downtown Plaza', revenue: '$8,765' },
        { name: 'East Side Hub', revenue: '$7,234' },
        { name: 'Lakefront Station', revenue: '$6,553' },
    ];

    const stats = [
        { label: 'Total Revenue (MTD)', value: '$47,892', trend: '+18%', icon: DollarSign, color: 'emerald' },
        { label: 'Total Transactions', value: '2,847', trend: '+24%', icon: Receipt, color: 'blue' },
        { label: 'Avg. Transaction Value', value: '$16.82', trend: '+9%', icon: User, color: 'brand' },
        { label: 'Profit Margin', value: '32%', trend: '+5%', icon: Percent, color: 'amber' },
    ];

    return (
        <div className="dashboard-view">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color === 'brand' ? 'brand' : stat.color}-50 flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color === 'brand' ? 'brand' : stat.color}-500`} />
                            </div>
                            <div className="flex items-center gap-1 text-success-600 text-sm font-semibold">
                                <TrendingUp className="w-4 h-4" />
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                            <p className="text-neutral-500 text-sm">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <h3 className="text-lg font-bold text-neutral-800">Revenue Overview</h3>
                        <div className="flex bg-neutral-100 p-1 rounded-xl">
                            {['Revenue', 'Costs', 'Profit'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-white text-brand-600 shadow-sm'
                                        : 'text-neutral-500 hover:text-neutral-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[400px] w-full flex flex-col justify-end">
                        <RevenueLineChart data={revenueData} height={350} />
                        <div className="flex justify-between px-10 mt-4 text-sm text-neutral-400 font-medium">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Revenue by Station */}
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-neutral-800">Revenue by Station</h3>
                    </div>

                    <div className="space-y-1">
                        {revenueByStationData.map((station, idx) => (
                            <div
                                key={idx}
                                className="group flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-neutral-700 font-medium transition-colors group-hover:text-brand-600">
                                        {station.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-neutral-900 font-bold">{station.revenue}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 border border-neutral-100 rounded-xl text-neutral-500 text-sm font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
                        View Detailed Report
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Energy Dashboard with interactive charts
export function Energy() {
    const energyTrendData = [
        { time: '12AM', peak: 120, offPeak: 80 },
        { time: '3AM', peak: 90, offPeak: 60 },
        { time: '6AM', peak: 180, offPeak: 120 },
        { time: '9AM', peak: 420, offPeak: 280 },
        { time: '12PM', peak: 580, offPeak: 380 },
        { time: '3PM', peak: 680, offPeak: 450 },
        { time: '6PM', peak: 820, offPeak: 540 },
        { time: '9PM', peak: 480, offPeak: 320 },
    ];

    const weeklyEnergyData = [
        { name: 'Mon', peak: 4200, offPeak: 2800 },
        { name: 'Tue', peak: 5100, offPeak: 3400 },
        { name: 'Wed', peak: 3600, offPeak: 2400 },
        { name: 'Thu', peak: 5800, offPeak: 3900 },
        { name: 'Fri', peak: 4500, offPeak: 3000 },
        { name: 'Sat', peak: 6400, offPeak: 4300 },
        { name: 'Sun', peak: 4458, offPeak: 2972 },
    ];

    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                    { label: 'Total Energy (MTD)', value: '156,420 kWh', trend: '+15%' },
                    { label: 'Peak Usage', value: '820 kW', trend: '+8%' },
                    { label: 'Avg. Efficiency', value: '94.2%', trend: '+2.1%' },
                    { label: 'Cost Savings', value: '$12,450', trend: '+18%' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-neutral-200 card-hover">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-neutral-500 text-sm">{stat.label}</p>
                        <span className="text-success-600 text-sm font-medium">{stat.trend}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <h3 className="text-lg font-semibold mb-4">Peak vs Off-Peak Usage (Weekly)</h3>
                    <StackedBarChart
                        data={weeklyEnergyData}
                        bars={[
                            { dataKey: 'peak', name: 'Peak Hours', color: '#3B82F6' },
                            { dataKey: 'offPeak', name: 'Off-Peak Hours', color: '#93C5FD' },
                        ]}
                        height={300}
                    />
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <h3 className="text-lg font-semibold mb-4">Energy Consumption by Time</h3>
                    <TrendLineChart
                        data={energyTrendData}
                        lines={[
                            { dataKey: 'peak', name: 'Peak Hours', color: '#3B82F6' },
                            { dataKey: 'offPeak', name: 'Off-Peak Hours', color: '#10B981' },
                        ]}
                        height={300}
                    />
                </div>
            </div>
        </div>
    );
}


export function Diagnostics() {
    const alerts = [
        {
            id: 1,
            title: "Charger Offline - Congress Center #3",
            subtitle: "Communication lost 2 hours ago",
            severity: "CRITICAL",
            type: "offline",
            icon: XCircle,
            action: "Diagnose",
            color: "danger"
        },
        {
            id: 2,
            title: "Overheating - Public Market #1",
            subtitle: "Temperature exceeds threshold (85C)",
            severity: "CRITICAL",
            type: "temperature",
            icon: Thermometer,
            action: "Diagnose",
            color: "danger"
        },
        {
            id: 3,
            title: "Low Power Output - Downtown Plaza #2",
            subtitle: "Operating at 60% capacity",
            severity: "WARNING",
            type: "power",
            icon: Zap,
            action: "Inspect",
            color: "warning"
        }
    ];

    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-danger-50 border border-danger-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-danger-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-danger-800">Critical Issues</p>
                            <p className="text-sm text-danger-600">Requires immediate attention</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-danger-700">3</p>
                </div>

                <div className="bg-warning-50 border border-warning-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-warning-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-warning-800">Warnings</p>
                            <p className="text-sm text-warning-600">Monitor closely</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-warning-700">8</p>
                </div>

                <div className="bg-success-50 border border-success-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-success-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-success-800">Healthy</p>
                            <p className="text-sm text-success-600">Operating normally</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-success-700">37</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-100">
                    <h3 className="font-bold text-neutral-800">Active Alerts</h3>
                </div>
                <div className="divide-y divide-neutral-100">
                    {alerts.map((alert) => (
                        <div key={alert.id} className={`p-4 flex items-center gap-4 transition-colors ${alert.severity === 'CRITICAL' ? 'bg-danger-50/50' : 'bg-warning-50/50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-danger-100' : 'bg-warning-100'}`}>
                                <alert.icon className={`w-5 h-5 ${alert.severity === 'CRITICAL' ? 'text-danger-600' : 'text-warning-600'}`} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-neutral-900 text-sm">{alert.title}</p>
                                <p className="text-xs text-neutral-500">{alert.subtitle}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded tracking-wider ${alert.severity === 'CRITICAL' ? 'bg-danger-100 text-danger-600' : 'bg-warning-100 text-warning-600'}`}>
                                {alert.severity}
                            </span>
                            <button className={`px-3 py-1.5 rounded-lg text-sm font-bold text-white transition-all active:scale-95 ${alert.severity === 'CRITICAL' ? 'bg-danger-600 hover:bg-danger-700' : 'bg-warning-600 hover:bg-warning-700'}`}>
                                {alert.action}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function Alerts() {
    const [activeTab, setActiveTab] = useState('All');

    const alertItems = [
        {
            id: 1,
            title: "Charger Offline - East Side Hub #1",
            subtitle: "Communication lost. Last seen 2 hours ago.",
            timestamp: "Jan 29, 2026 at 10:45 AM",
            severity: "CRITICAL",
            icon: XCircle,
            actions: ["Diagnose", "Acknowledge"],
            color: "rose"
        },
        {
            id: 2,
            title: "High Temperature - Public Market #1",
            subtitle: "Temperature at 72C (threshold: 70C)",
            timestamp: "Jan 29, 2026 at 11:20 AM",
            severity: "WARNING",
            icon: Thermometer,
            actions: ["Inspect", "Acknowledge"],
            color: "amber"
        },
        {
            id: 3,
            title: "Firmware Update Available",
            subtitle: "Version 2.4.1 is available for 12 chargers",
            timestamp: "Jan 29, 2026 at 09:00 AM",
            severity: "INFO",
            icon: InfoIcon,
            actions: ["View Details", "Dismiss"],
            color: "blue"
        }
    ];

    const stats = [
        { label: 'Critical', value: '3', color: 'danger' },
        { label: 'Warning', value: '8', color: 'warning' },
        { label: 'Info', value: '12', color: 'blue' },
        { label: 'Resolved', value: '5', color: 'slate' },
    ];

    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`rounded-xl p-4 sm:p-5 border shadow-sm ${stat.color === 'danger' ? 'bg-danger-50 border-danger-200' :
                        stat.color === 'warning' ? 'bg-warning-50 border-warning-200' :
                            stat.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                                'bg-neutral-50 border-neutral-200'
                        }`}>
                        <p className={`text-xs sm:text-sm font-bold mb-1 ${stat.color === 'danger' ? 'text-danger-600' :
                            stat.color === 'warning' ? 'text-warning-600' :
                                stat.color === 'blue' ? 'text-blue-600' :
                                    'text-neutral-600'
                            }`}>{stat.label}</p>
                        <p className={`text-2xl sm:text-3xl font-bold ${stat.color === 'danger' ? 'text-danger-700' :
                            stat.color === 'warning' ? 'text-warning-700' :
                                stat.color === 'blue' ? 'text-blue-700' :
                                    'text-neutral-700'
                            }`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-bold text-neutral-800">All Alerts</h3>
                    <div className="flex bg-neutral-100 p-1 rounded-xl w-fit">
                        {['All', 'Critical', 'Warning', 'Info'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab
                                    ? 'bg-white text-brand-600 shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="divide-y divide-neutral-100">
                    {alertItems
                        .filter(item => activeTab === 'All' || item.severity === activeTab.toUpperCase())
                        .map((alert) => (
                            <div key={alert.id} className={`p-4 transition-colors ${alert.severity === 'CRITICAL' ? 'bg-danger-50/50' : alert.severity === 'WARNING' ? 'bg-warning-50/50' : ''}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-danger-100' : alert.severity === 'WARNING' ? 'bg-warning-100' : 'bg-blue-100'}`}>
                                        <alert.icon className={`w-5 h-5 ${alert.severity === 'CRITICAL' ? 'text-danger-600' : alert.severity === 'WARNING' ? 'text-warning-600' : 'text-blue-600'}`} />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="font-bold text-neutral-900 text-sm sm:text-base truncate">{alert.title}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-danger-100 text-danger-600' : alert.severity === 'WARNING' ? 'bg-warning-100 text-warning-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mb-1">{alert.subtitle}</p>
                                        <p className="text-[10px] text-neutral-400 font-medium">{alert.timestamp}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            {alert.actions.map((action, idx) => (
                                                <button key={idx} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${idx === 0
                                                    ? (alert.color === 'danger' ? 'bg-danger-500 hover:bg-danger-600 text-white shadow-sm' :
                                                        alert.color === 'warning' ? 'bg-warning-500 hover:bg-warning-600 text-white shadow-sm' :
                                                            'bg-blue-500 hover:bg-blue-600 text-white shadow-sm')
                                                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
                                                    }`}>
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export function Users() {
    const users = [
        { name: 'John Doe', email: 'john@alliantenergy.com', role: 'Operator', status: 'Active', lastActive: '2 min ago', initials: 'JD', color: 'bg-brand-100 text-brand-600' },
        { name: 'Sarah Miller', email: 'sarah@alliantenergy.com', role: 'Owner', status: 'Active', lastActive: '1 hour ago', initials: 'SM', color: 'bg-violet-100 text-violet-600' },
        { name: 'Mike Johnson', email: 'mike@alliantenergy.com', role: 'Technician', status: 'Offline', lastActive: 'Yesterday', initials: 'MJ', color: 'bg-amber-100 text-amber-600' },
    ];

    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {[
                    { label: 'Total Users', value: '1,247' },
                    { label: 'Active Today', value: '89' },
                    { label: 'Operators', value: '12' },
                    { label: 'Technicians', value: '8' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm">
                        <p className="text-sm text-neutral-500 mb-1 leading-tight">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-bold text-neutral-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="font-bold text-neutral-800">User Management</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 text-left border-b border-neutral-100">
                            <tr>
                                <th className="text-xs font-bold text-neutral-500 px-6 py-4 uppercase tracking-wider text-left">User</th>
                                <th className="text-xs font-bold text-neutral-500 px-6 py-4 uppercase tracking-wider text-left">Role</th>
                                <th className="text-xs font-bold text-neutral-500 px-6 py-4 uppercase tracking-wider text-left">Status</th>
                                <th className="text-xs font-bold text-neutral-500 px-6 py-4 uppercase tracking-wider text-left">Last Active</th>
                                <th className="text-xs font-bold text-neutral-500 px-6 py-4 uppercase tracking-wider text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {users.map((user, idx) => (
                                <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.color}`}>
                                                {user.initials}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-neutral-900 text-sm">{user.name}</p>
                                                <p className="text-xs text-neutral-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-neutral-700">{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'Active'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-neutral-100 text-neutral-600'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-neutral-500">{user.lastActive}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function Reports() {
    const recentReports = [
        { name: 'Revenue Report - Jan 2026', date: 'Jan 28, 2026', type: 'PDF', color: 'bg-rose-50 text-rose-500', icon: FileText },
        { name: 'Energy Report - Week 4', date: 'Jan 27, 2026', type: 'XLSX', color: 'bg-emerald-50 text-emerald-500', icon: FileText },
        { name: 'Session Summary - Jan', date: 'Jan 25, 2026', type: 'PDF', color: 'bg-blue-50 text-blue-500', icon: FileText },
    ];

    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
                        <div className="p-4 border-b border-neutral-100">
                            <h3 className="font-bold text-neutral-800">Generate Report</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Report Type</label>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 bg-neutral-50 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm">
                                        <option>Revenue Report</option>
                                        <option>Energy Consumption Report</option>
                                        <option>Session Summary Report</option>
                                        <option>Station Performance Report</option>
                                        <option>Maintenance Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Date Range</label>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 bg-neutral-50 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm">
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                        <option>Last Quarter</option>
                                        <option>Year to Date</option>
                                        <option>Custom Range</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Stations</label>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 bg-neutral-50 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm">
                                        <option>All Stations</option>
                                        <option>Congress Center</option>
                                        <option>Public Market</option>
                                        <option>Downtown Plaza</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Format</label>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 bg-neutral-50 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm">
                                        <option>PDF</option>
                                        <option>Excel (XLSX)</option>
                                        <option>CSV</option>
                                    </select>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-md hover:bg-brand-700 active:scale-95 transition-all">
                                <FileText className="w-5 h-5" />
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-100">
                        <h3 className="font-bold text-neutral-800">Recent Reports</h3>
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {recentReports.map((report, idx) => (
                            <div key={idx} className="p-4 hover:bg-neutral-50 cursor-pointer flex items-center justify-between transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.color}`}>
                                        <report.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-neutral-900 text-sm leading-tight">{report.name}</p>
                                        <p className="text-xs text-neutral-500">Generated {report.date}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Settings() {
    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-2 h-fit lg:sticky lg:top-6">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        {[
                            { label: 'General', icon: Building2, active: true },
                            { label: 'Branding', icon: Palette, active: false },
                            { label: 'Notifications', icon: Bell, active: false },
                            { label: 'Billing', icon: CreditCard, active: false },
                            { label: 'Integrations', icon: Plug, active: false },
                            { label: 'Security', icon: Shield, active: false },
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${item.active
                                    ? 'bg-brand-50 text-brand-600 shadow-sm'
                                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
                        <div className="p-4 border-b border-neutral-100">
                            <h3 className="font-bold text-neutral-800">General Settings</h3>
                            <p className="text-xs text-neutral-500">Configure your platform settings</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Organization Name</label>
                                <input type="text" defaultValue="Alliant Energy" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 bg-neutral-50 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm font-medium" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Default Currency</label>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 bg-neutral-50 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm font-medium">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Timezone</label>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 bg-neutral-50 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm font-medium">
                                        <option>America/Chicago (CST)</option>
                                        <option>America/New_York (EST)</option>
                                        <option>America/Los_Angeles (PST)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Default Pricing (per kWh)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                                    <input type="text" defaultValue="0.30" className="w-full border border-neutral-200 rounded-lg pl-8 pr-4 py-2.5 bg-neutral-50 focus:ring-2 focus:ring-brand-500 transition-all outline-none text-sm font-medium" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-neutral-100">
                            <h3 className="font-bold text-neutral-800">Notification Preferences</h3>
                        </div>
                        <div className="p-6 space-y-6 divide-y divide-neutral-50">
                            <div className="flex items-center justify-between pb-6">
                                <div>
                                    <p className="font-bold text-neutral-900 leading-tight">Critical Alerts</p>
                                    <p className="text-sm text-neutral-500">Receive alerts for offline chargers and critical issues</p>
                                </div>
                                <button className="w-11 h-6 bg-brand-500 rounded-full relative transition-colors">
                                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-6">
                                <div>
                                    <p className="font-bold text-neutral-900 leading-tight">Daily Summary</p>
                                    <p className="text-sm text-neutral-500">Receive a daily email summary of operations</p>
                                </div>
                                <button className="w-11 h-6 bg-brand-500 rounded-full relative transition-colors">
                                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between pt-6">
                                <div>
                                    <p className="font-bold text-neutral-900 leading-tight">Revenue Milestones</p>
                                    <p className="text-sm text-neutral-500">Get notified when reaching revenue goals</p>
                                </div>
                                <button className="w-11 h-6 bg-neutral-200 rounded-full relative transition-colors shadow-inner">
                                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button className="px-6 py-2.5 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-all active:scale-95">Cancel</button>
                        <button className="px-8 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-brand-700 transition-all active:scale-95">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
