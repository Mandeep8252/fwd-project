import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, Mail, Phone, ChevronDown, Shield, Bike, CreditCard, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner@2.0.3';

interface SupportScreenProps {
  onBack: () => void;
}

const faqs = [
  { question: 'How do I unlock a bike or scooter?', answer: 'You can unlock a vehicle by scanning the QR code on it, tapping with NFC, or entering the vehicle code manually in the app.' },
  { question: 'What if I have an issue during my ride?', answer: 'If you encounter any problems during your ride, use the "Report Issue" button in the app or contact our 24/7 support team immediately.' },
  { question: 'How is the fare calculated?', answer: 'Fares are calculated based on the duration of your ride. There\'s a base unlock fee plus a per-minute charge. You can see the rates in the app before starting your ride.' },
  { question: 'What should I do if the vehicle is damaged?', answer: 'Please report any damage through the app before starting your ride. This helps us maintain our fleet and ensures you won\'t be charged for pre-existing damage.' },
  { question: 'Can I pause my ride?', answer: 'Yes, you can pause your ride by locking the vehicle. The timer will continue but at a reduced rate. When you\'re ready to continue, simply unlock it again.' },
];

const safetyTips = [
  'Always wear a helmet while riding',
  'Follow traffic rules and signals',
  'Use bike lanes when available',
  'Check the vehicle condition before riding',
  'Park in designated areas only',
];

export function SupportScreen({ onBack }: SupportScreenProps) {
  const handleChat = () => toast.success('Opening chat support...');
  const handleEmail = () => toast.success('Opening email client...');
  const handleCall = () => toast.success('Calling support...');

  return (
    <div className="relative w-full h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#0056b3] px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-white text-lg font-semibold">Help & Support</h2>
          <div className="w-10" />
        </div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-white/80 text-center text-sm">
          We're here to help you 24/7
        </motion.p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-auto pb-6">
        {/* Contact Options */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3 mb-6">
          <Button onClick={handleChat} className="h-auto py-4 flex flex-col gap-2 bg-gradient-to-br from-[#007BFF] to-[#0056b3] hover:from-[#0056b3] hover:to-[#003d82] rounded-2xl">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button onClick={handleEmail} variant="outline" className="h-auto py-4 flex flex-col gap-2 border-2 rounded-2xl">
            <Mail className="w-6 h-6 text-[#007BFF]" />
            <span className="text-xs text-[#1E1E1E]">Email</span>
          </Button>
          <Button onClick={handleCall} variant="outline" className="h-auto py-4 flex flex-col gap-2 border-2 rounded-2xl">
            <Phone className="w-6 h-6 text-[#007BFF]" />
            <span className="text-xs text-[#1E1E1E]">Call</span>
          </Button>
        </motion.div>

        {/* FAQ Section */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <h3 className="text-[#1E1E1E] mb-4 flex items-center gap-2 font-semibold">
            <HelpCircle className="w-5 h-5 text-[#007BFF]" /> Frequently Asked Questions
          </h3>
          <Card className="rounded-3xl border-2 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50 text-left text-[#1E1E1E]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </motion.div>

        {/* Safety Tips */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
          <h3 className="text-[#1E1E1E] mb-4 flex items-center gap-2 font-semibold">
            <Shield className="w-5 h-5 text-[#A6FF00]" /> Safety & Riding Tips
          </h3>
          <Card className="p-4 rounded-3xl border-2">
            <div className="space-y-3">
              {safetyTips.map((tip, idx) => (
                <motion.div key={idx} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + idx * 0.05 }} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#A6FF00]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#A6FF00] rounded-full" />
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="text-[#1E1E1E] mb-4 font-semibold">Quick Links</h3>
          <div className="space-y-2">
            {[
              { icon: Bike, label: 'How to Ride' },
              { icon: CreditCard, label: 'Payment & Billing' }
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <Card key={idx} className="p-4 rounded-2xl border-2 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#007BFF]/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#007BFF]" />
                    </div>
                    <span className="text-[#1E1E1E]">{link.label}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
