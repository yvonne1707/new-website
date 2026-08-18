import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, VehicleSelection, BranchLocation, BusinessProfile, TransportDetails } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_BRANCHES, INITIAL_BUSINESS_PROFILE, BUSINESS_INFO } from './data/initialData';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { VehicleFilterModal } from './components/VehicleFilterModal';
import { CartView } from './components/CartView';
import { MpesaCheckoutModal } from './components/MpesaCheckoutModal';
import { LocationsView } from './components/LocationsView';
import { AdminPanel } from './components/AdminPanel';
import { AiPartsAdvisor } from './components/AiPartsAdvisor';
import { BottomNav } from './components/BottomNav';
import { ReceiptModal } from './components/ReceiptModal';
import { 
  Search, 
  Car, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  SlidersHorizontal,
  X,
  ArrowRight,
  Instagram,
  Share2,
  CheckCircle2,
  Mail
} from 'lucide-react';

const CATEGORIES = [
  'All Spares',
  'Tires',
  'Gaskets & Seals',
  'Oils & Fluids',
  'Brakes',
  'Suspension',
  'Filters',
  'Electrical & Batteries',
  'Engine & Cooling',
];

export default function App() {
  // Application State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rissau_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rissau_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [branches, setBranches] = useState<BranchLocation[]>(() => {
    const saved = localStorage.getItem('rissau_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('rissau_business_profile');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_PROFILE;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rissau_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<string>('shop');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSelection | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Spares');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals state
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [isCarSelectorOpen, setIsCarSelectorOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [emailNotificationToast, setEmailNotificationToast] = useState<string | null>(null);

  // Active Pending Checkout Data for M-Pesa
  const [pendingCheckout, setPendingCheckout] = useState<{
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryMethod: 'pickup_kirinyaga' | 'pickup_umoja' | 'nairobi_courier' | 'upcountry_parcel';
    deliveryAddress: string;
    notes: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
  } | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('rissau_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rissau_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rissau_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('rissau_business_profile', JSON.stringify(businessProfile));
  }, [businessProfile]);

  useEffect(() => {
    localStorage.setItem('rissau_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Checkout flow
  const handleProceedToMpesa = (orderDetails: any) => {
    setPendingCheckout(orderDetails);
    setIsMpesaModalOpen(true);
  };

  const handlePaymentSuccess = (mpesaReceipt: string, extraNotes?: string) => {
    if (!pendingCheckout) return;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `RIS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' }),
      customerName: pendingCheckout.customerName,
      customerPhone: pendingCheckout.customerPhone,
      customerEmail: pendingCheckout.customerEmail,
      items: [...cart],
      subtotal: pendingCheckout.subtotal,
      deliveryFee: pendingCheckout.deliveryFee,
      total: pendingCheckout.total,
      deliveryMethod: pendingCheckout.deliveryMethod,
      deliveryAddress: pendingCheckout.deliveryAddress,
      paymentMethod: 'mpesa_stk',
      mpesaReceipt: mpesaReceipt,
      status: 'Confirmed',
      emailNotificationSent: true,
      notes: extraNotes ? `${pendingCheckout.notes} | ${extraNotes}` : pendingCheckout.notes,
      transportDetails: {
        saccoOrCourier:
          pendingCheckout.deliveryMethod === 'upcountry_parcel'
            ? '2NK Sacco'
            : pendingCheckout.deliveryMethod === 'nairobi_courier'
            ? 'Nairobi Boda Express'
            : 'Counter Self-Pickup',
        destinationStage: pendingCheckout.deliveryAddress || 'Branch Counter',
        estimatedArrivalTime: 'Today at 4:30 PM',
        status: 'In Transit',
        dispatchedAt: new Date().toLocaleString(),
      }
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsMpesaModalOpen(false);

    // Open receipt modal automatically for the customer
    setActiveReceiptOrder(newOrder);

    // Show buyer email notification toast
    if (newOrder.customerEmail) {
      setEmailNotificationToast(`Official Receipt & M-Pesa confirmation sent to ${newOrder.customerEmail}`);
      setTimeout(() => setEmailNotificationToast(null), 5000);
    }
  };

  // Inventory modifications by Admin
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const handleUpdateOrderTransport = (orderId: string, transport: TransportDetails) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: transport.status === 'Delivered' ? 'Delivered' : 'Dispatched',
              transportDetails: transport,
            }
          : ord
      )
    );
  };

  const handleSendOrderEmailNotification = (orderId: string, email: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, customerEmail: email, emailNotificationSent: true }
          : ord
      )
    );
    setEmailNotificationToast(`Receipt & transport notification dispatched to ${email}`);
    setTimeout(() => setEmailNotificationToast(null), 4000);
  };

  // Branch management
  const handleAddBranch = (branch: BranchLocation) => {
    setBranches((prev) => [branch, ...prev]);
  };

  const handleUpdateBranch = (branch: BranchLocation) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === branch.id ? branch : b))
    );
  };

  const handleDeleteBranch = (branchId: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== branchId));
  };

  const handleUpdateBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All Spares' && p.category !== selectedCategory) {
        return false;
      }

      // Search Query filter (name, part number, brand, compatible car)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesPartNo = p.partNumber?.toLowerCase().includes(q);
        const matchesVehicles = p.compatibleVehicles.some((v) =>
          v.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesBrand && !matchesPartNo && !matchesVehicles) {
          return false;
        }
      }

      // Vehicle Filter
      if (selectedVehicle) {
        const makeMatch = p.compatibleVehicles.some((v) =>
          v.toLowerCase().includes(selectedVehicle.make.toLowerCase())
        );
        const modelMatch = p.compatibleVehicles.some((v) =>
          v.toLowerCase().includes(selectedVehicle.model.toLowerCase())
        );
        if (!makeMatch && !modelMatch) {
          return false;
        }
      }

      // In-stock only
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      return 0; // featured
    });
  }, [products, selectedCategory, searchQuery, selectedVehicle, inStockOnly, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col antialiased pb-20 md:pb-0 selection:bg-orange-500 selection:text-black">
      {/* Email Toast Banner */}
      {emailNotificationToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 border-2 border-emerald-400 text-white p-4 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-black uppercase tracking-wider">
            {emailNotificationToast}
          </div>
          <button
            onClick={() => setEmailNotificationToast(null)}
            className="text-zinc-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setActiveTab('cart')}
        onOpenCarSelector={() => setIsCarSelectorOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        selectedVehicle={selectedVehicle}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {activeTab === 'shop' && (
          <div>
            {/* Bold Hero Header */}
            <div className="bg-[#0a0a0a] px-4 py-10 sm:py-14 border-b border-zinc-800 relative overflow-hidden">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                  {/* Giant Hero Title & Tagline */}
                  <div>
                    <h1 className="text-[56px] sm:text-[90px] lg:text-[120px] font-black leading-[0.85] tracking-tighter uppercase m-0 font-display text-white">
                      RISSAU<br />
                      <span className="text-white hover:text-orange-500 transition-colors">AUTO</span>
                    </h1>
                    <p className="text-orange-500 font-bold tracking-[0.3em] uppercase mt-4 text-xs sm:text-sm">
                      {businessProfile.tagline} • Serving Kenya Since 2020
                    </p>
                  </div>

                  {/* Right Status Block */}
                  <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-orange-500 text-black px-4 py-2 font-black text-sm sm:text-base flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-black rounded-full animate-ping"></span>
                        ONLINE IN {branches.map((b) => b.shortName.toUpperCase()).join(' & ')}
                      </div>

                      <div className="border border-zinc-800 bg-[#111] px-4 py-2 text-left lg:text-right">
                        <p className="text-zinc-500 uppercase text-[9px] font-black tracking-widest">Cart Status</p>
                        <p className="text-xl sm:text-2xl font-black italic text-orange-500">
                          {totalCartCount < 10 ? `0${totalCartCount}` : totalCartCount} ITEMS
                        </p>
                      </div>
                    </div>

                    {/* Quick vehicle & AI action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => setIsCarSelectorOpen(true)}
                        className="px-4 py-3 bg-[#161616] hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider border border-zinc-700 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Car className="w-4 h-4 text-orange-500" />
                        <span>
                          {selectedVehicle
                            ? `Matched: ${selectedVehicle.make} ${selectedVehicle.model}`
                            : 'Match Parts to Car'}
                        </span>
                      </button>

                      <button
                        onClick={() => setIsAiAdvisorOpen(true)}
                        className="px-4 py-3 bg-white hover:bg-orange-500 text-black font-black text-xs uppercase tracking-tighter flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Ask AI Specialist</span>
                      </button>

                      <a
                        href={`https://wa.me/${businessProfile.whatsapp}?text=Hello%20Rissau%20Auto%20Agency`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-black text-xs uppercase tracking-wider border border-zinc-800 flex items-center gap-2 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp ({businessProfile.phones[0]})</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Filter Controls & Search */}
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
              {/* Active Vehicle Filter Banner */}
              {selectedVehicle && (
                <div className="p-4 bg-orange-500/15 border border-orange-500 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-black uppercase tracking-wider text-orange-400">
                    <Car className="w-4 h-4 text-orange-500" />
                    <span>
                      Filtered for: <strong className="text-white">{selectedVehicle.make} {selectedVehicle.model}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-orange-500 px-3 py-1.5 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear Filter</span>
                  </button>
                </div>
              )}

              {/* Search & Sort Row */}
              <div className="bg-[#111] p-4 sm:p-5 border border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by part name, OEM number, brand, vehicle..."
                    className="w-full pl-11 pr-10 py-3 bg-[#0a0a0a] border border-zinc-800 text-white placeholder:text-zinc-600 text-xs font-bold focus:outline-none focus:border-orange-500 uppercase tracking-wider"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end text-xs font-bold">
                  <label className="flex items-center gap-2 uppercase tracking-wider text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-orange-500"
                    />
                    <span>In Stock Only</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 uppercase tracking-widest text-[10px] hidden sm:inline">
                      Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2.5 bg-[#0a0a0a] border border-zinc-800 text-white font-black uppercase text-xs focus:outline-none focus:border-orange-500"
                    >
                      <option value="featured">Featured Spares</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category selector chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-3 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-black shadow-lg'
                        : 'bg-[#111] text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Grid Header */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  Showing {filteredProducts.length} Spare Part{filteredProducts.length !== 1 ? 's' : ''}
                </span>
                {selectedCategory !== 'All Spares' && (
                  <span className="text-[11px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1">
                    Category: {selectedCategory}
                  </span>
                )}
              </div>

              {/* Products Display Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-[#111] p-12 text-center border border-zinc-800 max-w-lg mx-auto my-8 space-y-4">
                  <Search className="w-12 h-12 text-zinc-700 mx-auto" />
                  <h3 className="text-xl font-black uppercase font-display text-white">
                    No Matching Spares Found
                  </h3>
                  <p className="text-xs text-zinc-400">
                    We might still have this part at our Kirinyaga Road or Umoja warehouses!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Spares');
                        setSelectedVehicle(null);
                        setInStockOnly(false);
                      }}
                      className="px-6 py-3 bg-white text-black font-black uppercase tracking-tighter text-xs cursor-pointer hover:bg-orange-500"
                    >
                      Reset All Filters
                    </button>
                    <a
                      href={`https://wa.me/${businessProfile.whatsapp}?text=${encodeURIComponent(
                        `Hello Rissau Auto, I am looking for: ${searchQuery}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 bg-orange-500 text-black font-black uppercase tracking-tighter text-xs flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Inquire on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={idx}
                      onAddToCart={handleAddToCart}
                      onViewDetails={(p) => setDetailsProduct(p)}
                      isInCart={cart.some((i) => i.product.id === product.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Store Locations */}
        {activeTab === 'locations' && (
          <LocationsView branches={branches} businessProfile={businessProfile} />
        )}

        {/* Tab: Cart & Checkout */}
        {activeTab === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onProceedToMpesa={handleProceedToMpesa}
            onNavigateToShop={() => setActiveTab('shop')}
          />
        )}

        {/* Tab: Admin Panel */}
        {activeTab === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            branches={branches}
            businessProfile={businessProfile}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateOrderTransport={handleUpdateOrderTransport}
            onSendOrderEmailNotification={handleSendOrderEmailNotification}
            onAddBranch={handleAddBranch}
            onUpdateBranch={handleUpdateBranch}
            onDeleteBranch={handleDeleteBranch}
            onUpdateBusinessProfile={handleUpdateBusinessProfile}
          />
        )}
      </main>

      {/* Bold Typography Theme Footer */}
      <footer className="bg-orange-500 text-black p-8 sm:p-10 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Dynamic Branches Display */}
          <div className="flex flex-wrap gap-8 sm:gap-12">
            {branches.map((b) => (
              <div key={b.id}>
                <p className="uppercase text-[10px] font-black tracking-widest mb-1 opacity-75">
                  {b.shortName} ({b.city})
                </p>
                <p className="font-black text-base sm:text-lg font-display uppercase tracking-tight">
                  {b.address}
                </p>
                <div className="text-xs font-mono font-bold mt-1">
                  GPS: {b.coords || `${b.latitude}, ${b.longitude}`}
                </div>
              </div>
            ))}
          </div>

          {/* Socials, Sales hotlines & Admin login trigger */}
          <div className="flex flex-wrap items-center gap-8 sm:gap-12 w-full lg:w-auto justify-between lg:justify-end">
            <div className="space-y-1">
              <p className="uppercase text-[10px] font-black tracking-widest mb-1 opacity-75">
                Hotlines &amp; Socials
              </p>
              <div className="font-black text-sm sm:text-base font-mono">
                {businessProfile.phones.join(' / ')}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold pt-1">
                <a
                  href={`https://instagram.com/${businessProfile.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{businessProfile.instagram}</span>
                </a>
                <span>•</span>
                <a
                  href={`https://tiktok.com/@${businessProfile.tiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{businessProfile.tiktok}</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('admin')}
              className="bg-black text-white px-8 py-3.5 font-black text-xs sm:text-sm uppercase tracking-tighter hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Admin Portal
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-black/20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold uppercase tracking-wider opacity-80 gap-2">
          <span>© {new Date().getFullYear()} {businessProfile.name.toUpperCase()} • NAIROBI KENYA</span>
          <span>GENUINE TIRES • GASKETS • CASTROL OILS • BRAKES • NATIONWIDE SACCO DISPATCH</span>
        </div>
      </footer>

      {/* Mobile Sticky Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCarSelector={() => setIsCarSelectorOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
      />

      {/* Modals */}
      <ProductDetailsModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onAddToCart={handleAddToCart}
        isInCart={detailsProduct ? cart.some((i) => i.product.id === detailsProduct.id) : false}
      />

      <VehicleFilterModal
        isOpen={isCarSelectorOpen}
        onClose={() => setIsCarSelectorOpen(false)}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={(veh) => setSelectedVehicle(veh)}
      />

      <MpesaCheckoutModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        totalAmount={pendingCheckout?.total || 0}
        customerPhone={pendingCheckout?.customerPhone || ''}
        customerName={pendingCheckout?.customerName || ''}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AiPartsAdvisor
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        selectedVehicle={selectedVehicle}
      />

      {/* Customer Receipt Modal */}
      <ReceiptModal
        order={activeReceiptOrder}
        businessProfile={businessProfile}
        onClose={() => setActiveReceiptOrder(null)}
        onSendEmailNotification={handleSendOrderEmailNotification}
      />
    </div>
  );
}
