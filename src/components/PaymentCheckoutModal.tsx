import React, { useState, useEffect } from 'react';
import { BusinessProfile, PaymentMethodItem, PaymentMethodType } from '../types';
import { 
  Smartphone, Building2, CreditCard, CheckCircle, Clock, AlertCircle, 
  X, ShieldCheck, Copy, ArrowRight, ArrowLeft, Send, Hash, Check, Phone,
  HelpCircle, UserCheck
} from 'lucide-react';

export interface PaymentSubmissionData {
  paymentMethod: PaymentMethodType | string;
  paymentMethodName: string;
  transactionReference: string;
  paidFromPhone?: string;
  notes?: string;
}

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;
  businessProfile: BusinessProfile;
  orderNumber?: string;
  onPaymentSubmitted: (data: PaymentSubmissionData) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  customerPhone,
  customerName,
  customerEmail,
  businessProfile,
  orderNumber = `RIS-${Math.floor(1000 + Math.random() * 9000)}`,
  onPaymentSubmitted,
}) => {
  // Available active payment methods from business profile (or fallback defaults)
  const activeMethods: PaymentMethodItem[] = (
    businessProfile.paymentMethods && businessProfile.paymentMethods.length > 0
      ? businessProfile.paymentMethods.filter((pm) => pm.isActive)
      : [
          {
            id: 'pm-sendmoney',
            type: 'send_money',
            name: 'M-Pesa Send Money',
            isActive: true,
            phoneNumber: businessProfile.sendMoneyPhone || businessProfile.phones[0] || '0728090599',
            recipientName: businessProfile.sendMoneyName || `${businessProfile.name} (Direct Line)`,
            description: 'Direct Safaricom M-Pesa transfer to merchant number',
          },
          {
            id: 'pm-paybill',
            type: 'paybill',
            name: 'M-Pesa Paybill',
            isActive: true,
            paybillNumber: businessProfile.paybillNumber || '247247',
            accountNumber: businessProfile.paybillAccount || businessProfile.phones[0] || '0728090599',
            accountName: businessProfile.name,
            description: 'Lipa na M-Pesa Paybill business number',
          },
          {
            id: 'pm-till',
            type: 'till_number',
            name: 'M-Pesa Buy Goods Till',
            isActive: true,
            tillNumber: businessProfile.tillNumber || '5428901',
            tillName: businessProfile.name,
            description: 'Zero transaction fee Buy Goods Till',
          },
          {
            id: 'pm-bank',
            type: 'bank_transfer',
            name: 'Bank Transfer',
            isActive: true,
            bankName: businessProfile.bankName || 'KCB Bank Kenya',
            accountName: businessProfile.bankAccountName || `${businessProfile.name} Limited`,
            accountNumber: businessProfile.bankAccountNumber || '1289405821',
            branchName: businessProfile.bankBranch || 'Kipande House Branch',
            description: 'Pesalink / EFT / Mobile Bank Transfer',
          },
        ]
  );

  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'submitted'>('selection');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodItem | null>(null);

  // Form inputs based on method
  const [paidFromPhone, setPaidFromPhone] = useState(customerPhone || '');
  const [transactionCode, setTransactionCode] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('selection');
      setSelectedMethod(null);
      setPaidFromPhone(customerPhone || '');
      setTransactionCode('');
      setBankReference('');
      setExtraNotes('');
      setValidationError(null);
      setCopyFeedback(null);
    }
  }, [isOpen, customerPhone]);

  if (!isOpen) return null;

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleSelectMethod = (method: PaymentMethodItem) => {
    setSelectedMethod(method);
    setValidationError(null);
    setCurrentStep('details');
  };

  const handleConfirmPaymentSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) return;

    if (selectedMethod.type === 'send_money') {
      if (!paidFromPhone.trim() || paidFromPhone.trim().length < 9) {
        setValidationError('Please enter the phone number you paid from (e.g. 0722123456).');
        return;
      }
      if (!transactionCode.trim() || transactionCode.trim().length < 6) {
        setValidationError('M-Pesa Confirmation Code is MANDATORY. Please enter the transaction code from your Safaricom SMS (e.g. SKH8920141).');
        return;
      }
      onPaymentSubmitted({
        paymentMethod: 'send_money',
        paymentMethodName: selectedMethod.name,
        transactionReference: transactionCode.trim().toUpperCase(),
        paidFromPhone: paidFromPhone.trim(),
        notes: extraNotes.trim() || `Paid from phone: ${paidFromPhone.trim()}`,
      });
      setCurrentStep('submitted');
    } else if (selectedMethod.type === 'paybill') {
      if (!transactionCode.trim() || transactionCode.trim().length < 6) {
        setValidationError('M-Pesa Confirmation Code is MANDATORY. Please enter your Safaricom confirmation code (e.g. SKH8920141).');
        return;
      }
      onPaymentSubmitted({
        paymentMethod: 'paybill',
        paymentMethodName: selectedMethod.name,
        transactionReference: transactionCode.trim().toUpperCase(),
        notes: extraNotes.trim() || `Paybill: ${selectedMethod.paybillNumber} (A/C ${selectedMethod.accountNumber})`,
      });
      setCurrentStep('submitted');
    } else if (selectedMethod.type === 'till_number') {
      if (!transactionCode.trim() || transactionCode.trim().length < 6) {
        setValidationError('M-Pesa Confirmation Code is MANDATORY. Please enter your Safaricom confirmation code (e.g. SKH8920141).');
        return;
      }
      onPaymentSubmitted({
        paymentMethod: 'till_number',
        paymentMethodName: selectedMethod.name,
        transactionReference: transactionCode.trim().toUpperCase(),
        notes: extraNotes.trim() || `Till No: ${selectedMethod.tillNumber}`,
      });
      setCurrentStep('submitted');
    } else if (selectedMethod.type === 'bank_transfer') {
      if (!bankReference.trim() || bankReference.trim().length < 4) {
        setValidationError('Bank Transfer Reference is MANDATORY. Please enter your bank transfer reference or slip ID.');
        return;
      }
      onPaymentSubmitted({
        paymentMethod: 'bank_transfer',
        paymentMethodName: selectedMethod.name,
        transactionReference: bankReference.trim().toUpperCase(),
        notes: extraNotes.trim() || `Bank: ${selectedMethod.bankName} - A/C ${selectedMethod.accountNumber}`,
      });
      setCurrentStep('submitted');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn text-white">
      <div 
        id="payment-checkout-modal"
        className="relative bg-[#111111] text-white w-full max-w-xl border border-zinc-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-zinc-800 bg-[#0a0a0a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {businessProfile.profilePicture ? (
              <img
                src={businessProfile.profilePicture}
                alt={businessProfile.name}
                className="w-10 h-10 object-cover rounded-full border-2 border-orange-500 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-orange-500 text-black flex items-center justify-center font-black rounded-full shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  {businessProfile.name}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  Verified Seller
                </span>
              </div>
              <h3 className="text-lg font-black uppercase font-display text-white">
                {currentStep === 'selection' && 'Select Payment Method'}
                {currentStep === 'details' && (selectedMethod?.name || 'Payment Details')}
                {currentStep === 'submitted' && 'Payment Submitted'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Amount Banner */}
        <div className="px-5 py-3 bg-[#050505] border-b border-zinc-800/80 flex items-center justify-between text-xs shrink-0">
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">
              Total Order Payable:
            </span>
            <span className="text-xl font-black text-white font-mono">
              KES {totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">
              Customer / Phone:
            </span>
            <span className="text-zinc-300 font-bold text-xs">
              {customerName} • {customerPhone}
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* STEP 1: PAYMENT METHOD SELECTION */}
          {currentStep === 'selection' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h4 className="text-sm font-black uppercase text-white font-display">
                  Choose how you would like to pay:
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select your preferred Kenyan payment channel to view official merchant payment details.
                </p>
              </div>

              {activeMethods.length === 0 ? (
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-orange-500 mx-auto" />
                  <p className="text-xs text-zinc-300">
                    No active payment channels configured by administrator.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeMethods.map((pm) => {
                    const isSendMoney = pm.type === 'send_money';
                    const isPaybill = pm.type === 'paybill';
                    const isTill = pm.type === 'till_number';
                    const isBank = pm.type === 'bank_transfer';

                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => handleSelectMethod(pm)}
                        className="p-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/80 text-left flex flex-col justify-between transition-all group cursor-pointer"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className={`w-9 h-9 flex items-center justify-center font-black ${
                              isSendMoney ? 'bg-emerald-500 text-black' :
                              isPaybill ? 'bg-orange-500 text-black' :
                              isTill ? 'bg-emerald-400 text-black' :
                              'bg-blue-500 text-white'
                            }`}>
                              {isSendMoney && <Send className="w-4 h-4" />}
                              {isPaybill && <Smartphone className="w-4 h-4" />}
                              {isTill && <Hash className="w-4 h-4" />}
                              {isBank && <Building2 className="w-4 h-4" />}
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-black/60 border border-zinc-700 text-zinc-400 group-hover:text-orange-400 font-bold uppercase">
                              {isSendMoney && 'Send Money'}
                              {isPaybill && 'Paybill'}
                              {isTill && 'Buy Goods'}
                              {isBank && 'Bank A/C'}
                            </span>
                          </div>

                          <div>
                            <span className="text-sm font-black uppercase text-white font-display block group-hover:text-orange-400 transition-colors">
                              {pm.name}
                            </span>
                            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                              {pm.description || (
                                isSendMoney ? `Pay to ${pm.phoneNumber || businessProfile.phones[0]}` :
                                isPaybill ? `Paybill ${pm.paybillNumber || '247247'} (A/C ${pm.accountNumber || '0728090599'})` :
                                isTill ? `Till Number ${pm.tillNumber || '5428901'}` :
                                `${pm.bankName || 'KCB Bank'} Account Transfer`
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-bold text-orange-500 group-hover:translate-x-1 transition-transform">
                          <span>Pay KES {totalAmount.toLocaleString()}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Direct Support Notice */}
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-[11px]">Need payment help or custom invoice? Call <strong>{businessProfile.phones[0]}</strong></span>
                </div>
                <a
                  href={`https://wa.me/${businessProfile.whatsapp}?text=Hello%20${encodeURIComponent(businessProfile.name)},%20I%20need%20assistance%20paying%20for%20order%20KES%20${totalAmount}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase text-[10px] tracking-wider transition-colors shrink-0"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD DETAILS & CUSTOMER INPUT */}
          {currentStep === 'details' && selectedMethod && (
            <form onSubmit={handleConfirmPaymentSubmission} className="space-y-5 animate-fadeIn">
              {/* Back button */}
              <button
                type="button"
                onClick={() => setCurrentStep('selection')}
                className="text-xs font-bold text-zinc-400 hover:text-orange-500 flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Payment Method</span>
              </button>

              {/* 1. Send Money Detail View */}
              {selectedMethod.type === 'send_money' && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Send className="w-4 h-4" />
                        <span>M-Pesa Send Money Details</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => triggerCopy(selectedMethod.phoneNumber || businessProfile.sendMoneyPhone || businessProfile.phones[0] || '0728090599', 'phone')}
                        className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copyFeedback === 'phone' ? 'Copied Number!' : 'Copy Phone Number'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block">
                          Recipient Phone Number
                        </span>
                        <span className="text-2xl font-black font-mono text-emerald-400">
                          {selectedMethod.phoneNumber || businessProfile.sendMoneyPhone || businessProfile.phones[0] || '0728090599'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block">
                          Recipient Name
                        </span>
                        <span className="text-xs font-bold text-white">
                          {selectedMethod.recipientName || businessProfile.sendMoneyName || businessProfile.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1.5 pt-1">
                      <p className="font-bold text-zinc-200">Payment Steps:</p>
                      <p>1. Open SIM Toolkit or Safaricom M-Pesa App &rarr; Select <strong>Send Money</strong></p>
                      <p>2. Enter Phone Number: <strong className="text-emerald-400 font-mono">{selectedMethod.phoneNumber || businessProfile.phones[0] || '0728090599'}</strong></p>
                      <p>3. Enter Exact Amount: <strong className="text-white font-mono">KES {totalAmount.toLocaleString()}</strong></p>
                      <p>4. Enter your PIN and send funds.</p>
                    </div>
                  </div>

                  {/* Customer Input: Phone Number they paid FROM */}
                  <div className="space-y-3 p-4 bg-zinc-900/60 border border-zinc-800">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                        Your Paying Phone Number (Paying FROM) <span className="text-red-400">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={paidFromPhone}
                        onChange={(e) => {
                          setPaidFromPhone(e.target.value);
                          setValidationError(null);
                        }}
                        placeholder="e.g. 0722123456 or 254722123456"
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                      />
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Enter the exact Safaricom number used to send the payment so our accounts team can verify your transaction instantly.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white mb-1">
                        M-Pesa Transaction Code <span className="text-red-400">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={transactionCode}
                        onChange={(e) => {
                          setTransactionCode(e.target.value.toUpperCase());
                          setValidationError(null);
                        }}
                        placeholder="e.g. SKH9203841"
                        maxLength={12}
                        className="w-full p-2.5 bg-zinc-950 border border-zinc-800 text-white font-mono uppercase tracking-widest text-sm focus:outline-none focus:border-orange-500"
                      />
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Enter the 10-character confirmation code from your Safaricom M-Pesa SMS receipt.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Paybill Detail View */}
              {selectedMethod.type === 'paybill' && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-black tracking-wider text-orange-400 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4" />
                        <span>M-Pesa Paybill Instructions</span>
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => triggerCopy(selectedMethod.paybillNumber || businessProfile.paybillNumber || '247247', 'paybill')}
                          className="text-[11px] font-bold text-orange-500 hover:underline cursor-pointer"
                        >
                          {copyFeedback === 'paybill' ? 'Copied Paybill!' : 'Copy Paybill'}
                        </button>
                        <span className="text-zinc-600">|</span>
                        <button
                          type="button"
                          onClick={() => triggerCopy(selectedMethod.accountNumber || businessProfile.paybillAccount || businessProfile.phones[0] || '0728090599', 'acc')}
                          className="text-[11px] font-bold text-orange-500 hover:underline cursor-pointer"
                        >
                          {copyFeedback === 'acc' ? 'Copied Account!' : 'Copy A/C'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-zinc-900 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block">
                          Paybill Business No:
                        </span>
                        <span className="text-2xl font-black font-mono text-white">
                          {selectedMethod.paybillNumber || businessProfile.paybillNumber || '247247'}
                        </span>
                      </div>
                      <div className="p-3 bg-zinc-900 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block">
                          Account Number:
                        </span>
                        <span className="text-xl font-black font-mono text-orange-400">
                          {selectedMethod.accountNumber || businessProfile.paybillAccount || businessProfile.phones[0] || '0728090599'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1.5 pt-1">
                      <p className="font-bold text-zinc-200">Paybill Steps:</p>
                      <p>1. Open M-Pesa &rarr; <strong>Lipa Na M-PESA</strong> &rarr; <strong>Paybill</strong></p>
                      <p>2. Enter Business Number: <strong className="text-white font-mono">{selectedMethod.paybillNumber || '247247'}</strong></p>
                      <p>3. Enter Account Number: <strong className="text-orange-400 font-mono">{selectedMethod.accountNumber || '0728090599'}</strong></p>
                      <p>4. Enter Amount: <strong className="text-white font-mono">KES {totalAmount.toLocaleString()}</strong> and your PIN</p>
                    </div>
                  </div>

                  {/* Customer Input: M-Pesa Transaction Code */}
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-white">
                      Enter M-Pesa Confirmation Code <span className="text-red-400">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionCode}
                      onChange={(e) => {
                        setTransactionCode(e.target.value.toUpperCase());
                        setValidationError(null);
                      }}
                      placeholder="e.g. SKH9203841"
                      maxLength={12}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 text-white font-mono font-bold uppercase tracking-widest text-lg text-center focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-[11px] text-zinc-400">
                      Copy &amp; paste the 10-character transaction code from your Safaricom confirmation SMS.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Till Number Detail View */}
              {selectedMethod.type === 'till_number' && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Hash className="w-4 h-4" />
                        <span>Buy Goods &amp; Services Till</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => triggerCopy(selectedMethod.tillNumber || businessProfile.tillNumber || '5428901', 'till')}
                        className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copyFeedback === 'till' ? 'Copied Till!' : 'Copy Till Number'}</span>
                      </button>
                    </div>

                    <div className="p-4 bg-zinc-900 border border-zinc-800 text-center space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block">
                        Official Merchant Till Number
                      </span>
                      <span className="text-3xl font-black font-mono tracking-widest text-emerald-400 block">
                        {selectedMethod.tillNumber || businessProfile.tillNumber || '5428901'}
                      </span>
                      <span className="text-xs text-zinc-400 font-bold block">
                        {selectedMethod.tillName || businessProfile.name}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1.5 pt-1">
                      <p className="font-bold text-zinc-200">Till Payment Steps:</p>
                      <p>1. Open M-Pesa &rarr; <strong>Lipa Na M-PESA</strong> &rarr; <strong>Buy Goods and Services</strong></p>
                      <p>2. Enter Till Number: <strong className="text-emerald-400 font-mono">{selectedMethod.tillNumber || '5428901'}</strong></p>
                      <p>3. Enter Amount: <strong className="text-white font-mono">KES {totalAmount.toLocaleString()}</strong> and enter PIN</p>
                    </div>
                  </div>

                  {/* Customer Input: M-Pesa Transaction Code */}
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-white">
                      Enter M-Pesa Confirmation Code <span className="text-red-400">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionCode}
                      onChange={(e) => {
                        setTransactionCode(e.target.value.toUpperCase());
                        setValidationError(null);
                      }}
                      placeholder="e.g. SKH9203841"
                      maxLength={12}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 text-white font-mono font-bold uppercase tracking-widest text-lg text-center focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-zinc-400">
                      Enter the 10-character code received from Safaricom (e.g. SKH892341).
                    </p>
                  </div>
                </div>
              )}

              {/* 4. Bank Transfer Detail View */}
              {selectedMethod.type === 'bank_transfer' && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-black tracking-wider text-blue-400 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>Official Corporate Bank Account</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => triggerCopy(`${selectedMethod.bankName || 'KCB Bank'} - A/C ${selectedMethod.accountNumber || '1289405821'} (${selectedMethod.accountName || businessProfile.name})`, 'bank')}
                        className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copyFeedback === 'bank' ? 'Copied Details!' : 'Copy Bank Info'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-zinc-900 border border-zinc-800 space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                        <span className="text-zinc-500 uppercase">Bank Name:</span>
                        <span className="font-bold text-white">{selectedMethod.bankName || businessProfile.bankName || 'KCB Bank Kenya'}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                        <span className="text-zinc-500 uppercase">Account Name:</span>
                        <span className="font-bold text-white">{selectedMethod.accountName || businessProfile.bankAccountName || `${businessProfile.name} Limited`}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                        <span className="text-zinc-500 uppercase">Account Number:</span>
                        <span className="font-bold text-blue-400 text-sm">{selectedMethod.accountNumber || businessProfile.bankAccountNumber || '1289405821'}</span>
                      </div>
                      {selectedMethod.branchName && (
                        <div className="flex justify-between">
                          <span className="text-zinc-500 uppercase">Branch:</span>
                          <span className="font-bold text-zinc-300">{selectedMethod.branchName}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1 pt-1">
                      <p>• Transfer <strong className="text-white">KES {totalAmount.toLocaleString()}</strong> via Mobile Banking App, Pesalink, EFT or RTGS.</p>
                      <p>• Use your order phone <strong>{customerPhone}</strong> or name <strong>{customerName}</strong> as the payment description/reference.</p>
                    </div>
                  </div>

                  {/* Customer Input: Bank Reference / Slip */}
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-white">
                      Bank Reference / Transfer Confirmation / Slip ID <span className="text-red-400">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={bankReference}
                      onChange={(e) => {
                        setBankReference(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="e.g. KCB-TX-990214 or Pesalink Ref #89320"
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 text-white font-mono font-bold tracking-wider text-sm focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[11px] text-zinc-400">
                      Enter the bank transaction reference number or deposit slip reference code.
                    </p>
                  </div>
                </div>
              )}

              {/* Validation error display */}
              {validationError && (
                <div className="p-3 bg-red-950/80 border border-red-500 text-red-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xl"
                >
                  <Check className="w-5 h-5" />
                  <span>
                    {selectedMethod.type === 'send_money' ? "I've Sent Payment (Confirm Order)" : "Confirm Payment Submitted"}
                  </span>
                </button>
                <p className="text-[10px] text-center text-zinc-500 uppercase tracking-wider mt-2 font-bold">
                  Order status will be set to "Payment Pending Verification" for merchant review.
                </p>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT SUBMITTED — PENDING VERIFICATION */}
          {currentStep === 'submitted' && (
            <div className="py-4 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 border-2 border-amber-500/50 flex items-center justify-center mx-auto rounded-full">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase tracking-widest inline-block">
                  Payment Pending Verification
                </span>
                <h4 className="text-2xl font-black uppercase text-white font-display mt-2">
                  Payment Submitted Successfully!
                </h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto mt-1.5 leading-relaxed">
                  Thank you, <strong className="text-white">{customerName}</strong>. Your payment confirmation has been submitted to <strong className="text-orange-400">{businessProfile.name}</strong> accounts team.
                </p>
              </div>

              {/* Status explanation card */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 text-left space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    <strong className="text-white">What happens next:</strong> Our manager will verify the payment on our statement/M-Pesa balance and mark the order as <strong>"Confirmed &amp; Processing"</strong>. You will receive an SMS/WhatsApp and Email update once verified.
                  </p>
                </div>

                <div className="p-3 bg-zinc-900 border border-zinc-800 space-y-2 font-mono text-zinc-300 text-[11px]">
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-500 uppercase">Order Number:</span>
                    <span className="font-bold text-white">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-500 uppercase">Payment Channel:</span>
                    <span className="font-bold text-orange-400">{selectedMethod?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span className="text-zinc-500 uppercase">
                      {selectedMethod?.type === 'send_money' ? 'Paid From Number:' : 'Transaction Reference:'}
                    </span>
                    <span className="font-bold text-emerald-400">
                      {selectedMethod?.type === 'send_money' ? paidFromPhone : (transactionCode || bankReference)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 uppercase">Total Amount:</span>
                    <span className="font-bold text-white">KES {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Contact / WhatsApp instant expedited verification */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${businessProfile.whatsapp}?text=Hello%20${encodeURIComponent(businessProfile.name)},%20I%20have%20submitted%20payment%20of%20KES%20${totalAmount}%20for%20Order%20${orderNumber}%20via%20${selectedMethod?.name}.%20Ref:%20${selectedMethod?.type === 'send_money' ? paidFromPhone : (transactionCode || bankReference)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Notify via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-tighter cursor-pointer transition-colors"
                >
                  View Store &amp; Orders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
