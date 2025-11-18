import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Scan, Bike, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slides = [
  {
    icon: MapPin,
    title: 'Find a Bike',
    description: 'Locate nearby bikes and scooters on the map in real-time',
    color: '#007BFF'
  },
  {
    icon: Scan,
    title: 'Tap or Scan to Unlock',
    description: 'Simply scan the QR code or tap with NFC to unlock instantly',
    color: '#A6FF00'
  },
  {
    icon: Bike,
    title: 'Ride & Go',
    description: 'Enjoy your ride and pay only for the time you use',
    color: '#007BFF'
  }
];

export function OnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-gray-500 hover:text-gray-700"
        >
          Skip
        </Button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-[#007BFF]/10 to-[#A6FF00]/10 flex items-center justify-center">
                <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                  <Icon className="w-16 h-16" style={{ color: slide.color }} strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#1E1E1E] mb-4"
            >
              {slide.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 max-w-xs"
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="p-8 space-y-6">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-[#007BFF]'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-2xl h-14 shadow-lg"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
