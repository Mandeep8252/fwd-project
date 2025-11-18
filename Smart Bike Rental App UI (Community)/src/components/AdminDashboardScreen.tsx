import { motion } from 'motion/react';
import { ArrowLeft, Bike, Navigation2, TrendingUp, DollarSign, Users, Battery, MapPin, Plus, Minus, IndianRupee } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface AdminDashboardScreenProps {
  onBack: () => void;
}

const stats = [
  { label: 'Active Bikes', value: 142, icon: Bike, color: 'bg-blue-500', change: '+12%' },
  { label: 'Ongoing Rides', value: 38, icon: Users, color: 'bg-green-500', change: '+8%' },
  { label: 'Total Revenue', value: '₹1,24,500', icon: IndianRupee, color: 'bg-purple-500', change: '+15%' },
  { label: 'Fleet Health', value: '94%', icon: Battery, color: 'bg-orange-500', change: '+2%' },
];

const activeVehicles = [
  { id: 1, type: 'scooter', battery: 95, status: 'in-use', location: 'Koramangala' },
  { id: 2, type: 'bike', battery: 78, status: 'available', location: 'Indiranagar' },
  { id: 3, type: 'scooter', battery: 45, status: 'low-battery', location: 'Whitefield' },
  { id: 4, type: 'bike', battery: 88, status: 'in-use', location: 'HSR Layout' },
  { id: 5, type: 'scooter', battery: 92, status: 'available', location: 'MG Road' },
];

export function AdminDashboardScreen({ onBack }: AdminDashboardScreenProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-use':
        return 'bg-blue-500';
      case 'available':
        return 'bg-green-500';
      case 'low-battery':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="relative w-full h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2d2d2d] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white">Admin Dashboard</h2>
          <div className="w-10" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/80 text-center"
        >
          Real-time fleet management
        </motion.p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-auto pb-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="p-4 rounded-2xl border-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-[#1E1E1E] text-xl">{stat.value}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Map Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#1E1E1E]">Fleet Map</h3>
            <Button variant="outline" size="sm" className="rounded-xl">
              <MapPin className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          <Card className="p-4 rounded-3xl border-2">
            <div className="h-40 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Mock map markers */}
              {[1, 2, 3, 4, 5].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute w-3 h-3 bg-[#007BFF] rounded-full"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`
                  }}
                />
              ))}
              <p className="text-gray-400 relative z-10">142 vehicles tracked</p>
            </div>
          </Card>
        </motion.div>

        {/* Active Vehicles List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#1E1E1E]">Active Vehicles</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-xl h-8 px-3">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl h-8 px-3">
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {activeVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <Card className="p-3 rounded-2xl border-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF]/10 to-[#A6FF00]/10 rounded-xl flex items-center justify-center">
                        {vehicle.type === 'scooter' ? (
                          <Navigation2 className="w-6 h-6 text-[#007BFF]" />
                        ) : (
                          <Bike className="w-6 h-6 text-[#007BFF]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[#1E1E1E]">
                            {vehicle.type === 'scooter' ? 'E-Scooter' : 'E-Bike'} #{vehicle.id}
                          </p>
                          <Badge className={`${getStatusColor(vehicle.status)} text-white text-xs`}>
                            {getStatusLabel(vehicle.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Battery className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">{vehicle.battery}%</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">{vehicle.location}</span>
                          </div>
                        </div>
                        {/* Battery Progress */}
                        <Progress 
                          value={vehicle.battery} 
                          className="h-1 mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-[#1E1E1E] mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-auto py-4 flex flex-col gap-2 bg-[#007BFF] hover:bg-[#0056b3] rounded-2xl">
              <Plus className="w-5 h-5" />
              <span>Add Vehicle</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-2 rounded-2xl">
              <Minus className="w-5 h-5" />
              <span>Remove Vehicle</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
