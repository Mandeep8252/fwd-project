import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, User, Search, Scan, Clock, Wallet, Menu, Bike, Navigation2, Battery } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Screen } from '../App';
import { Card } from './ui/card';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';

// Fix Leaflet default marker icon issue in Vite + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const nearbyBikes = [
  { id: 1, type: 'scooter', battery: 95, distance: 0.2, lat: 12.9719, lng: 77.5938 },
  { id: 2, type: 'bike', battery: 78, distance: 0.4, lat: 12.9721, lng: 77.5950 },
  { id: 3, type: 'scooter', battery: 88, distance: 0.6, lat: 12.9723, lng: 77.5945 },
  { id: 4, type: 'bike', battery: 92, distance: 0.8, lat: 12.9715, lng: 77.5940 },
];

// Component to move map programmatically
const MapMover = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  map.setView(position, 15);
  return null;
};

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mapPosition, setMapPosition] = useState<[number, number]>([12.9716, 77.5946]); // Default Bengaluru
  const provider = new OpenStreetMapProvider();

  const handleSearch = async () => {
    if (!searchValue) return;
    const results = await provider.search({ query: searchValue });
    if (results.length > 0) {
      const { x, y } = results[0]; // x = longitude, y = latitude
      setMapPosition([y, x]);
    } else {
      alert('Location not found!');
    }
  };

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-white px-6 py-4 shadow-sm z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#007BFF]" />
            <div>
              <p className="text-gray-500">Current Location</p>
              <p className="text-[#1E1E1E]">Cubbon Park, Bengaluru</p>
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
        <div className="relative flex">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for a location..."
            className="pl-10 h-12 rounded-2xl border-gray-200 flex-1"
          />
          <Button onClick={handleSearch} className="ml-2 h-12 px-4 rounded-2xl bg-[#007BFF] text-white">
            Go
          </Button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapPosition}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
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

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white rounded-t-3xl shadow-2xl px-6 py-6"
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#1E1E1E]">Nearby Vehicles</h3>
          <p className="text-gray-500">{nearbyBikes.length} available</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <Button
            onClick={() => onNavigate('scan')}
            className="h-auto py-4 flex flex-col gap-2 bg-gradient-to-br from-[#007BFF] to-[#0056b3] hover:from-[#0056b3] hover:to-[#003d82] rounded-2xl"
          >
            <Scan className="w-6 h-6" />
            <span className="text-xs">Scan</span>
          </Button>
          <Button
            onClick={() => onNavigate('history')}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 rounded-2xl border-2"
          >
            <Clock className="w-6 h-6 text-[#007BFF]" />
            <span className="text-xs text-[#1E1E1E]">Rides</span>
          </Button>
          <Button
            onClick={() => onNavigate('wallet')}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 rounded-2xl border-2"
          >
            <Wallet className="w-6 h-6 text-[#007BFF]" />
            <span className="text-xs text-[#1E1E1E]">Wallet</span>
          </Button>
          <Button
            onClick={() => setShowMenu(!showMenu)}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 rounded-2xl border-2"
          >
            <Menu className="w-6 h-6 text-[#007BFF]" />
            <span className="text-xs text-[#1E1E1E]">More</span>
          </Button>
        </div>

        {/* Menu Options */}
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 mb-4"
          >
            <Button
              onClick={() => onNavigate('support')}
              variant="ghost"
              className="w-full justify-start rounded-xl"
            >
              Support & Help
            </Button>
            <Button
              onClick={() => onNavigate('admin')}
              variant="ghost"
              className="w-full justify-start rounded-xl"
            >
              Admin Dashboard
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
