import React, { useState } from 'react';
import { CartItem, BusinessProfile, BranchLocation } from '../types';
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Truck, ShoppingBag, Smartphone, MessageSquare, Mail, MapPin } from 'lucide-react';

interface CartViewProps {
  cart: CartItem[];
  businessProfile: BusinessProfile;
  branches: BranchLocation[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToMpesa: (orderDetails: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryMethod: string;
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
  businessProfile,
  branches,
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
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || 'kirinyaga');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'nairobi_courier' | 'upcountry_parcel'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const deliveryFee =
    deliveryType === 'pickup'
      ? 0
      : deliveryType === 'nairobi_courier'
      ? 350
      : 650;

  const total = subtotal + deliveryFee;

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

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
    if ((deliveryType === 'nairobi_courier' || deliveryType === 'upcountry_parcel') && !deliveryAddress.trim()) {
      setErrorMsg('Please provide your delivery address or destination town');
      return;
    }

    setErrorMsg('');

    const formattedDeliveryMethod =
      deliveryType === 'pickup'
        ? `Pickup at ${selectedBranch?.shortName || 'Counter'}`
        : deliveryType;

    const formattedAddress =
      deliveryType === 'pickup'
        ? `Branch Pickup: ${selectedBranch?.name} (${selectedBranch?.address})`
        : deliveryAddress;

    onProceedToMpesa({
      customerName,
      customerPhone,
      customerEmail: customerEmail.trim() || `${customerPhone}@customer.ke`,
      deliveryMethod: formattedDeliveryMethod,
      deliveryAddress: formattedAddress,
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

    const methodDesc =
      deliveryType === 'pickup'
        ? `Counter Pickup at ${selectedBranch?.shortName}`
        : deliveryType.toUpperCase().replace('_', ' ');

    const message = `*NEW SPARE PARTS ORDER - ${businessProfile.name.toUpperCase()}*\n\n*Customer:* ${customerName || 'Direct Customer'}\n*Phone:* ${customerPhone || 'Not specified'}\n*Email:* ${customerEmail || 'Not specified'}\n*Delivery:* ${methodDesc}\n${deliveryAddress ? `*Destination:* ${deliveryAddress}\n` : ''}\n*Items:*\n${itemList}\n\n*Subtotal:* KES ${subtotal.toLocaleString()}\n*Delivery:* KES ${deliveryFee.toLocaleString()}\n*TOTAL:* KES ${total.toLocaleString()}\n\nPlease confirm availability and dispatch.`;

    window.open(`https://wa.me/${businessProfile.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
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
          Browse our tires, gaskets, oils, suspension, and brake parts. Genuine parts ready for pickup or dispatch across Kenya.
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
              All purchases backed by <strong className="text-white">{businessProfile.name} Genuine Guarantee</strong>. Official digital receipt dispatched immediately to your email on payment clearance.
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
                  placeholder="e.g. David Mwangi"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white uppercase text-xs font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  M-Pesa Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0722 000 000"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono text-xs font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Customer Email for Receipts and Notifications */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 flex items-center justify-between">
                  <span>Buyer Email (For Official Receipt &amp; Tracking)</span>
                  <span className="text-orange-500 text-[9px] font-bold">Instant Dispatch</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. mwangi@gmail.com"
                    className="w-full pl-9 pr-3 py-3 bg-zinc-900 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Delivery Method Selector */}
              <div className="pt-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                  Delivery / Collection Option:
                </label>
                <div className="space-y-2">
                  {/* Option 1: Pickup at dynamic branches */}
                  <label className={`p-3 border flex flex-col gap-2 cursor-pointer transition-colors ${
                    deliveryType === 'pickup' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="delivery_type"
                          checked={deliveryType === 'pickup'}
                          onChange={() => setDeliveryType('pickup')}
                          className="accent-orange-500"
                        />
                        <span className="font-black uppercase text-white">
                          Free Branch Counter Pickup
                        </span>
                      </div>
                      <span className="font-mono font-black text-emerald-400">FREE</span>
                    </div>

                    {deliveryType === 'pickup' && (
                      <div className="pl-6 pt-1 space-y-1">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold">Select Store Location:</span>
                        <select
                          value={selectedBranchId}
                          onChange={(e) => setSelectedBranchId(e.target.value)}
                          className="w-full p-2 bg-[#0a0a0a] border border-zinc-700 text-white font-bold text-xs uppercase"
                        >
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.address})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </label>

                  {/* Option 2: Nairobi Courier */}
                  <label className={`p-3 border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryType === 'nairobi_courier' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery_type"
                        checked={deliveryType === 'nairobi_courier'}
                        onChange={() => setDeliveryType('nairobi_courier')}
                        className="accent-orange-500"
                      />
                      <span className="font-black uppercase text-white">
                        Nairobi Doorstep Courier / Boda
                      </span>
                    </div>
                    <span className="font-mono font-black text-white">Ksh 350</span>
                  </label>

                  {/* Option 3: Upcountry Parcel / Sacco */}
                  <label className={`p-3 border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryType === 'upcountry_parcel' ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery_type"
                        checked={deliveryType === 'upcountry_parcel'}
                        onChange={() => setDeliveryType('upcountry_parcel')}
                        className="accent-orange-500"
                      />
                      <span className="font-black uppercase text-white">
                        Upcountry Parcel via Matatu Sacco
                      </span>
                    </div>
                    <span className="font-mono font-black text-white">Ksh 650</span>
                  </label>
                </div>
              </div>

              {/* Delivery Address if courier or upcountry */}
              {deliveryType !== 'pickup' && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                    Delivery Address / Destination Town / Sacco Stage *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Westlands Nairobi or 2NK Sacco Stage Nyeri"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white uppercase text-xs font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Order Notes */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  Special Notes / Car Registration (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Toyota Prado KDD 123A (Front Left Shock)"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white uppercase text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Pricing breakdown */}
              <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span className="uppercase font-bold">Subtotal:</span>
                  <span className="font-mono font-black text-white">Ksh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="uppercase font-bold">Delivery Fee:</span>
                  <span className="font-mono font-black text-white">
                    {deliveryFee === 0 ? 'FREE' : `Ksh ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-zinc-800 font-black uppercase text-white">
                  <span>Total Amount:</span>
                  <span className="font-mono text-orange-500 text-lg">
                    Ksh {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit to Payment Selection */}
              <button
                type="submit"
                className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Smartphone className="w-5 h-5" />
                <span>Proceed to Payment (KES {total.toLocaleString()})</span>
              </button>

              {/* Supported Payment Channels */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-emerald-400">M-Pesa Send Money</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-orange-400">Paybill</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-emerald-400">Buy Goods Till</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-blue-400">Bank Transfer</span>
              </div>
            </form>

            {/* WhatsApp Alternative */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 text-xs font-black uppercase tracking-wider border border-zinc-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order Directly via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
