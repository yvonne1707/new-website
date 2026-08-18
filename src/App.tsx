import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, VehicleSelection, BranchLocation, BusinessProfile, TransportDetails, PaymentSubmissionData } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_BRANCHES, INITIAL_BUSINESS_PROFILE } from './data/initialData';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { VehicleFilterModal } from './components/VehicleFilterModal';
import { CartView } from './components/CartView';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
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
  Mail,
  Check
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
  const [detailsProductId, setDetailsProductId] = useState<string | null>(null);
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
    deliveryMethod: string;
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

  // Sync detailsProduct dynamically with products state
  const detailsProduct = useMemo(() => {
    if (!detailsProductId) return null;
    return products.find((p) => p.id === detailsProductId) || null;
  }, [products, detailsProductId]);

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

  const handlePaymentSubmitted = (data: PaymentSubmissionData) => {
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
      paymentMethod: data.paymentMethod as any,
      paymentMethodName: data.paymentMethodName,
      mpesaReceipt: data.transactionReference,
      paidFromPhone: data.paidFromPhone,
      status: 'Payment Pending Verification', // Moves to Payment Pending Verification per requirements!
      emailNotificationSent: false,
      notes: data.notes ? `${pendingCheckout.notes ? pendingCheckout.notes + ' | ' : ''}${data.notes}` : pendingCheckout.notes,
      transportDetails: {
        saccoOrCourier:
          pendingCheckout.deliveryMethod.includes('upcountry')
            ? '2NK Sacco'
            : pendingCheckout.deliveryMethod.includes('courier')
            ? 'Nairobi Boda Express'
            : 'Counter Self-Pickup',
        destinationStage: pendingCheckout.deliveryAddress || 'Branch Counter',
        estimatedArrivalTime: 'Awaiting Admin Verification',
        status: 'In Transit',
        dispatchedAt: new Date().toLocaleString(),
      }
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);

    // Show buyer toast
    if (newOrder.customerEmail) {
      setEmailNotificationToast(`Payment details submitted for Order ${newOrder.orderNumber}. Confirmation email sent to ${newOrder.customerEmail}`);
      setTimeout(() => setEmailNotificationToast(null), 5000);
    }
  };

  const handlePaymentSuccess = (mpesaReceipt: string, extraNotes?: string) => {
    handlePaymentSubmitted({
      paymentMethod: 'mpesa_till',
      paymentMethodName: 'M-Pesa Buy Goods Till',
      transactionReference: mpesaReceipt,
      notes: extraNotes,
    });
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
    return products
      .filter((p) => {
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
          const modelMatch = p.compatibleVehicles.some(
            (v) =>
              v.toLowerCase().includes(selectedVehicle.make.toLowerCase()) ||
              v.toLowerCase().includes(selectedVehicle.model.toLowerCase())
          );
          if (!modelMatch) return false;
        }

        // In-stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, selectedVehicle, inStockOnly, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setActiveTab('cart')}
        onOpenCarSelector={() => setIsCarSelectorOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        selectedVehicle={selectedVehicle}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        businessProfile={businessProfile}
        branches={branches}
      />

      {/* Global Email Notification Banner */}
      {emailNotificationToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white font-bold p-4 border border-emerald-400 shadow-2xl flex items-center gap-3 animate-fadeIn text-xs max-w-md">
          <Mail className="w-5 h-5 shrink-0" />
          <div className="flex-1">{emailNotificationToast}</div>
          <button
            onClick={() => setEmailNotificationToast(null)}
            className="text-white hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 pb-20 md:pb-8">
        {/* Tab: Shop / Catalog */}
        {activeTab === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn">
            {/* Bold Typographic Hero Banner */}
            <div className="relative bg-[#111111] p-6 sm:p-10 border border-zinc-800 overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-orange-500/10 to-transparent pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>Kenya's Direct Heavy &amp; Light Commercial Auto Spares</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase font-display tracking-tight text-white leading-none">
                  Genuine Parts. <br className="hidden sm:inline" />
                  <span className="text-orange-500">Unbeatable</span> Kenyan Prices.
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-bold uppercase tracking-wider leading-relaxed">
                  Specialized in premium all-terrain tires, gearbox &amp; engine gaskets, high-performance Castrol oils, suspension &amp; brakes.
                </p>

                {/* Quick actions in hero */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsCarSelectorOpen(true)}
                    className="px-5 py-3 bg-white hover:bg-orange-500 text-black font-black uppercase tracking-tighter text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Car className="w-4 h-4" />
                    <span>{selectedVehicle ? `Selected: ${selectedVehicle.model}` : 'Filter by My Car Model'}</span>
                  </button>

                  <button
                    onClick={() => setIsAiAdvisorOpen(true)}
                    className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-orange-400 font-black uppercase tracking-wider text-xs border border-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>Ask AI Parts Specialist</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Car Matching Active Bar */}
            {selectedVehicle && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-black flex items-center justify-center font-black">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 block">
                      Active Vehicle Fitment
                    </span>
                    <span className="text-sm font-black uppercase text-white">
                      {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.engine ? `(${selectedVehicle.engine})` : ''}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filter</span>
                </button>
              </div>
            )}

            {/* Search & Category Filter Section */}
            <div className="space-y-4">
              {/* Search bar & Quick controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by part name (e.g. Michelin 265/65R17, Hilux Gasket, Castrol 15W-40, Brake Pads)..."
                    className="w-full pl-11 pr-4 py-3.5 bg-[#111] border border-zinc-800 text-white placeholder:text-zinc-600 text-xs sm:text-sm font-bold focus:outline-none focus:border-orange-500"
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

                {/* Sort & In-stock toggle */}
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="px-3 py-3.5 bg-[#111] border border-zinc-800 text-white font-bold text-xs uppercase focus:outline-none focus:border-orange-500"
                  >
                    <option value="featured">Featured Spares</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>

                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`px-4 py-3.5 text-xs font-black uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      inStockOnly
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-[#111] text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>In Stock Only</span>
                    {inStockOnly && <Check className="w-3.5 h-3.5" />}
                  </button>
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
                        `Hello ${businessProfile.name}, I am looking for: ${searchQuery}`
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
                      onViewDetails={(p) => setDetailsProductId(p.id)}
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
            businessProfile={businessProfile}
            branches={branches}
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
            onNavigateToShop={() => setActiveTab('shop')}
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
        businessProfile={businessProfile}
        onClose={() => setDetailsProductId(null)}
        onAddToCart={handleAddToCart}
        isInCart={detailsProduct ? cart.some((i) => i.product.id === detailsProduct.id) : false}
      />

      <VehicleFilterModal
        isOpen={isCarSelectorOpen}
        onClose={() => setIsCarSelectorOpen(false)}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={(veh) => setSelectedVehicle(veh)}
      />

      <PaymentCheckoutModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        totalAmount={pendingCheckout?.total || 0}
        customerPhone={pendingCheckout?.customerPhone || ''}
        customerName={pendingCheckout?.customerName || ''}
        businessProfile={businessProfile}
        onPaymentSubmitted={handlePaymentSubmitted}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AiPartsAdvisor
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        selectedVehicle={selectedVehicle}
        businessProfile={businessProfile}
        branches={branches}
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
