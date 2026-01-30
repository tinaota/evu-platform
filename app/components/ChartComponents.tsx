'use client';

import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Brand colors from Tailwind config
const COLORS = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    neutral: '#6B7280',
    brand: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-neutral-200">
                <p className="font-semibold text-sm mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
                        {entry.unit && <span className="text-neutral-500"> {entry.unit}</span>}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Energy Bar Chart Component
interface EnergyBarChartProps {
    data: Array<{ day: string; kwh: number; sessions?: number }>;
    height?: number;
}

export function EnergyBarChart({ data, height = 300 }: EnergyBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                    dataKey="day"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fill: '#6B7280', fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar
                    dataKey="kwh"
                    fill={COLORS.primary}
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

// Revenue Line Chart Component
interface RevenueLineChartProps {
    data: Array<{ date: string; revenue: number; sessions?: number }>;
    height?: number;
}

export function RevenueLineChart({ data, height = 300 }: RevenueLineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                    dataKey="date"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', style: { fill: '#6B7280', fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={800}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// Performance Bar Chart (Horizontal)
interface PerformanceBarChartProps {
    data: Array<{ name: string; sessions: number; revenue?: number }>;
    height?: number;
}

export function PerformanceBarChart({ data, height = 300 }: PerformanceBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                    type="number"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar
                    dataKey="sessions"
                    fill={COLORS.primary}
                    radius={[0, 8, 8, 0]}
                    animationDuration={800}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

// Sessions Pie Chart Component
interface SessionsPieChartProps {
    data: Array<{ name: string; value: number }>;
    height?: number;
}

export function SessionsPieChart({ data, height = 300 }: SessionsPieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.brand[index % COLORS.brand.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-neutral-700">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

// Multi-Line Chart for Trends
interface TrendLineChartProps {
    data: Array<{ time: string;[key: string]: any }>;
    lines: Array<{ dataKey: string; name: string; color: string }>;
    height?: number;
}

export function TrendLineChart({ data, lines, height = 300 }: TrendLineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                    dataKey="time"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="line"
                    formatter={(value) => <span className="text-sm text-neutral-700">{value}</span>}
                />
                {lines.map((line, index) => (
                    <Line
                        key={index}
                        type="monotone"
                        dataKey={line.dataKey}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={800}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}

// Stacked Bar Chart
interface StackedBarChartProps {
    data: Array<{ name: string;[key: string]: any }>;
    bars: Array<{ dataKey: string; name: string; color: string }>;
    height?: number;
}

export function StackedBarChart({ data, bars, height = 300 }: StackedBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="rect"
                    formatter={(value) => <span className="text-sm text-neutral-700">{value}</span>}
                />
                {bars.map((bar, index) => (
                    <Bar
                        key={index}
                        dataKey={bar.dataKey}
                        name={bar.name}
                        stackId="a"
                        fill={bar.color}
                        radius={index === bars.length - 1 ? [8, 8, 0, 0] : undefined}
                        animationDuration={800}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
