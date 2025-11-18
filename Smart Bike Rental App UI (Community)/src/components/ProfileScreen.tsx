import { motion } from 'motion/react';
import { ArrowLeft, User, Mail, Phone, Edit, CreditCard, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const handleLogout = () => {
    toast.success('Logged out successfully');
    setTimeout(() => onLogout(), 1000);
  };

  return (
    <div className="relative w-full h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] px-6 pt-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white">Profile</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/20"
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Avatar className="w-24 h-24 mb-4 border-4 border-white/20">
            <AvatarFallback className="bg-[#A6FF00] text-[#1E1E1E] text-2xl">
              JD
            </AvatarFallback>
          </Avatar>
          <h3 className="text-white text-xl mb-1">John Doe</h3>
          <p className="text-white/80">Member since Oct 2025</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-12 px-6 overflow-auto pb-6">
        {/* Personal Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 rounded-3xl border-2 shadow-lg mb-4">
            <h4 className="text-[#1E1E1E] mb-4">Personal Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-[#007BFF]" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-500">Full Name</p>
                  <p className="text-[#1E1E1E]">John Doe</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#007BFF]" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-500">Email</p>
                  <p className="text-[#1E1E1E]">john.doe@email.com</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#007BFF]" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-500">Phone</p>
                  <p className="text-[#1E1E1E]">+91 98765 43210</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 rounded-3xl border-2 mb-4">
            <h4 className="text-[#1E1E1E] mb-4">Payment Method</h4>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#1E1E1E]">Visa •••• 4242</p>
                <p className="text-gray-500">Expires 12/26</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 rounded-3xl border-2 mb-4">
            <h4 className="text-[#1E1E1E] mb-4">Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#007BFF]" />
                  </div>
                  <p className="text-[#1E1E1E]">Notifications</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#007BFF]" />
                  </div>
                  <p className="text-[#1E1E1E]">Two-Factor Auth</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl h-14"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
