import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { toast } from 'sonner';
import axios from 'axios';

interface AuthScreenProps {
  onLogin: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'customer' | 'admin'>('customer');

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpResendLoading, setOtpResendLoading] = useState(false);

  const otpInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/auth';

const isAuthorizedEmail = (email: string) => {
  const allowedDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'protonmail.com',
    'bmsce.ac.in',
  ];

  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split('@')[1];

  return !!domain && allowedDomains.includes(domain);
};


  // ================= LOGIN =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: loginEmail.trim(),
        password: loginPassword,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login successful');
      onLogin();
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ================= SIGNUP (UPDATED) =================
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ NEW: email validation before OTP
    if (!isAuthorizedEmail(signupEmail.trim())) {
      toast.error('Please use a valid authorized email ID');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/signup`, {
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        role: signupRole,
      });

      toast.success('OTP sent to your email');
      setOtpSent(true);
      setActiveTab('signup');
      setOtpCooldown(60);
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otpValue)) {
      toast.error('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, {
        email: signupEmail.trim(),
        otp: otpValue,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Account verified');

      setOtpSent(false);
      setOtpValue('');
      setActiveTab('login');
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResendOtp = async () => {
    setOtpResendLoading(true);
    try {
      await axios.post(`${API_URL}/resend-otp`, {
        email: signupEmail.trim(),
      });
      toast.success('OTP resent');
      setOtpCooldown(60);
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'Failed to resend OTP');
    } finally {
      setOtpResendLoading(false);
    }
  };

  // OTP timer
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => setOtpCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  useEffect(() => {
    if (otpSent && otpInputRef.current) otpInputRef.current.focus();
  }, [otpSent]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] px-8 pt-12 pb-16 text-center">
          <div className="flex justify-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#A6FF00]" />
            </div>
            <h1 className="text-white text-2xl font-semibold">Tag</h1>
          </div>
          <p className="text-white/80 text-sm">Sign in or create account</p>
        </div>

        <div className="px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <Label>Email</Label>
                <Input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <Label>Password</Label>
                <Input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <Button className="w-full" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent value="signup">
              {!otpSent ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  <Input placeholder="Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                  <Input placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                  <Input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                  <Button className="w-full" disabled={loading}>
                    {loading ? 'Loading...' : 'Create Account'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <Input
                    ref={otpInputRef}
                    placeholder="Enter OTP"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  />
                  <Button className="w-full" disabled={loading}>
                    Verify OTP
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpCooldown > 0 || otpResendLoading}
                    className="w-full bg-gray-200 text-black"
                  >
                    {otpCooldown > 0 ? `Resend OTP (${otpCooldown}s)` : 'Resend OTP'}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
