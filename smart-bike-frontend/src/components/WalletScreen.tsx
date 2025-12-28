import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface WalletScreenProps {
  onBack: () => void;
}

const transactions = [
  { id: 1, type: 'debit', amount: 85.0, description: 'Ride - E-Scooter #3', date: '2025-11-04', time: '14:30' },
  { id: 2, type: 'credit', amount: 500.0, description: 'Wallet Top-up', date: '2025-11-03', time: '10:15' },
  { id: 3, type: 'debit', amount: 123.0, description: 'Ride - E-Bike #7', date: '2025-11-02', time: '18:45' },
  { id: 4, type: 'debit', amount: 62.0, description: 'Ride - E-Scooter #1', date: '2025-11-01', time: '09:20' },
  { id: 5, type: 'credit', amount: 250.0, description: 'Wallet Top-up', date: '2025-10-30', time: '16:00' },
  { id: 6, type: 'debit', amount: 40.0, description: 'Ride - E-Bike #2', date: '2025-11-05', time: '11:00' },
];

export function WalletScreen({ onBack }: WalletScreenProps) {
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  const totalCredit = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCredit - totalSpent;

  const handleAddMoney = () => {
    if (amount) {
      toast.success(`₹${amount} added to wallet`);
      setOpen(false);
      setAmount('');
    }
  };

  const chartData = [
    { name: 'Spent', value: totalSpent },
    { name: 'Available', value: balance },
  ];

  const COLORS = ['#C53030', '#48BB78']; // red and green

  return (
    <div className="relative w-full min-h-screen bg-gray-50 flex flex-col items-center md:items-stretch">
      {/* ---------------- Header ---------------- */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] px-6 py-4 md:px-12 md:py-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white text-lg md:text-2xl font-semibold">My Wallet</h2>
          <div className="w-10" />
        </div>

        {/* Balance + Pie Chart */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon className="w-5 h-5 text-[#48BB78]" />
              <span className="text-white/80">Current Balance</span>
            </div>
            <p className="text-white text-4xl md:text-5xl font-bold mb-4">₹{balance.toFixed(2)}</p>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full md:w-60 bg-[#48BB78] text-[#1E1E1E] hover:bg-[#38a169] rounded-2xl h-12 md:h-14 flex items-center justify-center">
                  <Plus className="w-5 h-5 mr-2" /> Add Money
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[320px] md:w-[400px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-[#1E1E1E]">Amount</label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-12 md:h-14 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 250, 500].map((val) => (
                      <Button key={val} variant="outline" onClick={() => setAmount(val.toString())} className="rounded-xl h-12 md:h-14">
                        ₹{val}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={handleAddMoney}
                    className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-2xl h-12 md:h-14"
                  >
                    Add Money
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="w-full md:w-1/3 h-32 md:h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`₹${value.toFixed(2)}`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #ccc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ---------------- Transaction History ---------------- */}
      <div className="flex-1 px-6 md:px-12 overflow-auto pb-6 w-full md:max-w-[1000px] mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#1E1E1E] font-semibold text-lg md:text-xl">Transaction History</h3>
          <Button variant="link" className="text-[#007BFF] p-0">
            View All
          </Button>
        </div>

        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4">
          {transactions.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-4 rounded-2xl border-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        t.type === 'debit' ? 'bg-red-100' : 'bg-green-100'
                      }`}
                    >
                      {t.type === 'debit' ? (
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-[#1E1E1E]">{t.description}</p>
                      <p className="text-gray-500 text-sm md:text-base">{t.date} • {t.time}</p>
                    </div>
                  </div>
                  <p className={`text-lg md:text-xl ${t.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                    {t.type === 'debit' ? '-' : '+'}₹{t.amount.toFixed(2)}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
