import React, { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/initialData';
import { Smartphone, CheckCircle, Clock, AlertCircle, X, ShieldCheck, Copy, ArrowRight } from 'lucide-react';

interface MpesaCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  customerPhone: string;
  customerName: string;
  onPaymentSuccess: (receiptNumber: string, extraNotes?: string) => void;
}

export const MpesaCheckoutModal: React.FC<MpesaCheckoutModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  customerPhone,
  customerName,
  onPaymentSuccess,
}) => {
  const [stage, setStage] = useState<'prompting' | 'manual' | 'success'>('prompting');
  const [countdown, setCountdown] = useState(15);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [copiedTill, setCopiedTill] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStage('prompting');
      setCountdown(15);
      setReceiptNumber('');
      setManualCode('');
      return;
    }

    // Generate random realistic Safaricom transaction code
    const generatedReceipt = `SKH${Math.floor(100000 + Math.random() * 900000)}`;
    setReceiptNumber(generatedReceipt);

    // Countdown simulation for STK push
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStage('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyTill = () => {
    navigator.clipboard.writeText(BUSINESS_INFO.tillNumber);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2000);
  };

  const handleManualConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim() || manualCode.trim().length < 8) {
      alert('Please enter a valid 10-character M-Pesa transaction code (e.g. SKH892341)');
      return;
    }
    setReceiptNumber(manualCode.toUpperCase());
    setStage('success');
  };

  const handleFinalDone = () => {
    onPaymentSuccess(receiptNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
      <div 
        id="mpesa-checkout-modal"
        className="relative bg-[#111111] text-white w-full max-w-lg border border-zinc-800 shadow-2xl p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 text-black flex items-center justify-center font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Lipa Na M-PESA
              </span>
              <h3 className="text-xl font-black uppercase font-display text-white">
                Safaricom Secure Checkout
              </h3>
            </div>
          </div>

          {stage !== 'prompting' && (
            <button
              onClick={onClose}
              className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 flex items-center justify-center border border-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stage 1: STK Push in Progress */}
        {stage === 'prompting' && (
          <div className="py-6 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
              <span className="text-xl font-black font-mono text-emerald-400">{countdown}s</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase text-white font-display">
                STK Push Sent to Your Phone!
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Please unlock phone <strong className="text-emerald-400 font-mono">{customerPhone}</strong> and enter your M-Pesa PIN to complete payment of <strong className="text-white">Ksh {totalAmount.toLocaleString()}</strong> to <strong className="text-orange-400">{BUSINESS_INFO.name}</strong>.
              </p>
            </div>

            <div className="bg-[#050505] p-4 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-zinc-500">Till Number:</span>
                <span className="font-bold text-white">{BUSINESS_INFO.tillNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Amount:</span>
                <span className="font-bold text-emerald-400">KES {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Customer:</span>
                <span className="font-bold text-white">{customerName}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStage('manual')}
                className="text-xs font-black uppercase tracking-wider text-orange-500 hover:underline cursor-pointer"
              >
                Didn't receive prompt? Pay Manually with Till Number &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Manual Till Payment */}
        {stage === 'manual' && (
          <form onSubmit={handleManualConfirm} className="py-6 space-y-5">
            <div className="p-4 bg-[#050505] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black tracking-wider text-zinc-400">
                  Buy Goods Till Number:
                </span>
                <button
                  type="button"
                  onClick={handleCopyTill}
                  className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTill ? 'Copied!' : 'Copy Till'}</span>
                </button>
              </div>

              <div className="text-3xl font-black font-mono tracking-widest text-center py-2 bg-zinc-900 text-emerald-400 border border-zinc-800">
                {BUSINESS_INFO.tillNumber}
              </div>

              <div className="text-[11px] text-zinc-400 space-y-1">
                <p>1. Open SIM Toolkit or M-Pesa App &rarr; <strong>Lipa Na M-PESA</strong></p>
                <p>2. Select <strong>Buy Goods and Services</strong> &rarr; Enter <strong>{BUSINESS_INFO.tillNumber}</strong></p>
                <p>3. Enter Amount: <strong className="text-white">KES {totalAmount.toLocaleString()}</strong> &amp; your PIN</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                Enter M-Pesa Confirmation Code (10 chars):
              </label>
              <input
                type="text"
                required
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="e.g. SKH9203841"
                maxLength={10}
                className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold uppercase tracking-widest text-center text-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStage('prompting')}
                className="w-1/3 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-black uppercase text-xs border border-zinc-800 cursor-pointer"
              >
                Back to STK
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-tighter text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Verify Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Stage 3: Payment Success & Order Receipt */}
        {stage === 'success' && (
          <div className="py-6 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-emerald-400 font-black uppercase text-xs tracking-widest block">
                Payment Confirmed
              </span>
              <h4 className="text-2xl font-black uppercase text-white font-display mt-1">
                Order Placed Successfully!
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Thank you, {customerName}. Your auto parts are being processed for collection / dispatch.
              </p>
            </div>

            {/* Official Digital Receipt Card */}
            <div className="p-4 bg-[#050505] border border-zinc-800 text-xs font-mono text-zinc-300 space-y-2 text-left">
              <div className="flex justify-between pb-1 border-b border-zinc-800">
                <span className="text-zinc-500 uppercase">M-Pesa Receipt:</span>
                <span className="font-bold text-emerald-400">{receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase">Amount Paid:</span>
                <span className="font-bold text-white">KES {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase">Merchant:</span>
                <span className="font-bold text-white">{BUSINESS_INFO.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase">Counter Hotline:</span>
                <span className="font-bold text-orange-400">{BUSINESS_INFO.phones[0]}</span>
              </div>
            </div>

            <button
              onClick={handleFinalDone}
              className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-sm transition-colors cursor-pointer"
            >
              Continue / View Store Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
