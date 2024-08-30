import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

interface Location {
    user_id: number;
    latitude: number;
    longitude: number;
}

interface EventRouteMapProps {
    locations: Location[];
}

// Example random route (polyline) for event simulation
const eventRoute: LatLngExpression[] = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.52, -0.12],
    [51.53, -0.13],
];

const EventRouteMap: React.FC<EventRouteMapProps> = ({ locations }) => {
    // Pastikan locations tidak null atau undefined
    if (!locations || locations.length === 0) {
        return <p>Loading map...</p>;
    }
    
    const center: LatLngExpression = eventRoute[0];

    return (
        <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={eventRoute} color="blue" />
            {locations.map((loc) => (
                <Marker key={loc.user_id} position={[loc.latitude, loc.longitude] as LatLngExpression}>
                    <Popup>User {loc.user_id}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default EventRouteMap;
