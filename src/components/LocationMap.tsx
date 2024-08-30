import React, { useState, useEffect, useRef } from 'react';
import { getLiveLocations, updateLocation } from '../api/LocationService';
import UserLocation from './UserLocation';
import EventRouteMap from './EventRouteMap';

const eventId = 1;

interface Location {
    user_id: number;
    event_id: number;
    latitude: number;
    longitude: number;
}

const LocationMap: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:9090/ws');

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.current.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };

        ws.current.onmessage = (event) => {
            const location: Location = JSON.parse(event.data);
            setLocations((prevLocations) =>
                prevLocations.map((loc) =>
                    loc.user_id === location.user_id ? location : loc
                )
            );
        };

        getLiveLocations(eventId).then((response) => {
            setLocations(response.data);
        });

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    // Simulasi pergerakan pengguna
    useEffect(() => {
        const intervalId = setInterval(() => {
            setLocations((prevLocations) => {
                return prevLocations.map((loc) => {
                    const newLocation = {
                        ...loc,
                        latitude: loc.latitude + (Math.random() - 0.001) * 0.02,
                        longitude: loc.longitude + (Math.random() - 0.001) * 0.02,
                    };
                    updateLocation(newLocation);
                    return newLocation;
                });
            });
        }, 3000); // Update setiap 3 detik

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h2>Live Location Map</h2>
            <EventRouteMap locations={locations} />
        </div>
    );
};

export default LocationMap;
