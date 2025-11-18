import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export function SplashScreen({ onGetStarted }: SplashScreenProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#007BFF] to-[#0056b3] flex flex-col items-center justify-center p-8">
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-6"
      >
        <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
          <div className="relative">
            <Zap className="w-16 h-16 text-[#A6FF00]" fill="#A6FF00" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Navigation className="w-8 h-8 text-white" fill="white" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* App Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center mb-3"
      >
        <h1 className="text-white text-5xl tracking-tight mb-2">Tag</h1>
        <div className="flex items-center gap-2 justify-center">
          <div className="h-px w-8 bg-[#A6FF00]" />
          <p className="text-white/90 text-lg">Tap and Go</p>
          <div className="h-px w-8 bg-[#A6FF00]" />
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-white/80 text-center mb-12 max-w-xs"
      >
        Smart electric bike & scooter rentals at your fingertips
      </motion.p>

      {/* Loading Indicator */}
      {!showButton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#A6FF00] rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Get Started Button */}
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-12 left-8 right-8"
        >
          <Button
            onClick={onGetStarted}
            className="w-full bg-[#A6FF00] text-[#1E1E1E] hover:bg-[#95ee00] rounded-2xl h-14 shadow-lg"
          >
            Get Started
          </Button>
        </motion.div>
      )}
    </div>
  );
}
