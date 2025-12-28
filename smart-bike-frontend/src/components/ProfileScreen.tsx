import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, User, Mail, Phone, Edit, CreditCard, Bell, Shield, LogOut, ChevronRight 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    toast.success('Logged out successfully', { duration: 1500 });
    setTimeout(() => onLogout(), 500);
  };

  return (
    <div className="relative w-full h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] px-6 pt-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full text-white hover:bg-white/20"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white text-lg md:text-xl font-semibold">Profile</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/20"
            aria-label="Edit Profile"
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Avatar className="w-28 h-28 mb-4 border-4 border-white/20">
            <AvatarFallback className="bg-[#A6FF00] text-[#1E1E1E] text-3xl">
              {user ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-white text-xl md:text-2xl mb-1">
            {user ? user.name : 'User Name'}
          </h3>
          <p className="text-white/80">
            Member since {user ? 'Dec 2025' : 'Date Unknown'}
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-16 px-6 overflow-auto pb-6 max-w-2xl mx-auto">
        {/* Personal Information */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="p-5 rounded-3xl border-2 shadow-lg mb-6 hover:shadow-xl transition-shadow">
            <h4 className="text-[#1E1E1E] mb-5 text-lg font-semibold">Personal Information</h4>
            <div className="space-y-3">
              {[
                { icon: User, label: 'Full Name', value: user?.name || 'User Name' },
                { icon: Mail, label: 'Email', value: user?.email || 'user@email.com' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#007BFF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="text-[#1E1E1E] font-medium">{item.value}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Payment Method */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="p-5 rounded-3xl border-2 mb-6 hover:shadow-xl transition-shadow">
            <h4 className="text-[#1E1E1E] mb-4 text-lg font-semibold">Payment Method</h4>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#1E1E1E] font-medium">RuPay •••• 4242</p>
                <p className="text-gray-500 text-sm">Expires 12/26</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="p-5 rounded-3xl border-2 mb-6 hover:shadow-xl transition-shadow">
            <h4 className="text-[#1E1E1E] mb-4 text-lg font-semibold">Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#007BFF]" />
                  </div>
                  <p className="text-[#1E1E1E] font-medium">Notifications</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#007BFF]" />
                  </div>
                  <p className="text-[#1E1E1E] font-medium">Two-Factor Auth</p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) => setTwoFactorEnabled(checked)}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl h-14 flex items-center justify-center gap-2"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
