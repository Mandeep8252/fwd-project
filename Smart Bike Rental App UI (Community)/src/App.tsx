// App.tsx
import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { ScanScreen } from './components/ScanScreen';
import { RideScreen } from './components/RideScreen';
import { RideSummaryScreen } from './components/RideSummaryScreen';
import { WalletScreen } from './components/WalletScreen';
import { RidesHistoryScreen } from './components/RidesHistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SupportScreen } from './components/SupportScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';
import { Toaster } from './components/ui/sonner';

export type Screen =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'scan'
  | 'ride'
  | 'rideSummary'
  | 'wallet'
  | 'history'
  | 'profile'
  | 'support'
  | 'admin';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [rideData, setRideData] = useState({
    duration: 0,
    distance: 0,
    fare: 0,
  });

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onGetStarted={() => navigate('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={() => navigate('auth')} onSkip={() => navigate('auth')} />;
      case 'auth':
        return <AuthScreen onLogin={() => navigate('home')} />;
      case 'home':
        return <HomeScreen onNavigate={navigate} />;
      case 'scan':
        return <ScanScreen onUnlock={() => navigate('ride')} onBack={() => navigate('home')} />;
      case 'ride':
        return (
          <RideScreen
            onEndRide={(data) => {
              setRideData(data);
              navigate('rideSummary');
            }}
          />
        );
      case 'rideSummary':
        return <RideSummaryScreen rideData={rideData} onComplete={() => navigate('home')} />;
      case 'wallet':
        return <WalletScreen onBack={() => navigate('home')} />;
      case 'history':
        return <RidesHistoryScreen onBack={() => navigate('home')} />;
      case 'profile':
        return <ProfileScreen onBack={() => navigate('home')} onLogout={() => navigate('auth')} />;
      case 'support':
        return <SupportScreen onBack={() => navigate('home')} />;
      case 'admin':
        return <AdminDashboardScreen onBack={() => navigate('home')} />;
      default:
        return <SplashScreen onGetStarted={() => navigate('onboarding')} />;
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gray-100">
      {/* Mobile Frame */}
      <div className="relative w-[360px] h-[800px] bg-white overflow-hidden shadow-2xl rounded-[32px] border-8 border-gray-800">
        {renderScreen()}
      </div>
      <Toaster />
    </div>
  );
}
