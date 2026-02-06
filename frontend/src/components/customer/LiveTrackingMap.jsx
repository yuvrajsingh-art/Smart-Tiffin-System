import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Icons
const customerIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="size-10 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-xl">home</span>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const riderIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="size-12 bg-white rounded-full border-4 border-primary shadow-2xl flex items-center justify-center animate-bounce">
            <span class="material-symbols-outlined text-primary text-2xl">two_wheeler</span>
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
});

// Component to handle map centering when coordinates change
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
};

const LiveTrackingMap = ({ eta, distance, deliveryPartner, orderStatus, mapData }) => {
    const isDispatching = orderStatus === 'out_for_delivery';
    const isDelivered = orderStatus === 'delivered';

    const customerPos = mapData?.customerLocation ? [mapData.customerLocation.lat, mapData.customerLocation.lng] : [19.0760, 72.8777];
    const riderPos = mapData?.deliveryLocation ? [mapData.deliveryLocation.lat, mapData.deliveryLocation.lng] : [19.0820, 72.8850];

    return (
        <div className="relative w-full h-full z-0 group animate-[fadeIn_0.5s_ease-out]">
            {/* Real Interactive Map */}
            <MapContainer
                center={isDispatching ? riderPos : customerPos}
                zoom={14}
                zoomControl={false}
                className="w-full h-full z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Map Helpers */}
                <MapUpdater center={isDispatching ? riderPos : customerPos} />

                {/* Markers */}
                <Marker position={customerPos} icon={customerIcon}>
                    <Popup>Your Location</Popup>
                </Marker>

                {!isDelivered && (
                    <Marker position={riderPos} icon={riderIcon}>
                        <Popup>
                            <div className="text-center font-black p-2">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400">Rider</p>
                                <p className="text-sm">{deliveryPartner.name}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default LiveTrackingMap;
