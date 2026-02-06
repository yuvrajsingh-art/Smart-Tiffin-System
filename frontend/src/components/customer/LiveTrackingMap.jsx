import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ... (Customer/Rider Icons remain same) ...
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


const MapUpdater = ({ customerPos, riderPos, providerPos }) => {
    const map = useMap();
    useEffect(() => {
        if (!customerPos) return;
        const bounds = L.latLngBounds([customerPos]);
        if (riderPos) bounds.extend(riderPos);
        if (providerPos) bounds.extend(providerPos);
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
    }, [customerPos, riderPos, providerPos, map]);
    return null;
};

const LiveTrackingMap = ({ eta, distance, deliveryPartner, orderStatus, mapData }) => {
    const isDispatching = orderStatus === 'out_for_delivery';
    const isDelivered = orderStatus === 'delivered';
    const isCooking = ['confirmed', 'cooking', 'prepared'].includes(orderStatus);

    // Initial fallback position (Mumbai)
    const [realTimePos, setRealTimePos] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setRealTimePos([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error fetching location", error);
                }
            );
        }
    }, []);

    const customerPos = realTimePos || (mapData?.customerLocation ? [mapData.customerLocation.lat, mapData.customerLocation.lng] : [19.0760, 72.8777]);
    const riderPos = mapData?.deliveryLocation ? [mapData.deliveryLocation.lat, mapData.deliveryLocation.lng] : null; // Rider only if active
    const providerPos = mapData?.providerLocation ? [mapData.providerLocation.lat, mapData.providerLocation.lng] : [19.0820, 72.8850]; // Provider Kitchen

    const [routePath, setRoutePath] = React.useState([]);

    // PROVIDER ICON (Kitchen)
    const providerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="size-10 bg-orange-100 rounded-full border-2 border-primary shadow-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-xl">restaurant</span>
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    // Fetch Route from OSRM
    useEffect(() => {
        const fetchRoute = async () => {
            if (!providerPos || !customerPos) return;

            // Determine Start & End points based on status
            const start = isDispatching && riderPos ? riderPos : providerPos;
            const end = customerPos;

            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                if (data.routes && data.routes.length > 0) {
                    const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setRoutePath(coordinates);
                }
            } catch (error) {
                console.error("Error fetching OSRM route:", error);
                // Fallback to straight line
                setRoutePath([start, end]);
            }
        };

        fetchRoute();
    }, [isDispatching, riderPos, providerPos, customerPos]);

    return (
        <div className="relative w-full h-full z-0 group animate-[fadeIn_0.5s_ease-out]">
            <MapContainer
                center={customerPos}
                zoom={14}
                zoomControl={false}
                className="w-full h-full z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapUpdater customerPos={customerPos} riderPos={isDispatching ? riderPos : null} providerPos={providerPos} />

                {/* Route Line (Real Road Path) */}
                {!isDelivered && routePath.length > 0 && (
                    <Polyline
                        positions={routePath}
                        pathOptions={{ color: '#F97316', weight: 5, opacity: 0.9, lineCap: 'round' }}
                    />
                )}

                {/* Markers */}
                <Marker position={customerPos} icon={customerIcon}>
                    <Popup className="font-bold">Your Live Location</Popup>
                </Marker>

                <Marker position={providerPos} icon={providerIcon}>
                    <Popup className="font-bold">Kitchen (Provider)</Popup>
                </Marker>

                {isDispatching && riderPos && (
                    <Marker position={riderPos} icon={riderIcon}>
                        <Popup>
                            <div className="text-center font-black p-1">
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
