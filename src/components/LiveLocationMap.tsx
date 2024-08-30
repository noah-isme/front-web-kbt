import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GPXParser from "gpxparser";

type UserLocation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  progressIndex: number;
};

type GPXPoint = {
  lat: number;
  lon: number;
};

// Fungsi untuk membuat data sampel posisi user di sepanjang rute
const generateSampleData = (route: GPXPoint[]): UserLocation[] => {
  const distanceBetweenUsers = 100; // Distance in meters between users
  const usersCount = 10; // Number of users
  const users: UserLocation[] = [];

  for (let i = 0; i < usersCount; i++) {
    const progressIndex = i * Math.floor(distanceBetweenUsers / 10); // Rough estimate to space out users
    const point = route[progressIndex] || route[route.length - 1];

    users.push({
      id: i + 1,
      name: `User ${i + 1}`,
      latitude: point.lat,
      longitude: point.lon,
      color: `hsl(${(i * 360) / usersCount}, 100%, 50%)`,
      progressIndex: progressIndex,
    });
  }

  return users;
};

const LiveLocationSimulation: React.FC = () => {
  const [users, setUsers] = useState<UserLocation[]>([]);
  const [route, setRoute] = useState<GPXPoint[]>([]);

  // Fungsi untuk memuat dan memproses file GPX
  const loadGPXFile = (gpxData: string) => {
    const gpx = new GPXParser();
    gpx.parse(gpxData);
    const gpxPoints = gpx.tracks[0].points.map((point) => ({
      lat: point.lat,
      lon: point.lon,
    }));
    setRoute(gpxPoints);
  };

  // Simulasi pergerakan user mengikuti rute dari file GPX
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const nextIndex = Math.min(user.progressIndex + 1, route.length - 1);
          return {
            ...user,
            latitude: route[nextIndex]?.lat || user.latitude,
            longitude: route[nextIndex]?.lon || user.longitude,
            progressIndex: nextIndex,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [route]);

  // Load GPX file saat komponen dimuat
  useEffect(() => {
    // Misalnya file GPX disimpan di public folder
    fetch("/testingMap.gpx")
      .then((response) => response.text())
      .then((gpxData) => loadGPXFile(gpxData));
  }, []);

  useEffect(() => {
    if (route.length > 0) {
      setUsers(generateSampleData(route));
    }
  }, [route]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const nextIndex = Math.min(user.progressIndex + 1, route.length - 1);
          return {
            ...user,
            latitude: route[nextIndex]?.lat || user.latitude,
            longitude: route[nextIndex]?.lon || user.longitude,
            progressIndex: nextIndex,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [route]);

  return (
    <MapContainer center={[route[0]?.lat || 0, route[0]?.lon || 0]} zoom={14} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {route.length > 0 && (
        <Polyline positions={route.map((point) => [point.lat, point.lon])} color="blue" />
      )}
      {users.map((user) => (
        <Marker
          key={user.id}
          position={[user.latitude, user.longitude]}
          icon={L.divIcon({
            className: "custom-marker",
            html: `<span style="background-color:${user.color}; padding: 5px; border-radius: 50%;"></span>`,
          })}
        />
      ))}
    </MapContainer>
  );
};

export default LiveLocationSimulation;
