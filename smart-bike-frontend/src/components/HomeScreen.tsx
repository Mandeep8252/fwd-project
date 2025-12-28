import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, User, Search, Scan, Clock, Wallet, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Screen } from '../App';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import axios from 'axios';

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// =====================
// TYPES
// =====================
interface BikeData {
  id: number;
  type: 'scooter' | 'bike';
  battery: number;
  distance: number;
  lat: number;
  lng: number;
}

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

// =====================
// MAP VIEW CONTROLLER
// =====================
const MapMover = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);
  return null;
};

// =====================
// HOME SCREEN
// =====================
export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mapPosition, setMapPosition] = useState<[number, number]>([12.9716, 77.5946]);
  const provider = useMemo(() => new OpenStreetMapProvider(), []);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [nearbyBikes, setNearbyBikes] = useState<BikeData[]>([]);
  const [loadingBikes, setLoadingBikes] = useState(true);

  // =====================
  // LOAD USER
  // =====================
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // =====================
  // GEOLOCATION
  // =====================
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setMapPosition([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn('Geolocation denied, using default location')
    );
  }, []);

  // =====================
  // FETCH BIKES
  // =====================
  useEffect(() => {
    const fetchNearbyBikes = async () => {
      try {
        const res = await axios.get(
          'https://smart-bike-backend.onrender.com/api/bikes',
          { withCredentials: true }
        );

        setNearbyBikes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch bikes:', err);
        setNearbyBikes([]);
      } finally {
        setLoadingBikes(false);
      }
    };

    fetchNearbyBikes();
  }, []);

  // =====================
  // SEARCH HANDLER
  // =====================
  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    try {
      const results = await provider.search({ query: searchValue });
      if (results.length > 0) {
        setMapPosition([results[0].y, results[0].x]);
      } else {
        alert('Location not found');
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  // =====================
  // RENDER
  // =====================
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* TOP BAR */}
      <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-[#007BFF]" />
          <div>
            <p className="text-gray-500 text-sm">Current Location</p>
            <p className="font-medium">
              {user ? `Hello, ${user.name}` : 'Bengaluru'}
            </p>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => onNavigate('profile')}
          className="rounded-full bg-gradient-to-br from-[#007BFF] to-[#0056b3]"
        >
          <User className="text-white" />
        </Button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-2 px-6 py-4 bg-gray-50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search location"
            className="pl-10 h-12 rounded-2xl"
          />
        </div>
        <Button onClick={handleSearch} className="h-12 rounded-2xl bg-[#007BFF]">
          Go
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* MAP */}
        <div className="flex-1 h-[60vh] md:h-full">
          <MapContainer center={mapPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapMover position={mapPosition} />

            {Array.isArray(nearbyBikes) &&
              nearbyBikes
                .filter(b => b.lat && b.lng)
                .map((bike) => (
                  <Marker key={bike.id} position={[bike.lat, bike.lng]}>
                    <Popup>
                      {bike.type === 'scooter' ? 'E-Scooter' : 'E-Bike'} #{bike.id}<br />
                      Battery: {bike.battery}%<br />
                      Distance: {bike.distance} km
                    </Popup>
                  </Marker>
                ))}
          </MapContainer>
        </div>

        {/* SIDE PANEL */}
        <div className="bg-white md:w-80 p-6 space-y-4 overflow-auto">
          <h3 className="text-lg font-semibold">Nearby Vehicles</h3>

          {loadingBikes ? (
            <p className="text-gray-500">Loading vehicles...</p>
          ) : (
            <p className="text-gray-500">{nearbyBikes.length} available</p>
          )}

          <div className="grid grid-cols-4 gap-3">
            <Button onClick={() => onNavigate('scan')} className="flex flex-col gap-2 py-3 rounded-2xl bg-[#007BFF]">
              <Scan />
              <span className="text-xs">Scan</span>
            </Button>

            <Button onClick={() => onNavigate('history')} variant="outline" className="flex flex-col gap-2 py-3 rounded-2xl">
              <Clock className="text-[#007BFF]" />
              <span className="text-xs">Rides</span>
            </Button>

            <Button onClick={() => onNavigate('wallet')} variant="outline" className="flex flex-col gap-2 py-3 rounded-2xl">
              <Wallet className="text-[#007BFF]" />
              <span className="text-xs">Wallet</span>
            </Button>

            <Button onClick={() => setShowMenu(!showMenu)} variant="outline" className="flex flex-col gap-2 py-3 rounded-2xl">
              <Menu className="text-[#007BFF]" />
              <span className="text-xs">More</span>
            </Button>
          </div>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <Button onClick={() => onNavigate('support')} variant="ghost" className="w-full justify-start">
                Support & Help
              </Button>

              {user?.role === 'admin' && (
                <Button onClick={() => onNavigate('admin')} variant="ghost" className="w-full justify-start">
                  Admin Dashboard
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
