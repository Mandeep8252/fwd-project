import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Bike,
  Navigation2,
  Filter,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import axios from 'axios';

interface RidesHistoryScreenProps {
  onBack: () => void;
}

interface Ride {
  _id: string;
  type: 'bike' | 'scooter';
  from: string;
  to: string;
  distance: number;
  duration: number; // seconds
  fare: number;
  createdAt: string;
}

export function RidesHistoryScreen({ onBack }: RidesHistoryScreenProps) {
  const [filter, setFilter] = useState<'all' | 'bike' | 'scooter'>('all');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/rides';

  // =====================
  // Fetch Ride History
  // =====================
  const fetchRides = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/my`, {
        headers: { 'x-auth-token': token },
      });
      setRides(res.data);
    } catch (err) {
      console.error('Failed to fetch rides', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(); // initial fetch

    // =====================
    // Polling every 5 seconds
    // =====================
    const interval = setInterval(fetchRides, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  // =====================
  // Filters & Stats
  // =====================
  const filteredRides =
    filter === 'all' ? rides : rides.filter((r) => r.type === filter);

  const totalRides = rides.length;
  const totalDistance = rides.reduce((sum, r) => sum + r.distance, 0);
  const totalSpent = rides.reduce((sum, r) => sum + r.fare, 0);

  return (
    <div className="relative w-full h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white text-lg font-semibold">My Rides</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/20"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-center">
            <p className="text-white/80 mb-1">Rides</p>
            <p className="text-white text-2xl font-semibold">{totalRides}</p>
          </Card>
          <Card className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-center">
            <p className="text-white/80 mb-1">Km</p>
            <p className="text-white text-2xl font-semibold">
              {totalDistance.toFixed(1)}
            </p>
          </Card>
          <Card className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-center">
            <p className="text-white/80 mb-1">Spent</p>
            <p className="text-white text-2xl font-semibold">
              ₹{totalSpent.toFixed(0)}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4 -mt-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bike">Bikes</TabsTrigger>
            <TabsTrigger value="scooter">Scooters</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Ride List */}
      <div className="flex-1 px-6 overflow-auto pb-6">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading rides...</p>
        ) : filteredRides.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No rides found 🚲</p>
        ) : (
          <div className="space-y-3">
            {filteredRides.map((ride, index) => {
              const date = new Date(ride.createdAt);
              return (
                <motion.div
                  key={ride._id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 rounded-2xl border-2">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#007BFF]/10 flex items-center justify-center">
                        {ride.type === 'scooter' ? (
                          <Navigation2 className="text-[#007BFF]" />
                        ) : (
                          <Bike className="text-[#007BFF]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <p className="font-medium">
                            {ride.type === 'scooter' ? 'E-Scooter' : 'E-Bike'} Ride
                          </p>
                          <p className="text-[#007BFF] font-semibold">₹{ride.fare}</p>
                        </div>

                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {date.toLocaleDateString()} •{' '}
                          {date.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>

                        <div className="mt-2 text-sm">
                          {ride.from} → {ride.to}
                        </div>

                        <div className="flex gap-4 text-sm mt-2 text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.round(ride.duration / 60)} min
                          </span>
                          <span>{ride.distance} km</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
