import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Scan, Bike, WifiOff, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

type Slide = {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
};

export function OnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);

  // -------------------------------
  // ENVIRONMENT CHECKS
  // -------------------------------

  // Internet status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Location permission
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationGranted(false);
      return;
    }

    navigator.permissions
      ?.query({ name: 'geolocation' as PermissionName })
      .then((result) => {
        setLocationGranted(result.state === 'granted');
        result.onchange = () => setLocationGranted(result.state === 'granted');
      })
      .catch(() => setLocationGranted(false));
  }, []);

  // Skip onboarding if already seen
  useEffect(() => {
    if (localStorage.getItem('hasSeenOnboarding') === 'true') {
      onComplete();
    }
  }, [onComplete]);

  // -------------------------------
  // SLIDES (DYNAMIC)
  // -------------------------------
  const slides: Slide[] = useMemo(() => {
    const baseSlides: Slide[] = [];

    if (!isOnline) {
      baseSlides.push({
        icon: WifiOff,
        title: 'No Internet Connection',
        description: 'Please connect to the internet to continue',
        color: '#FF3B30',
      });
    }

    if (locationGranted === false) {
      baseSlides.push({
        icon: Navigation,
        title: 'Enable Location',
        description: 'Location access is required to find nearby bikes',
        color: '#FF9500',
      });
    }

    baseSlides.push(
      {
        icon: MapPin,
        title: 'Find a Bike',
        description: 'Locate nearby bikes and scooters on the map in real-time',
        color: '#007BFF',
      },
      {
        icon: Scan,
        title: 'Tap or Scan to Unlock',
        description: 'Simply scan the QR code or tap with NFC to unlock instantly',
        color: '#A6FF00',
      },
      {
        icon: Bike,
        title: 'Ride & Go',
        description: 'Enjoy your ride and pay only for the time you use',
        color: '#007BFF',
      }
    );

    return baseSlides;
  }, [isOnline, locationGranted]);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  // -------------------------------
  // HANDLERS
  // -------------------------------
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      localStorage.setItem('hasSeenOnboarding', 'true');
      onComplete();
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Skip */}
      <div className="absolute top-6 right-6 z-10">
        <Button variant="ghost" onClick={onSkip} className="text-gray-500 hover:text-gray-700">
          Skip
        </Button>
      </div>

      {/* Slide */}
      <div className="flex-1 flex items-center justify-center px-8 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mb-12 flex justify-center">
              <div
                className="w-48 h-48 rounded-3xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${slide.color}20, ${slide.color}10)`,
                }}
              >
                <div className="w-36 h-36 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <Icon className="w-20 h-20" style={{ color: slide.color }} />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
            <p className="text-gray-600">{slide.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="p-8 max-w-lg mx-auto w-full">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-10 bg-[#007BFF]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 rounded-2xl bg-[#007BFF] hover:bg-[#0056b3] text-white"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
