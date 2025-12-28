import { motion } from 'motion/react';
import { ArrowLeft, Bike, Navigation2, Battery, MapPin, Users, IndianRupee } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface AdminDashboardScreenProps {
  onBack: () => void;
}

interface Stat {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
}

interface Vehicle {
  id: number;
  type: 'scooter' | 'bike';
  battery: number;
  status: 'in-use' | 'available' | 'low-battery';
  location: string;
}

const stats: Stat[] = [
  { label: 'Active Bikes', value: 142, icon: Bike, color: 'bg-blue-500', change: '+12%' },
  { label: 'Ongoing Rides', value: 38, icon: Users, color: 'bg-green-500', change: '+8%' },
  { label: 'Total Revenue', value: '₹1,24,500', icon: IndianRupee, color: 'bg-purple-500', change: '+15%' },
  { label: 'Fleet Health', value: '94%', icon: Battery, color: 'bg-orange-500', change: '+2%' },
];

const activeVehicles: Vehicle[] = [
  { id: 1, type: 'scooter', battery: 95, status: 'in-use', location: 'Koramangala' },
  { id: 2, type: 'bike', battery: 78, status: 'available', location: 'Indiranagar' },
  { id: 3, type: 'scooter', battery: 45, status: 'low-battery', location: 'Whitefield' },
  { id: 4, type: 'bike', battery: 88, status: 'in-use', location: 'HSR Layout' },
  { id: 5, type: 'scooter', battery: 92, status: 'available', location: 'MG Road' },
];

export function AdminDashboardScreen({ onBack }: AdminDashboardScreenProps) {
  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'in-use': return 'bg-blue-500';
      case 'available': return 'bg-green-500';
      case 'low-battery': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Vehicle['status']) =>
    status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="relative w-full min-h-screen bg-gray-50 flex flex-col p-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2d2d2d] p-4 rounded-xl mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white text-xl font-semibold">Admin Dashboard</h2>
        </div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-white/80 text-center md:text-right">
          Real-time fleet management
        </motion.p>
      </div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 + index * 0.05 }}>
              <Card className="p-4 rounded-2xl border-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                </div>
                <p className="text-gray-500 mb-1">{stat.label}</p>
                <p className="text-[#1E1E1E] text-xl">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Active Vehicles */}
      <motion.div>
        <h3 className="text-[#1E1E1E] mb-3 text-lg font-medium">Active Vehicles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeVehicles.map((vehicle, index) => (
            <motion.div key={vehicle.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + index * 0.05 }}>
              <Card className="p-3 rounded-2xl border-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF]/10 to-[#A6FF00]/10 rounded-xl flex items-center justify-center">
                    {vehicle.type === 'scooter' ? <Navigation2 className="w-6 h-6 text-[#007BFF]" /> : <Bike className="w-6 h-6 text-[#007BFF]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[#1E1E1E] truncate">{vehicle.type === 'scooter' ? 'E-Scooter' : 'E-Bike'} #{vehicle.id}</p>
                      <Badge className={`${getStatusColor(vehicle.status)} text-white text-xs`}>{getStatusLabel(vehicle.status)}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1"><Battery className="w-3 h-3" />{vehicle.battery}%</div>
                      <span>•</span>
                      <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{vehicle.location}</div>
                    </div>
                    <Progress value={vehicle.battery} className="h-2 mt-2 rounded-full" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
