import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { AuthScreen } from "./components/AuthScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ScanScreen } from "./components/ScanScreen";
import { RideScreen } from "./components/RideScreen";
import { RideSummaryScreen } from "./components/RideSummaryScreen";
import { WalletScreen } from "./components/WalletScreen";
import { RidesHistoryScreen } from "./components/RidesHistoryScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { SupportScreen } from "./components/SupportScreen";
import { AdminDashboardScreen } from "./components/AdminDashboardScreen";
import { OTPVerificationScreen } from "./components/OTPVerificationScreen"; // New screen
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const navigate = useNavigate();

  const [rideData, setRideData] = useState({
    duration: 0,
    distance: 0,
    fare: 0,
  });

  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  // ✅ JWT authentication check
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">

      {/* ----------------- Desktop Navbar ----------------- */}
      <div className="hidden md:flex w-full bg-white shadow-md px-6 py-4 justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/home")}>
          SmartBike
        </div>
        <div className="flex gap-6">
          <button onClick={() => navigate("/home")} className="hover:underline">Home</button>
          <button onClick={() => navigate("/scan")} className="hover:underline">Scan</button>
          <button onClick={() => navigate("/wallet")} className="hover:underline">Wallet</button>
          <button onClick={() => navigate("/history")} className="hover:underline">Rides</button>
          <button onClick={() => navigate("/profile")} className="hover:underline">Profile</button>
          <button onClick={() => navigate("/support")} className="hover:underline">Support</button>
          <button onClick={() => navigate("/admin")} className="hover:underline">Admin</button>
        </div>
      </div>

      {/* ----------------- Main Content ----------------- */}
      <div className="flex w-full flex-1">

        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white shadow-lg min-h-screen p-6 gap-6">
          <h2 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/home")}>
            SmartBike
          </h2>
          <button onClick={() => navigate("/home")} className="hover:bg-gray-200 p-2 rounded">Home</button>
          <button onClick={() => navigate("/scan")} className="hover:bg-gray-200 p-2 rounded">Scan</button>
          <button onClick={() => navigate("/wallet")} className="hover:bg-gray-200 p-2 rounded">Wallet</button>
          <button onClick={() => navigate("/history")} className="hover:bg-gray-200 p-2 rounded">Rides</button>
          <button onClick={() => navigate("/profile")} className="hover:bg-gray-200 p-2 rounded">Profile</button>
          <button onClick={() => navigate("/support")} className="hover:bg-gray-200 p-2 rounded">Support</button>
          <button onClick={() => navigate("/admin")} className="hover:bg-gray-200 p-2 rounded">Admin</button>
        </div>

        {/* Pages */}
        <div className="flex-1 p-4 md:p-8 bg-gray-50 md:max-w-[1200px] md:mx-auto md:rounded-lg md:shadow-lg flex flex-col">
          <Routes>

            {/* Public routes */}
            <Route
              path="/"
              element={<SplashScreen onGetStarted={() => navigate("/onboarding")} />}
            />
            <Route
              path="/onboarding"
              element={
                <OnboardingScreen
                  onComplete={() => navigate("/auth")}
                  onSkip={() => navigate("/auth")}
                />
              }
            />
            <Route
              path="/auth"
              element={
                <AuthScreen
                  onLogin={() => navigate("/home")}
                  onOTPRequired={(email: string) => {
                    setPendingVerificationEmail(email);
                    navigate("/verify-otp");
                  }}
                />
              }
            />
            <Route
              path="/verify-otp"
              element={
                <OTPVerificationScreen
                  email={pendingVerificationEmail}
                  onVerified={() => navigate("/home")}
                  onBack={() => navigate("/auth")}
                />
              }
            />

            {/* Protected routes */}
            <Route
              path="/home"
              element={
                isAuthenticated()
                  ? <HomeScreen onNavigate={(path) => navigate(path)} />
                  : navigate("/auth")
              }
            />
            <Route
              path="/scan"
              element={
                isAuthenticated()
                  ? <ScanScreen onUnlock={() => navigate("/ride")} onBack={() => navigate("/home")} />
                  : navigate("/auth")
              }
            />
            <Route
              path="/ride"
              element={
                isAuthenticated()
                  ? (
                    <RideScreen
                      onEndRide={(data) => {
                        setRideData(data);
                        navigate("/rideSummary");
                      }}
                    />
                  )
                  : navigate("/auth")
              }
            />
            <Route
              path="/rideSummary"
              element={
                isAuthenticated()
                  ? <RideSummaryScreen rideData={rideData} onComplete={() => navigate("/home")} />
                  : navigate("/auth")
              }
            />
            <Route
              path="/wallet"
              element={
                isAuthenticated()
                  ? <WalletScreen onBack={() => navigate("/home")} />
                  : navigate("/auth")
              }
            />
            <Route
              path="/history"
              element={
                isAuthenticated()
                  ? <RidesHistoryScreen onBack={() => navigate("/home")} />
                  : navigate("/auth")
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated()
                  ? (
                    <ProfileScreen
                      onBack={() => navigate("/home")}
                      onLogout={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/auth");
                      }}
                    />
                  )
                  : navigate("/auth")
              }
            />
            <Route
              path="/support"
              element={
                isAuthenticated()
                  ? <SupportScreen onBack={() => navigate("/home")} />
                  : navigate("/auth")
              }
            />
            <Route
              path="/admin"
              element={
                isAuthenticated()
                  ? <AdminDashboardScreen onBack={() => navigate("/home")} />
                  : navigate("/auth")
              }
            />

          </Routes>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden md:flex justify-center items-center w-full py-4 bg-gray-100 mt-auto">
        <p className="text-gray-500 text-sm">&copy; 2025 SmartBike App</p>
      </div>

      <Toaster />
    </div>
  );
}
