'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/dashboards/Overview';
import LiveMap from './components/dashboards/LiveMap';
import Stations from './components/dashboards/Stations';
import Chargers from './components/dashboards/Chargers';
import Sessions from './components/dashboards/Sessions';
import { Revenue, Energy, Reports, Diagnostics, Alerts, Users, Settings } from './components/dashboards/OtherDashboards';

export default function Home() {
    const [currentRole, setCurrentRole] = useState('operator');
    const [currentView, setCurrentView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const titles: Record<string, [string, string]> = {
        'overview': ['Operations Overview', 'Real-time monitoring and management'],
        'map': ['Live Map', 'Geographic station view'],
        'stations': ['Stations', 'Manage charging stations'],
        'chargers': ['Chargers', 'Individual charger management'],
        'sessions': ['Sessions', 'Active and historical sessions'],
        'revenue': ['Revenue Analytics', 'Financial performance and insights'],
        'energy': ['Energy Consumption', 'Power usage analytics'],
        'reports': ['Reports', 'Generate and download reports'],
        'diagnostics': ['Diagnostics', 'System health and troubleshooting'],
        'alerts': ['Alerts', 'System notifications and warnings'],
        'users': ['User Management', 'Manage platform users and roles'],
        'settings': ['Settings', 'Platform configuration']
    };

    const handleRoleChange = (role: string) => {
        setCurrentRole(role);
        // Switch to appropriate default dashboard
        if (role === 'owner') {
            setCurrentView('revenue');
        } else if (role === 'technician') {
            setCurrentView('diagnostics');
        } else if (role === 'admin') {
            setCurrentView('users');
        } else {
            setCurrentView('overview');
        }
    };

    const handleNavigate = (view: string) => {
        setCurrentView(view);
        // Close sidebar on mobile after navigation
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setSidebarOpen(false);
            document.body.classList.remove('overflow-hidden');
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        if (typeof window !== 'undefined') {
            document.body.classList.toggle('overflow-hidden');
        }
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        if (typeof window !== 'undefined') {
            document.body.classList.remove('overflow-hidden');
        }
    };

    const renderDashboard = () => {
        switch (currentView) {
            case 'overview': return <Overview />;
            case 'map': return <LiveMap />;
            case 'stations': return <Stations />;
            case 'chargers': return <Chargers />;
            case 'sessions': return <Sessions />;
            case 'revenue': return <Revenue />;
            case 'energy': return <Energy />;
            case 'reports': return <Reports />;
            case 'diagnostics': return <Diagnostics />;
            case 'alerts': return <Alerts />;
            case 'users': return <Users />;
            case 'settings': return <Settings />;
            default: return <Overview />;
        }
    };

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            <div
                id="sidebar-overlay"
                className={sidebarOpen ? 'active' : ''}
                onClick={closeSidebar}
            ></div>

            <div id="app" className="flex h-screen overflow-hidden">
                <Sidebar
                    currentRole={currentRole}
                    onRoleChange={handleRoleChange}
                    onNavigate={handleNavigate}
                    currentView={currentView}
                    onClose={closeSidebar}
                    isOpen={sidebarOpen}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header
                        onMenuToggle={toggleSidebar}
                        pageTitle={titles[currentView]?.[0] || 'Dashboard'}
                        pageSubtitle={titles[currentView]?.[1] || ''}
                    />

                    {/* Dashboard Content */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6" id="mainContent">
                        {renderDashboard()}
                    </main>
                </div>
            </div>
        </>
    );
}
