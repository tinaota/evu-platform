'use client';

import { Building2, CheckCircle, XCircle, PlugZap, Search, Plus, Eye, Edit, MoreVertical, Wrench, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useStations } from '@/lib/hooks/useStations';
import type { Station } from '@/lib/types';
import StationModal from '@/app/components/modals/StationModal';

const PAGE_SIZE = 10;

export default function Stations() {
    const { stations, loading } = useStations();
    const [filterStatus, setFilterStatus] = useState<'All' | 'Online' | 'Offline'>('All');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState<{ mode: 'add' | 'view' | 'edit'; station?: Station } | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return stations.filter(s => {
            const matchesStatus =
                filterStatus === 'All' ? true :
                filterStatus === 'Online' ? s.status !== 'Offline' :
                s.status === 'Offline';
            const matchesSearch =
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.address.toLowerCase().includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [stations, filterStatus, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const total = stations.length;
    const online = stations.filter(s => s.status !== 'Offline').length;
    const offline = stations.filter(s => s.status === 'Offline').length;
    const totalChargers = stations.reduce((acc, s) => acc + s.chargers, 0);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this station? This cannot be undone.')) return;
        setDeleting(id);
        await fetch(`/api/stations/${id}`, { method: 'DELETE' });
        setDeleting(null);
        setMenuOpen(null);
    };

    const handleFilterClick = (f: 'All' | 'Online' | 'Offline') => {
        setFilterStatus(f);
        setPage(0);
    };

    const handleSearchChange = (v: string) => {
        setSearch(v);
        setPage(0);
    };

    return (
        <div className="dashboard-view">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl sm:text-2xl font-bold">{loading ? '—' : total}</p>
                            <p className="text-xs sm:text-sm text-neutral-500">Total Stations</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-success-50 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl sm:text-2xl font-bold">{loading ? '—' : online}</p>
                            <p className="text-xs sm:text-sm text-neutral-500">Online</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-danger-50 flex items-center justify-center shrink-0">
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-danger-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl sm:text-2xl font-bold">{loading ? '—' : offline}</p>
                            <p className="text-xs sm:text-sm text-neutral-500">Offline</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                            <PlugZap className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl sm:text-2xl font-bold">{loading ? '—' : totalChargers}</p>
                            <p className="text-xs sm:text-sm text-neutral-500">Chargers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-neutral-200">
                <div className="p-3 sm:p-4 border-b border-neutral-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <h3 className="font-semibold">All Stations</h3>
                            <div className="filter-scroll flex items-center gap-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                                {(['All', 'Online', 'Offline'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => handleFilterClick(f)}
                                        className={`px-3 py-1.5 text-sm rounded-lg font-medium whitespace-nowrap transition-colors ${filterStatus === f
                                            ? f === 'Offline' ? 'bg-danger-50 text-danger-600' : 'bg-brand-50 text-brand-600'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full sm:w-48 lg:w-64 bg-neutral-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <button
                                onClick={() => setModal({ mode: 'add' })}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium shrink-0 tap-target hover:bg-brand-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add Station</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto table-responsive">
                    <table className="w-full">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Station</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Address</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Chargers</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Status</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Power</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Price</th>
                                <th className="text-left text-sm font-medium text-neutral-500 px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-neutral-400 text-sm">Loading stations…</td>
                                </tr>
                            )}
                            {!loading && pageItems.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-neutral-400 text-sm">No stations found</td>
                                </tr>
                            )}
                            {pageItems.map((station) => {
                                const isOffline = station.status === 'Offline';
                                return (
                                    <tr key={station.id} className={`hover:bg-neutral-50 ${isOffline ? 'bg-danger-50/30' : ''}`}>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg ${isOffline ? 'bg-danger-100' : 'bg-brand-100'} flex items-center justify-center shrink-0`}>
                                                    <Building2 className={`w-5 h-5 ${isOffline ? 'text-danger-600' : 'text-brand-600'}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{station.name}</p>
                                                    <p className="text-xs text-neutral-500 font-mono">{station.id.slice(0, 8)}…</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-neutral-600 max-w-[200px] truncate">{station.address}</td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm">
                                                <span className="font-medium">{station.chargers}</span>
                                                <span className="text-neutral-500 ml-1">
                                                    ({isOffline ? 'offline' : `${station.available_chargers} avail`})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                station.status === 'Available' ? 'bg-success-100 text-success-700' :
                                                station.status === 'In Use' ? 'bg-brand-100 text-brand-700' :
                                                station.status === 'Warning' ? 'bg-warning-100 text-warning-700' :
                                                'bg-danger-100 text-danger-700'
                                            }`}>
                                                {station.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-neutral-700">{station.power}</td>
                                        <td className="px-4 py-4 text-sm text-neutral-700">{station.price}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1 relative">
                                                <button
                                                    onClick={() => setModal({ mode: 'view', station })}
                                                    className="p-2 hover:bg-neutral-100 rounded-lg"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4 text-neutral-500" />
                                                </button>
                                                <button
                                                    onClick={() => setModal({ mode: 'edit', station })}
                                                    className="p-2 hover:bg-neutral-100 rounded-lg"
                                                    title="Edit"
                                                >
                                                    {isOffline ? (
                                                        <Wrench className="w-4 h-4 text-danger-500" />
                                                    ) : (
                                                        <Edit className="w-4 h-4 text-neutral-500" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setMenuOpen(menuOpen === station.id ? null : station.id)}
                                                    className="p-2 hover:bg-neutral-100 rounded-lg"
                                                    title="More"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-neutral-500" />
                                                </button>
                                                {menuOpen === station.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-neutral-200 z-10">
                                                        <button
                                                            onClick={() => handleDelete(station.id)}
                                                            disabled={deleting === station.id}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            {deleting === station.id ? 'Deleting…' : 'Delete'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-3 sm:p-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-neutral-500">
                        Showing {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} stations
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-2 sm:px-3 py-1.5 border border-neutral-200 rounded-lg text-xs sm:text-sm hover:bg-neutral-50 disabled:opacity-40"
                        >
                            Prev
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const pageNum = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm ${page === pageNum ? 'bg-brand-500 text-white' : 'border border-neutral-200 hover:bg-neutral-50'}`}
                                >
                                    {pageNum + 1}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="px-2 sm:px-3 py-1.5 border border-neutral-200 rounded-lg text-xs sm:text-sm hover:bg-neutral-50 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {modal && (
                <StationModal
                    mode={modal.mode}
                    station={modal.station}
                    onClose={() => setModal(null)}
                    onSuccess={() => setModal(null)}
                />
            )}
        </div>
    );
}
