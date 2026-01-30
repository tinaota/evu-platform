'use client';

import { RevenueLineChart, EnergyBarChart, StackedBarChart, TrendLineChart } from '../ChartComponents';
import { TrendingUp, DollarSign, Receipt, User, Percent, ArrowUpRight, ChevronRight } from 'lucide-react';
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

export function Reports() {
    return (
        <div className="dashboard-view">
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Reports</h3>
                <p className="text-neutral-500">Generate and download reports</p>
            </div>
        </div>
    );
}

export function Diagnostics() {
    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-danger-50 border border-danger-200 rounded-xl p-5">
                    <p className="font-semibold text-danger-800">Critical Issues</p>
                    <p className="text-3xl font-bold text-danger-700 mt-2">3</p>
                    <p className="text-sm text-danger-600">Requires immediate attention</p>
                </div>
                <div className="bg-warning-50 border border-warning-200 rounded-xl p-5">
                    <p className="font-semibold text-warning-800">Warnings</p>
                    <p className="text-3xl font-bold text-warning-700 mt-2">8</p>
                    <p className="text-sm text-warning-600">Monitor closely</p>
                </div>
                <div className="bg-success-50 border border-success-200 rounded-xl p-5">
                    <p className="font-semibold text-success-800">Healthy</p>
                    <p className="text-3xl font-bold text-success-700 mt-2">37</p>
                    <p className="text-sm text-success-600">Operating normally</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">System Diagnostics</h3>
                <p className="text-neutral-500">System health and troubleshooting</p>
            </div>
        </div>
    );
}

export function Alerts() {
    return (
        <div className="dashboard-view">
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Alerts</h3>
                <p className="text-neutral-500">System notifications and warnings</p>
            </div>
        </div>
    );
}

export function Users() {
    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                    { label: 'Total Users', value: '1,247' },
                    { label: 'Active Today', value: '89' },
                    { label: 'Operators', value: '12' },
                    { label: 'Technicians', value: '8' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-neutral-200">
                        <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-neutral-500">Manage platform users and roles</p>
            </div>
        </div>
    );
}

export function Settings() {
    return (
        <div className="dashboard-view">
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Settings</h3>
                <p className="text-neutral-500">Platform configuration</p>
            </div>
        </div>
    );
}
