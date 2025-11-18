import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, MapPin, Star, Download, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';

interface RideSummaryScreenProps {
  rideData: {
    duration: number;
    distance: number; // already in km from RideScreen
    fare: number;
  };
  onComplete: () => void;
}

export function RideSummaryScreen({ rideData, onComplete }: RideSummaryScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handlePayment = () => {
    toast.success('Payment successful!');
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] px-6 pt-12 pb-16 relative overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-[#A6FF00] rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-[#1E1E1E]" strokeWidth={3} />
          </div>
          <h2 className="text-white text-2xl mb-1">Ride Completed!</h2>
          <p className="text-white/80">Thank you for riding with Tag</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-8 px-6 overflow-auto pb-6">
        {/* Ride Stats Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 rounded-3xl border-2 shadow-lg mb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#007BFF]" />
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="text-[#1E1E1E] text-lg">{formatTime(rideData.duration)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#007BFF]" />
                  </div>
                  <div>
                    <p className="text-gray-500">Distance</p>
                    <p className="text-[#1E1E1E] text-lg">{rideData.distance.toFixed(2)} km</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#A6FF00]/20 rounded-xl flex items-center justify-center">
                    <span className="text-[#007BFF] font-bold text-lg">₹</span>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Fare</p>
                    <p className="text-[#007BFF] text-2xl">{rideData.fare.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Rate Your Ride */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 rounded-3xl border-2 mb-4">
            <h3 className="text-[#1E1E1E] mb-4 text-center">Rate Your Ride</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className="w-10 h-10 transition-colors"
                    fill={(hoveredRating || rating) >= star ? '#A6FF00' : 'none'}
                    stroke={(hoveredRating || rating) >= star ? '#A6FF00' : '#D1D5DB'}
                    strokeWidth={2}
                  />
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Payment Options */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            onClick={handlePayment}
            className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-2xl h-14"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pay from Wallet
          </Button>

          <Button
            onClick={handlePayment}
            variant="outline"
            className="w-full border-2 rounded-2xl h-14"
          >
            Pay via UPI
          </Button>

          <Button
            variant="ghost"
            className="w-full text-gray-600 rounded-2xl h-12"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
