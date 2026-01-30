'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Fix for default Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Station {
    id: number;
    name: string;
    status: 'Available' | 'In Use' | 'Warning' | 'Offline';
    count: number;
    address: string;
    distance: string;
    color: 'success' | 'brand' | 'warning' | 'danger';
    position: [number, number];
    chargers: number;
    power: string;
    price: string;
    lastUpdate: string;
}

interface MapComponentProps {
    stations: Station[];
    selectedStation: Station | null;
    onStationClick: (station: Station) => void;
}

// Component to handle map view updates
function MapUpdater({ selectedStation }: { selectedStation: Station | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedStation) {
            map.setView(selectedStation.position, 15, {
                animate: true,
                duration: 1
            });
        }
    }, [selectedStation, map]);

    return null;
}

export default function MapComponent({ stations, selectedStation, onStationClick }: MapComponentProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const center: [number, number] = [43.0389, -87.9065]; // Milwaukee center

    const getMarkerColor = (color: string) => {
        switch (color) {
            case 'success': return '#10b981';
            case 'brand': return '#0A7FD4';
            case 'warning': return '#f59e0b';
            case 'danger': return '#ef4444';
            default: return '#0A7FD4';
        }
    };

    const createCustomIcon = (station: Station, isSelected: boolean) => {
        const color = getMarkerColor(station.color);
        const size = isSelected ? 40 : 32;

        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    width: ${size}px;
                    height: ${size}px;
                    background-color: ${color};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: ${size / 2.5}px;
                    transition: all 0.2s;
                    ${station.color === 'danger' ? 'animation: pulse 2s infinite;' : ''}
                ">
                    ${station.count}
                </div>
                <style>
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                        70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                    }
                </style>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
        });
    };

    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />
            <MapUpdater selectedStation={selectedStation} />

            {stations.map((station) => (
                <Marker
                    key={station.id}
                    position={station.position}
                    icon={createCustomIcon(station, selectedStation?.id === station.id)}
                    eventHandlers={{
                        click: () => onStationClick(station),
                    }}
                >
                    <Popup>
                        <div className="font-sans">
                            <h4 className="font-bold">{station.name}</h4>
                            <p className="text-sm text-neutral-600">{station.address}</p>
                            <p className="text-sm font-medium mt-1">{station.count} Chargers {station.status}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
