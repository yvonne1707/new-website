import React, { useState } from 'react';
import { Order, BusinessProfile } from '../types';
import { X, Printer, Mail, CheckCircle2, Truck, ShieldCheck, Download, Share2, Phone, MapPin, Calendar, Clock } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  businessProfile: BusinessProfile;
  onClose: () => void;
  onSendEmailNotification?: (orderId: string, email: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  businessProfile,
  onClose,
  onSendEmailNotification,
}) => {
  const [emailInput, setEmailInput] = useState(order?.customerEmail || '');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(order?.emailNotificationSent || false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    if (!emailInput.trim()) return;
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSentSuccess(true);
      if (onSendEmailNotification) {
        onSendEmailNotification(order.id, emailInput.trim());
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn text-white">
      <div className="relative w-full max-w-2xl bg-[#111] border border-zinc-700 shadow-2xl my-auto overflow-hidden">
        {/* Top Control Bar - Screen only */}
        <div className="print:hidden bg-[#050505] p-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-orange-500 text-black font-black text-[10px] uppercase tracking-wider">
              Official Digital Receipt
            </span>
            <span className="text-xs font-mono font-bold text-zinc-400">
              #{order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white hover:bg-orange-500 text-black font-black text-xs uppercase tracking-tighter flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Notification Dispatch Bar (Screen Only) */}
        <div className="print:hidden bg-zinc-950 p-4 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase text-white tracking-wider">
                  Buyer Email Notification
                </p>
                <p className="text-[10px] text-zinc-400">
                  {emailSentSuccess
                    ? `Receipt & dispatch details delivered to ${order.customerEmail || emailInput}`
                    : 'Send full order receipt & transport tracking directly to buyer email'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="customer@email.com"
                className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 text-white font-mono flex-1 sm:w-48 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailInput}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-black text-xs uppercase tracking-tighter whitespace-nowrap cursor-pointer transition-colors"
              >
                {isSendingEmail ? 'Sending...' : emailSentSuccess ? 'Resend Email' : 'Send Receipt'}
              </button>
            </div>
          </div>

          {emailSentSuccess && (
            <div className="mt-2.5 p-2 bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Notification successfully dispatched to <strong>{emailInput}</strong> with M-Pesa Ref #{order.mpesaReceipt || 'CONFIRMED'}.
              </span>
            </div>
          )}
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-6 bg-[#0e0e0e] text-white print:bg-white print:text-black print:p-4">
          {/* Receipt Header */}
          <div className="border-b-2 border-dashed border-zinc-700 print:border-black pb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase font-display tracking-tighter text-white print:text-black">
                  {businessProfile.name}
                </h2>
                <p className="text-xs uppercase font-bold text-orange-500 print:text-black tracking-widest mt-0.5">
                  {businessProfile.tagline} • Genuine Auto Spares
                </p>
                <div className="text-[11px] text-zinc-400 print:text-zinc-700 mt-2 space-y-0.5 font-sans">
                  <p>📍 Kirinyaga Road (CBD) &amp; Kangundo Road (Umoja), Nairobi</p>
                  <p>📞 {businessProfile.phones.join(' / ')} | 💬 WA: +{businessProfile.whatsapp}</p>
                  <p>📧 {businessProfile.emails[0]}</p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-zinc-900 print:bg-zinc-100 p-3.5 border border-zinc-800 print:border-black/20">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 print:text-zinc-600 block">
                  Payment Status
                </span>
                <span className="text-lg font-black uppercase text-emerald-400 print:text-emerald-700 block">
                  PAID (M-PESA)
                </span>
                {order.mpesaReceipt && (
                  <span className="font-mono text-xs font-bold text-orange-400 print:text-black block mt-0.5">
                    REF: {order.mpesaReceipt}
                  </span>
                )}
                <span className="text-[10px] text-zinc-400 print:text-zinc-600 font-mono block">
                  Till: {businessProfile.tillNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Order & Customer Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 print:text-zinc-600 block">
                Receipt / Order #
              </span>
              <span className="font-mono font-black text-sm text-white print:text-black">
                {order.orderNumber}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 print:text-zinc-600 block">
                Date &amp; Time
              </span>
              <span className="font-bold text-white print:text-black">
                {order.date}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 print:text-zinc-600 block">
                Customer Name
              </span>
              <span className="font-black uppercase text-white print:text-black">
                {order.customerName}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 print:text-zinc-600 block">
                Customer Phone
              </span>
              <span className="font-mono font-bold text-white print:text-black">
                {order.customerPhone}
              </span>
            </div>
          </div>

          {/* Customer Email & Delivery Address */}
          <div className="p-3 bg-zinc-900/80 print:bg-zinc-100 border border-zinc-800 print:border-black/20 text-xs flex flex-wrap justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 print:text-zinc-600">
                Delivery Method:
              </span>{' '}
              <span className="font-black uppercase text-orange-400 print:text-black">
                {order.deliveryMethod.replace('_', ' ')}
              </span>
            </div>
            {order.customerEmail && (
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 print:text-zinc-600">
                  Email:
                </span>{' '}
                <span className="font-mono font-bold text-zinc-200 print:text-black">
                  {order.customerEmail}
                </span>
              </div>
            )}
            {order.deliveryAddress && (
              <div className="w-full text-zinc-300 print:text-black text-[11px]">
                <span className="font-bold uppercase text-zinc-500">Destination:</span> {order.deliveryAddress}
              </div>
            )}
          </div>

          {/* Transport / Courier / Matatu Sacco Dispatch Details */}
          {order.transportDetails && (
            <div className="p-4 bg-orange-500/10 print:bg-orange-50 border border-orange-500/40 print:border-orange-300 space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-500" />
                <span className="font-black uppercase text-xs tracking-wider text-orange-400 print:text-orange-900">
                  Transport &amp; Sacco Dispatch Tracking
                </span>
                <span className="px-2 py-0.5 bg-orange-500 text-black font-black text-[9px] uppercase tracking-wider ml-auto">
                  {order.transportDetails.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 print:text-zinc-600 block">
                    Courier / Matatu Sacco:
                  </span>
                  <span className="font-black text-sm text-white print:text-black">
                    {order.transportDetails.saccoOrCourier}
                  </span>
                </div>

                {order.transportDetails.vehiclePlate && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 print:text-zinc-600 block">
                      Vehicle Plate / Waybill No:
                    </span>
                    <span className="font-mono font-black text-sm text-orange-400 print:text-black">
                      {order.transportDetails.vehiclePlate}
                    </span>
                  </div>
                )}

                {order.transportDetails.destinationStage && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 print:text-zinc-600 block">
                      Arrival Stage / Office:
                    </span>
                    <span className="font-bold text-white print:text-black">
                      {order.transportDetails.destinationStage}
                    </span>
                  </div>
                )}

                {order.transportDetails.estimatedArrivalTime && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 print:text-zinc-600 block">
                      Estimated Arrival Time (ETA):
                    </span>
                    <span className="font-black text-emerald-400 print:text-emerald-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {order.transportDetails.estimatedArrivalTime}
                    </span>
                  </div>
                )}

                {order.transportDetails.driverOrOfficePhone && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 print:text-zinc-600 block">
                      Dispatch / Driver Contact Phone:
                    </span>
                    <a
                      href={`tel:${order.transportDetails.driverOrOfficePhone}`}
                      className="font-mono font-black text-orange-400 print:text-black hover:underline"
                    >
                      {order.transportDetails.driverOrOfficePhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Purchased Items Table */}
          <div className="border border-zinc-800 print:border-black overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] print:bg-zinc-100 text-zinc-400 print:text-black uppercase font-black tracking-wider text-[10px] border-b border-zinc-800 print:border-black">
                <tr>
                  <th className="px-3.5 py-2.5">Spare Part Description</th>
                  <th className="px-3.5 py-2.5 text-center">Qty</th>
                  <th className="px-3.5 py-2.5 text-right">Unit Price</th>
                  <th className="px-3.5 py-2.5 text-right">Total (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 print:divide-black/20 font-medium">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 print:hover:bg-transparent">
                    <td className="px-3.5 py-2.5">
                      <div className="font-black uppercase text-white print:text-black">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 print:text-zinc-600 font-mono">
                        Brand: {item.product.brand} | Part #: {item.product.partNumber || 'OEM Standard'}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-center font-bold font-mono">
                      {item.quantity}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono text-zinc-300 print:text-black">
                      Ksh {item.product.price.toLocaleString()}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-black text-white print:text-black">
                      Ksh {(item.product.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs border-t-2 border-zinc-800 print:border-black pt-3">
              <div className="flex justify-between text-zinc-400 print:text-zinc-600 font-bold uppercase">
                <span>Subtotal:</span>
                <span className="font-mono text-white print:text-black font-black">
                  Ksh {order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400 print:text-zinc-600 font-bold uppercase">
                <span>Delivery / Courier:</span>
                <span className="font-mono text-white print:text-black font-black">
                  {order.deliveryFee === 0 ? 'FREE' : `Ksh ${order.deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black uppercase text-white print:text-black pt-2 border-t border-zinc-700 print:border-black">
                <span>Total Amount:</span>
                <span className="font-mono text-orange-500 print:text-black text-lg">
                  Ksh {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt Footer Notes & KRA PIN */}
          <div className="border-t border-zinc-800 print:border-black pt-4 text-center text-[10px] text-zinc-500 print:text-zinc-700 uppercase tracking-wider space-y-1">
            <p className="font-black text-zinc-400 print:text-black">
              Thank you for trusting {businessProfile.name} • Quality Guaranteed
            </p>
            <p>Goods once sold in genuine condition are covered by manufacturer warranty.</p>
            <p className="font-mono text-zinc-600 print:text-zinc-500">
              KRA PIN: {businessProfile.kraPin || 'P051982734K'} • Buy Goods Till: {businessProfile.tillNumber}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="print:hidden bg-[#050505] p-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-zinc-400 font-bold">
            Customer Helpline: <strong className="text-white">{businessProfile.phones[0]}</strong>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-black uppercase tracking-wider text-xs border border-zinc-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
