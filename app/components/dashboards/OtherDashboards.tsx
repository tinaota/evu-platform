'use client';

import { RevenueLineChart, EnergyBarChart, StackedBarChart, TrendLineChart } from '../ChartComponents';
import { TrendingUp } from 'lucide-react';

// Revenue Dashboard with interactive charts
export function Revenue() {
    const revenueData = [
        { date: 'Jan 22', revenue: 1450 },
        { date: 'Jan 23', revenue: 1680 },
        { date: 'Jan 24', revenue: 1520 },
        { date: 'Jan 25', revenue: 1890 },
        { date: 'Jan 26', revenue: 1750 },
        { date: 'Jan 27', revenue: 2100 },
        { date: 'Jan 28', revenue: 1920 },
    ];

    const revenueByStationData = [
        { name: 'Congress Center', sessions: 342, revenue: 8450 },
        { name: 'Public Market', sessions: 298, revenue: 7200 },
        { name: 'Downtown Plaza', sessions: 256, revenue: 6800 },
        { name: 'East Side Hub', sessions: 201, revenue: 5100 },
        { name: 'Lakefront', sessions: 187, revenue: 4650 },
    ];

    return (
        <div className="dashboard-view">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                    { label: 'Total Revenue (MTD)', value: '$47,892', trend: '+18%' },
                    { label: 'Total Transactions', value: '2,847', trend: '+24%' },
                    { label: 'Avg. Transaction Value', value: '$16.82', trend: '+9%' },
                    { label: 'Profit Margin', value: '32%', trend: '+5%' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-neutral-200 card-hover">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-neutral-500 text-sm">{stat.label}</p>
                        <span className="text-success-600 text-sm font-medium">{stat.trend}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 7 Days)</h3>
                    <RevenueLineChart data={revenueData} height={300} />
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-5">
                    <h3 className="text-lg font-semibold mb-4">Revenue by Station</h3>
                    <EnergyBarChart
                        data={revenueByStationData.map(d => ({ day: d.name.split(' ')[0], kwh: d.revenue }))}
                        height={300}
                    />
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
