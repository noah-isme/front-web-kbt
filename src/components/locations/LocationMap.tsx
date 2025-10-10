import { useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { LiveLocation } from '../../types';
import dayjs from '../../utils/dayjs';
import EmptyState from '../common/EmptyState';

import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationMapProps {
  locations: LiveLocation[];
}

const LocationMap = ({ locations }: LocationMapProps) => {
  const center = useMemo(() => {
    if (locations.length === 0) {
      return null;
    }
    return {
      lat: locations[0].lat,
      lng: locations[0].lng,
    };
  }, [locations]);

  if (!center) {
    return <EmptyState message="No live locations available yet." />;
  }

  return (
    <MapContainer center={center} zoom={13} style={{ height: 400, width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker key={location.id} position={{ lat: location.lat, lng: location.lng }} icon={markerIcon}>
          <Popup>
            <strong>{location.label ?? 'Location'}</strong>
            <br />
            Updated {dayjs(location.updatedAt).fromNow()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocationMap;
