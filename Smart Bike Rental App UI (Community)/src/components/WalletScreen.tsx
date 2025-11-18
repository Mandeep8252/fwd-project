import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, TrendingDown, TrendingUp, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

interface WalletScreenProps {
  onBack: () => void;
}

const transactions = [
  { id: 1, type: 'debit', amount: 85.00, description: 'Ride - E-Scooter #3', date: '2025-11-04', time: '14:30' },
  { id: 2, type: 'credit', amount: 500.00, description: 'Wallet Top-up', date: '2025-11-03', time: '10:15' },
  { id: 3, type: 'debit', amount: 123.00, description: 'Ride - E-Bike #7', date: '2025-11-02', time: '18:45' },
  { id: 4, type: 'debit', amount: 62.00, description: 'Ride - E-Scooter #1', date: '2025-11-01', time: '09:20' },
  { id: 5, type: 'credit', amount: 250.00, description: 'Wallet Top-up', date: '2025-10-30', time: '16:00' },
];

export function WalletScreen({ onBack }: WalletScreenProps) {
  const [balance] = useState(1234.50);
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAddMoney = () => {
    if (amount) {
      toast.success(`₹${amount} added to wallet`);
      setOpen(false);
      setAmount('');
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white">My Wallet</h2>
          <div className="w-10" />
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon className="w-5 h-5 text-[#A6FF00]" />
              <span className="text-white/80">Current Balance</span>
            </div>
            <p className="text-white text-4xl mb-4">₹{balance.toFixed(2)}</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#A6FF00] text-[#1E1E1E] hover:bg-[#95ee00] rounded-2xl h-12">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[320px] rounded-3xl">
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
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 250, 500].map((val) => (
                      <Button
                        key={val}
                        variant="outline"
                        onClick={() => setAmount(val.toString())}
                        className="rounded-xl"
                      >
                        ₹{val}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={handleAddMoney}
                    className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-2xl h-12"
                  >
                    Add Money
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </motion.div>
      </div>

      {/* Spending Summary */}
      <div className="px-6 py-4 -mt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 rounded-2xl border-2 grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-gray-500">Total Spent</span>
              </div>
              <p className="text-[#1E1E1E] text-xl">₹{totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-gray-500">This Month</span>
              </div>
              <p className="text-[#1E1E1E] text-xl">₹{(totalSpent / 2).toFixed(2)}</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Transaction History */}
      <div className="flex-1 px-6 overflow-auto pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#1E1E1E]">Transaction History</h3>
          <Button variant="link" className="text-[#007BFF] p-0">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 rounded-2xl border-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        transaction.type === 'debit'
                          ? 'bg-red-50'
                          : 'bg-green-50'
                      }`}
                    >
                      {transaction.type === 'debit' ? (
                        <ArrowUpRight className="w-6 h-6 text-red-500" />
                      ) : (
                        <ArrowDownLeft className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-[#1E1E1E]">{transaction.description}</p>
                      <p className="text-gray-500">{transaction.date} • {transaction.time}</p>
                    </div>
                  </div>
                  <p
                    className={`text-lg ${
                      transaction.type === 'debit'
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  >
                    {transaction.type === 'debit' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
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
