import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Clock, Bike, Navigation2, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface RidesHistoryScreenProps {
  onBack: () => void;
}

// Updated rides with realistic Bengaluru distances and recalculated fares
const rides = [
  {
    id: 1,
    type: 'scooter',
    date: '2025-11-04',
    time: '14:30',
    duration: '25m 0s', // Koramangala → Indiranagar ~6 km
    distance: 6.0, 
    fare: 5 + 25 * 2.5, // ₹67.5
    from: 'Koramangala',
    to: 'Indiranagar'
  },
  {
    id: 2,
    type: 'bike',
    date: '2025-11-02',
    time: '18:45',
    duration: '60m 0s', // MG Road → Whitefield ~19 km
    distance: 19.0, 
    fare: 5 + 60 * 2.5, // ₹155
    from: 'MG Road',
    to: 'Whitefield'
  },
  {
    id: 3,
    type: 'scooter',
    date: '2025-11-01',
    time: '09:20',
    duration: '15m 0s', // HSR → BTM ~4.2 km
    distance: 4.2,
    fare: 5 + 15 * 2.5, // ₹42.5
    from: 'HSR Layout',
    to: 'BTM Layout'
  },
  {
    id: 4,
    type: 'bike',
    date: '2025-10-30',
    time: '16:00',
    duration: '12m 0s', // Jayanagar → JP Nagar ~3.5 km
    distance: 3.5,
    fare: 5 + 12 * 2.5, // ₹35
    from: 'Jayanagar',
    to: 'JP Nagar'
  },
  {
    id: 5,
    type: 'scooter',
    date: '2025-10-28',
    time: '11:15',
    duration: '22m 0s', // Electronic City → Silk Board ~9 km
    distance: 9.0,
    fare: 5 + 22 * 2.5, // ₹60
    from: 'Electronic City',
    to: 'Silk Board'
  },
];

export function RidesHistoryScreen({ onBack }: RidesHistoryScreenProps) {
  const [filter, setFilter] = useState('all');

  const filteredRides = filter === 'all' 
    ? rides 
    : rides.filter(ride => ride.type === filter);

  const totalRides = rides.length;
  const totalDistance = rides.reduce((sum, ride) => sum + ride.distance, 0);
  const totalSpent = rides.reduce((sum, ride) => sum + ride.fare, 0);

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
          <h2 className="text-white">My Rides</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/20"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-center">
            <p className="text-white/80 mb-1">Rides</p>
            <p className="text-white text-2xl">{totalRides}</p>
          </Card>
          <Card className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-center">
            <p className="text-white/80 mb-1">Km</p>
            <p className="text-white text-2xl">{totalDistance.toFixed(1)}</p>
          </Card>
          <Card className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-center">
            <p className="text-white/80 mb-1">Spent</p>
            <p className="text-white text-2xl">₹{totalSpent.toFixed(0)}</p>
          </Card>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4 -mt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="bike">Bikes</TabsTrigger>
              <TabsTrigger value="scooter">Scooters</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </div>

      {/* Rides List */}
      <div className="flex-1 px-6 overflow-auto pb-6">
        <div className="space-y-3">
          {filteredRides.map((ride, index) => (
            <motion.div
              key={ride.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 rounded-2xl border-2 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-[#007BFF]/10 to-[#A6FF00]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    {ride.type === 'scooter' ? (
                      <Navigation2 className="w-7 h-7 text-[#007BFF]" />
                    ) : (
                      <Bike className="w-7 h-7 text-[#007BFF]" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[#1E1E1E]">
                          {ride.type === 'scooter' ? 'E-Scooter' : 'E-Bike'} Ride
                        </p>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{ride.date}</span>
                          <span>•</span>
                          <span>{ride.time}</span>
                        </div>
                      </div>
                      <p className="text-[#007BFF] text-lg">₹{ride.fare.toFixed(2)}</p>
                    </div>

                    {/* Route */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-[#A6FF00] rounded-full" />
                        <p className="text-[#1E1E1E]">{ride.from}</p>
                      </div>
                      <div className="ml-1 w-px h-3 bg-gray-300" />
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-[#007BFF]" />
                        <p className="text-[#1E1E1E]">{ride.to}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{ride.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{ride.distance} km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

