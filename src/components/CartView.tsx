import React, { useState } from 'react';
import { CartItem } from '../types';
import { BUSINESS_INFO } from '../data/initialData';
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Truck, ShoppingBag, Smartphone, MessageSquare, Mail } from 'lucide-react';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToMpesa: (orderDetails: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryMethod: 'pickup_kirinyaga' | 'pickup_umoja' | 'nairobi_courier' | 'upcountry_parcel';
    deliveryAddress: string;
    notes: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
  }) => void;
  onNavigateToShop: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToMpesa,
  onNavigateToShop,
}) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<
    'pickup_kirinyaga' | 'pickup_umoja' | 'nairobi_courier' | 'upcountry_parcel'
  >('pickup_kirinyaga');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const deliveryFee =
    deliveryMethod === 'pickup_kirinyaga' || deliveryMethod === 'pickup_umoja'
      ? 0
      : deliveryMethod === 'nairobi_courier'
      ? 350
      : 650;

  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      setErrorMsg('Please enter a valid Safaricom phone number (e.g. 0722000000)');
      return;
    }
    if ((deliveryMethod === 'nairobi_courier' || deliveryMethod === 'upcountry_parcel') && !deliveryAddress.trim()) {
      setErrorMsg('Please provide your delivery address or destination town');
      return;
    }

    setErrorMsg('');
    onProceedToMpesa({
      customerName,
      customerPhone,
      customerEmail: customerEmail.trim() || 'customer@gmail.com',
      deliveryMethod,
      deliveryAddress,
      notes,
      subtotal,
      deliveryFee,
      total,
    });
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemList = cart
      .map((item) => `• ${item.quantity}x ${item.product.name} (KES ${(item.product.price * item.quantity).toLocaleString()})`)
      .join('\n');

    const message = `*NEW SPARE PARTS ORDER - RISSAU AUTO AGENCY*\n\n*Customer:* ${customerName || 'Direct Customer'}\n*Phone:* ${customerPhone || 'Not specified'}\n*Email:* ${customerEmail || 'Not specified'}\n*Delivery Method:* ${deliveryMethod.toUpperCase().replace('_', ' ')}\n${deliveryAddress ? `*Destination:* ${deliveryAddress}\n` : ''}\n*Items:*\n${itemList}\n\n*Subtotal:* KES ${subtotal.toLocaleString()}\n*Delivery:* KES ${deliveryFee.toLocaleString()}\n*TOTAL:* KES ${total.toLocaleString()}\n\nPlease confirm availability and dispatch terms.`;

    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fadeIn text-white">
        <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 text-orange-500 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <p className="text-orange-500 font-black uppercase text-xs tracking-widest mb-1">
          Your Cart is Empty
        </p>
        <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white">
          No Spare Parts Selected
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mt-2 mb-8">
          Browse our tires, gaskets, oils, suspension, and brake parts. Genuine parts ready for dispatch across Kenya.
        </p>
        <button
          onClick={onNavigateToShop}
          className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-sm transition-all cursor-pointer"
        >
          Explore Spare Parts Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn text-white">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
        <div>
          <button
            onClick={onNavigateToShop}
            className="text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-orange-500 flex items-center gap-1.5 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white">
            Shopping Cart &amp; Checkout
          </h2>
        </div>
        <button
          onClick={onClearCart}
          className="text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Empty Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">
            Selected Items ({cart.length})
          </h3>

          <div className="space-y-3">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-[#111] p-4 sm:p-5 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                      {product.category}
                    </span>
                    <h4 className="font-black text-sm sm:text-base uppercase text-white font-display">
                      {product.name}
                    </h4>
                    <p className="text-xs text-zinc-400 font-bold mt-0.5">
                      Ksh {product.price.toLocaleString()} each
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                  <div className="flex items-center border border-zinc-800 bg-zinc-900">
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-white font-display block">
                      Ksh {(product.price * quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-[10px] text-zinc-500 hover:text-red-400 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Business guarantee badge */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-300">
            <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
            <span>
              All purchases backed by <strong className="text-white">Rissau Auto Agency Genuine Guarantee</strong>. Official digital receipt &amp; email confirmation dispatched on payment clearance.
            </span>
          </div>
        </div>

        {/* Right Column: Checkout & M-Pesa Details */}
        <div className="lg:col-span-5">
          <div className="bg-[#111] p-6 sm:p-7 border border-zinc-800 sticky top-24 space-y-6">
            <div className="pb-4 border-b border-zinc-800">
              <span className="text-orange-500 font-black uppercase text-xs tracking-widest block">
                Delivery &amp; Payment Details
              </span>
              <h3 className="text-xl font-black uppercase font-display text-white mt-1">
                Order Summary
              </h3>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4 text-xs">
              {/* Customer Contact */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  Full Name / Mechanic Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John Kamau / Apex Auto Garage"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                    Safaricom Phone (M-Pesa) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold font-mono placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-orange-500" />
                    <span>Email (For Receipt &amp; Tracking)</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold font-mono placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Delivery method selector */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Delivery / Collection Option:
                </label>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                    deliveryMethod === 'pickup_kirinyaga' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900/60'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'pickup_kirinyaga'}
                        onChange={() => setDeliveryMethod('pickup_kirinyaga')}
                        className="accent-orange-500"
                      />
                      <span className="font-bold text-white uppercase text-[11px]">Free Pickup: Kirinyaga Rd (CBD)</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">FREE</span>
                  </label>

                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                    deliveryMethod === 'pickup_umoja' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900/60'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'pickup_umoja'}
                        onChange={() => setDeliveryMethod('pickup_umoja')}
                        className="accent-orange-500"
                      />
                      <span className="font-bold text-white uppercase text-[11px]">Free Pickup: Umoja, Kangundo Rd</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">FREE</span>
                  </label>

                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                    deliveryMethod === 'nairobi_courier' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900/60'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'nairobi_courier'}
                        onChange={() => setDeliveryMethod('nairobi_courier')}
                        className="accent-orange-500"
                      />
                      <span className="font-bold text-white uppercase text-[11px]">Nairobi Doorstep Rider</span>
                    </div>
                    <span className="font-mono text-white font-bold">KES 350</span>
                  </label>

                  <label className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                    deliveryMethod === 'upcountry_parcel' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900/60'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'upcountry_parcel'}
                        onChange={() => setDeliveryMethod('upcountry_parcel')}
                        className="accent-orange-500"
                      />
                      <span className="font-bold text-white uppercase text-[11px]">Upcountry Matatu / Sacco Parcel</span>
                    </div>
                    <span className="font-mono text-white font-bold">KES 650</span>
                  </label>
                </div>
              </div>

              {(deliveryMethod === 'nairobi_courier' || deliveryMethod === 'upcountry_parcel') && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                    Delivery Address / Destination Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Westlands, Garage Rd / Nakuru Town stage"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Price Calculation summary */}
              <div className="p-4 bg-[#050505] border border-zinc-800 space-y-2 pt-3">
                <div className="flex justify-between text-zinc-400">
                  <span className="font-bold uppercase text-[11px]">Items Subtotal:</span>
                  <span className="font-mono font-bold text-white">Ksh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="font-bold uppercase text-[11px]">Delivery Fee:</span>
                  <span className="font-mono font-bold text-white">
                    {deliveryFee === 0 ? 'FREE' : `Ksh ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-white text-lg font-black pt-2 border-t border-zinc-800">
                  <span className="uppercase font-display">Grand Total:</span>
                  <span className="text-orange-500 font-display">Ksh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Pay via Lipa Na M-Pesa STK (Ksh {total.toLocaleString()})</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Direct Order via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
