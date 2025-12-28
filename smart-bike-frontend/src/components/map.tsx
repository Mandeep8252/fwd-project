import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface BikeData {
  id: number;
  type: 'scooter' | 'bike';
  battery: number;
  distance: number;
  lat: number;
  lng: number;
}

const DynamicMap: React.FC = () => {
  const [mapPosition, setMapPosition] = useState<[number, number]>([12.9716, 77.5946]);
  const [bikes, setBikes] = useState<BikeData[]>([]);

  // Fetch nearby bikes from backend
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await axios.get('https://smart-bike-backend.onrender.com/api/bikes', {
          withCredentials: true, // include cookies if backend uses session
        });
        setBikes(res.data);
      } catch (err) {
        console.error('Failed to fetch bikes', err);
      }
    };

    fetchBikes();
  }, []);

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapPosition([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn('Geolocation denied, using default location')
      );
    }
  }, []);

  return (
    <div className="w-full h-[60vh] md:h-[80vh] lg:h-[90vh]">
      <MapContainer
        center={mapPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User position */}
        <Marker position={mapPosition}>
          <Popup>Your location</Popup>
        </Marker>

        {/* Nearby bikes */}
        {bikes.map((bike) => (
          <Marker key={bike.id} position={[bike.lat, bike.lng]}>
            <Popup>
              {bike.type === 'scooter' ? 'E-Scooter' : 'E-Bike'} #{bike.id} <br />
              Battery: {bike.battery}% <br />
              Distance: {bike.distance} mi
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DynamicMap;
