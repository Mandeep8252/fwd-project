import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Battery, Shield, Navigation2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface RideScreenProps {
  onEndRide: (data: { duration: number; distance: number; fare: number }) => void;
}

export function RideScreen({ onEndRide }: RideScreenProps) {
  const [duration, setDuration] = useState(0); // seconds
  const [distance, setDistance] = useState(0); // km
  const baseFare = 5; // ₹5 base fare
  const farePerMinute = 2.5; // ₹2.50 per minute
  const distancePerSecond = 0.007; // 7 meters per second in km

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
      setDistance((prev) => prev + distancePerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fare = baseFare + (duration / 60) * farePerMinute;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative mb-8">
          <div className="w-48 h-48 rounded-full bg-white/10 border-4 border-white/20 flex flex-col items-center justify-center">
            <Clock className="w-8 h-8 text-[#A6FF00] mb-2" />
            <p className="text-5xl text-white">{formatTime(duration)}</p>
            <p className="text-white/70 mt-1">Duration</p>
          </div>
        </motion.div>

        <div className="w-full grid grid-cols-2 gap-4">
          <Card className="p-4 rounded-2xl bg-white/10 border-2 border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-[#A6FF00]" />
              <span className="text-white/70">Distance</span>
            </div>
            <p className="text-white text-2xl">{distance.toFixed(2)}</p>
            <p className="text-white/70">km</p>
          </Card>

          <Card className="p-4 rounded-2xl bg-white/10 border-2 border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#A6FF00] text-xl">₹</span>
              <span className="text-white/70">Fare</span>
            </div>
            <p className="text-white text-2xl">{fare.toFixed(2)}</p>
            <p className="text-white/70">estimated</p>
          </Card>
        </div>
      </div>

      {/* End Ride Button */}
      <div className="relative z-10 px-6 pb-6">
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
