import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Nfc, Hash, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface ScanScreenProps {
  onUnlock: () => void;
  onBack: () => void;
}

export function ScanScreen({ onUnlock, onBack }: ScanScreenProps) {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setUnlocked(true);
      setTimeout(() => {
        onUnlock();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-white text-lg font-medium">Unlock Vehicle</h2>
        <div className="w-10" />
      </div>

      {/* Camera / Scanner */}
      <div className="flex-1 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 opacity-50" />

        {!unlocked ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* QR Scan Frame */}
            <div className="relative w-64 h-64">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#A6FF00] rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#A6FF00] rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#A6FF00] rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#A6FF00] rounded-br-3xl" />

              {isScanning && (
                <motion.div
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-1 bg-[#A6FF00] shadow-lg shadow-[#A6FF00]/50 rounded"
                />
              )}
            </div>

            <p className="text-white text-center mt-6">Position the QR code within the frame</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-[#A6FF00] rounded-full flex items-center justify-center mb-4">
              <Check className="w-12 h-12 text-[#1E1E1E]" strokeWidth={3} />
            </div>
            <p className="text-white text-xl font-medium">Unlocked!</p>
            <p className="text-white/70 mt-2 text-center">Starting your ride...</p>
          </motion.div>
        )}
      </div>

      {/* Bottom Actions */}
      {!unlocked && (
        <div className="relative z-10 bg-white rounded-t-3xl px-6 py-6 space-y-3">
          {!showManualEntry ? (
            <>
              <Button
                onClick={handleScan}
                disabled={isScanning}
                className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-2xl h-14 flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isScanning ? 'Scanning...' : 'Scan QR Code'}
              </Button>

              <Button
                onClick={handleScan}
                disabled={isScanning}
                variant="outline"
                className="w-full border-2 border-[#A6FF00] text-[#1E1E1E] hover:bg-[#A6FF00]/10 rounded-2xl h-14 flex items-center justify-center"
              >
                <Nfc className="w-5 h-5 mr-2" />
                Tap to Unlock via NFC
              </Button>

              <Button
                onClick={() => setShowManualEntry(true)}
                variant="ghost"
                className="w-full text-gray-600 rounded-2xl h-12 flex items-center justify-center"
              >
                <Hash className="w-4 h-4 mr-2" />
                Enter Code Manually
              </Button>
            </>
          ) : (
            <Card className="p-4 rounded-2xl border-2 space-y-4">
              <div className="space-y-2">
                <label className="text-[#1E1E1E] font-medium">Vehicle Code</label>
                <Input
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="h-12 rounded-xl text-center text-lg tracking-widest"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowManualEntry(false)}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleScan}
                  className="flex-1 bg-[#007BFF] hover:bg-[#0056b3] text-white rounded-xl"
                >
                  Unlock
                </Button>
              </div>
            </Card>
          )}

          <p className="text-center text-gray-500 mt-4 text-sm">
            Make sure the vehicle is in good condition before unlocking
          </p>
        </div>
      )}
    </div>
  );
}
