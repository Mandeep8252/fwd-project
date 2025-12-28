import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";
import axios from "axios";

interface OTPVerificationScreenProps {
  email: string | null;
  onVerified: () => void;
  onBack: () => void;
}

export function OTPVerificationScreen({
  email,
  onVerified,
  onBack,
}: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Use deployed backend URL
  const API_URL = "https://smart-bike-backend.onrender.com/api/auth";

  // Simple email format check
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleVerify = async () => {
    if (!email) {
      toast.error("No email provided for verification.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/verify-otp`,
        { email, otp },
        { withCredentials: true } // ensures cookies are sent/received if backend uses them
      );

      toast.success(res.data.msg || "Email verified successfully!");

      // Save auth data only after email verification
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onVerified();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.msg || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-4 text-center"
        >
          Verify Your Email
        </motion.h2>

        <p className="text-gray-500 text-center mb-6">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        <div className="space-y-4">
          <div>
            <Label>OTP</Label>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="h-12 rounded-xl text-center tracking-widest text-lg"
              maxLength={6}
            />
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-2xl h-12"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            variant="ghost"
            className="w-full text-gray-500"
            onClick={onBack}
          >
            Back to Signup/Login
          </Button>
        </div>
      </div>
    </div>
  );
}
