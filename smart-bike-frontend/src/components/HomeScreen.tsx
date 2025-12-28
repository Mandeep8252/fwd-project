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

// Fix Leaflet default marker icon
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

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const MapMover = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  map.setView(position, 15);
  return null;
};

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mapPosition, setMapPosition] = useState<[number, number]>([12.9716, 77.5946]);
  const provider = useMemo(() => new OpenStreetMapProvider(), []);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [nearbyBikes, setNearbyBikes] = useState<BikeData[]>([]);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapPosition([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn('Geolocation permission denied, using default location')
      );
    }
  }, []);

  // Fetch nearby bikes from backend
  useEffect(() => {
    const fetchNearbyBikes = async () => {
      try {
        const res = await axios.get('https://smart-bike-backend.onrender.com/api/bikes', {
          withCredentials: true,
        });
        setNearbyBikes(res.data);
      } catch (err) {
        console.error('Failed to fetch nearby bikes:', err);
      }
    };
    fetchNearbyBikes();
  }, []);

  const handleSearch = async () => {
    if (!searchValue) return;
    try {
      const results = await provider.search({ query: searchValue });
      if (results.length > 0) {
        const { x, y } = results[0];
        setMapPosition([y, x]);
      } else {
        alert('Location not found!');
      }
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-[#007BFF]" />
          <div>
            <p className="text-gray-500 text-sm">Current Location</p>
            <p className="text-[#1E1E1E] font-medium">
              {user ? `Hello, ${user.name}` : 'Cubbon Park, Bengaluru'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('profile')}
          className="rounded-full w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#0056b3]"
        >
          <User className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex px-6 py-4 gap-2 bg-gray-50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for a location..."
            className="pl-10 h-12 rounded-2xl border-gray-300 w-full"
          />
        </div>
        <Button onClick={handleSearch} className="h-12 px-4 rounded-2xl bg-[#007BFF] text-white">
          Go
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row h-full">
        {/* Map */}
        <div className="flex-1 h-[60vh] md:h-[calc(100vh-16)]">
          <MapContainer center={mapPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapMover position={mapPosition} />
            {nearbyBikes.map((bike) => (
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

        {/* Quick Actions / Nearby Vehicles */}
        <div className="bg-white md:w-80 p-6 space-y-4 overflow-auto h-[60vh] md:h-[calc(100vh-16)]">
          <h3 className="text-[#1E1E1E] text-lg font-semibold">Nearby Vehicles</h3>
          <p className="text-gray-500 text-sm">{nearbyBikes.length} available</p>

          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={() => onNavigate('scan')}
              className="flex flex-col items-center gap-2 py-3 bg-gradient-to-br from-[#007BFF] to-[#0056b3] rounded-2xl"
            >
              <Scan className="w-6 h-6" />
              <span className="text-xs">Scan</span>
            </Button>
            <Button
              onClick={() => onNavigate('history')}
              variant="outline"
              className="flex flex-col items-center gap-2 py-3 rounded-2xl border-2"
            >
              <Clock className="w-6 h-6 text-[#007BFF]" />
              <span className="text-xs text-[#1E1E1E]">Rides</span>
            </Button>
            <Button
              onClick={() => onNavigate('wallet')}
              variant="outline"
              className="flex flex-col items-center gap-2 py-3 rounded-2xl border-2"
            >
              <Wallet className="w-6 h-6 text-[#007BFF]" />
              <span className="text-xs text-[#1E1E1E]">Wallet</span>
            </Button>
            <Button
              onClick={() => setShowMenu(!showMenu)}
              variant="outline"
              className="flex flex-col items-center gap-2 py-3 rounded-2xl border-2"
            >
              <Menu className="w-6 h-6 text-[#007BFF]" />
              <span className="text-xs text-[#1E1E1E]">More</span>
            </Button>
          </div>

          {showMenu && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 mt-4">
              <Button onClick={() => onNavigate('support')} variant="ghost" className="w-full justify-start rounded-xl">
                Support & Help
              </Button>
              {user?.role === 'admin' && (
                <Button onClick={() => onNavigate('admin')} variant="ghost" className="w-full justify-start rounded-xl">
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
