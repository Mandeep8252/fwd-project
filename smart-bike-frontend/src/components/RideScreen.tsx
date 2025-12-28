import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Battery, Shield, Navigation2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface RideScreenProps {
  onEndRide: (data: { duration: number; distance: number; fare: number }) => void;
}

export function RideScreen({ onEndRide }: RideScreenProps) {
  const [duration, setDuration] = useState(0); // seconds
  const [distance, setDistance] = useState(0); // km
  const [battery, setBattery] = useState(100); // %
  
  const baseFare = 5; // ₹5 base fare
  const farePerMinute = 2.5; // ₹2.50 per minute
  const distancePerSecond = 0.007; // ~7 meters per second in km

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
      setDistance((prev) => prev + distancePerSecond * (0.9 + Math.random() * 0.2));
      setBattery((prev) => Math.max(prev - 0.01 - Math.random() * 0.01, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fare = baseFare + (duration / 60) * farePerMinute;
  const speed = (distance / (duration / 3600 || 1)).toFixed(1); // km/h

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndRide = () => {
    onEndRide({
      duration,
      distance: parseFloat(distance.toFixed(2)),
      fare: parseFloat(fare.toFixed(2)),
    });
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Timer */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative mb-8">
          <div className="w-48 h-48 rounded-full bg-white/10 border-4 border-white/20 flex flex-col items-center justify-center">
            <Clock className="w-8 h-8 text-[#A6FF00] mb-2" />
            <p className="text-5xl text-white font-mono">{formatTime(duration)}</p>
            <p className="text-white/70 mt-1">Duration</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: MapPin, label: 'Distance', value: `${distance.toFixed(2)} km` },
            { icon: Shield, label: 'Fare', value: `₹${fare.toFixed(2)}` },
            { icon: Battery, label: 'Battery', value: `${battery.toFixed(0)}%` },
            { icon: Navigation2, label: 'Speed', value: `${speed} km/h` },
          ].map((stat, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }}>
              <Card className="p-4 rounded-2xl bg-white/10 border-2 border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-[#A6FF00]" />
                  <span className="text-white/70">{stat.label}</span>
                </div>
                <p className="text-white text-2xl">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* End Ride Button */}
      <div className="relative z-10 px-6 pb-6 mt-6">
        <Button
          onClick={handleEndRide}
          className="w-full bg-white text-[#007BFF] hover:bg-gray-100 rounded-2xl h-14 shadow-lg"
        >
          End Ride
        </Button>
      </div>
    </div>
  );
}
