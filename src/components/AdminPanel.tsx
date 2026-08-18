import React, { useState, useRef } from 'react';
import { Product, Order, BranchLocation, BusinessProfile, TransportDetails } from '../types';
import { 
  Lock, Plus, Trash2, Edit, CheckCircle, Clock, Package, DollarSign, 
  Smartphone, Search, RefreshCw, X, ShieldAlert, Eye, EyeOff, Camera, 
  Upload, Printer, Mail, Truck, MapPin, Compass, Globe, Instagram, 
  Send, Phone, Check, AlertCircle, Share2
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  branches: BranchLocation[];
  businessProfile: BusinessProfile;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateOrderTransport: (orderId: string, transport: TransportDetails) => void;
  onSendOrderEmailNotification: (orderId: string, email: string) => void;
  onAddBranch: (branch: BranchLocation) => void;
  onUpdateBranch: (branch: BranchLocation) => void;
  onDeleteBranch: (branchId: string) => void;
  onUpdateBusinessProfile: (profile: BusinessProfile) => void;
}

const COMMON_SACCOS = [
  '2NK Sacco',
  'Guardian Coach Logistics',
  'EasyCoach Parcel Service',
  'Transline Classic',
  'North Rift Shuttle',
  'Mololine Shuttle',
  'Speedex Logistics Courier',
  'Nairobi CBD Boda Express',
  'G4S Courier Kenya',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  branches,
  businessProfile,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateOrderTransport,
  onSendOrderEmailNotification,
  onAddBranch,
  onUpdateBranch,
  onDeleteBranch,
  onUpdateBusinessProfile,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'locations' | 'profile'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for new/edit product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Tires');
  const [formPrice, setFormPrice] = useState<number>(1000);
  const [formStock, setFormStock] = useState<number>(10);
  const [formBrand, setFormBrand] = useState('Toyota Genuine');
  const [formPartNumber, setFormPartNumber] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600');
  const [formDescription, setFormDescription] = useState('');
  const [formVehicles, setFormVehicles] = useState('Toyota Hilux, Toyota Prado');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Transport Details Modal State
  const [selectedOrderForTransport, setSelectedOrderForTransport] = useState<Order | null>(null);
  const [transportSacco, setTransportSacco] = useState('');
  const [transportPlate, setTransportPlate] = useState('');
  const [transportPhone, setTransportPhone] = useState('');
  const [transportStage, setTransportStage] = useState('');
  const [transportETA, setTransportETA] = useState('');
  const [transportNotes, setTransportNotes] = useState('');
  const [transportStatus, setTransportStatus] = useState<TransportDetails['status']>('In Transit');

  // Receipt Modal State
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Branch Modal State
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchLocation | null>(null);
  const [branchName, setBranchName] = useState('');
  const [branchShortName, setBranchShortName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchCity, setBranchCity] = useState('Nairobi');
  const [branchLat, setBranchLat] = useState<number | ''>(-1.2815);
  const [branchLng, setBranchLng] = useState<number | ''>(36.8270);
  const [branchPhones, setBranchPhones] = useState('0728090599, 0725309688');
  const [branchEmails, setBranchEmails] = useState('sales@rissauauto.co.ke');
  const [branchWhatsapp, setBranchWhatsapp] = useState('254728090599');
  const [branchHours, setBranchHours] = useState('Mon - Sat: 7:30 AM - 6:00 PM');
  const [branchManager, setBranchManager] = useState('Spares Counter Hub');
  const [branchServices, setBranchServices] = useState('Engine Spares, Tires, Fast Delivery');
  const [branchImage, setBranchImage] = useState('https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=700');
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState('');
  const branchFileInputRef = useRef<HTMLInputElement>(null);

  // Business Profile Form State
  const [profileName, setProfileName] = useState(businessProfile.name);
  const [profileTagline, setProfileTagline] = useState(businessProfile.tagline);
  const [profilePhones, setProfilePhones] = useState(businessProfile.phones.join(', '));
  const [profileEmails, setProfileEmails] = useState(businessProfile.emails.join(', '));
  const [profileWhatsapp, setProfileWhatsapp] = useState(businessProfile.whatsapp);
  const [profileTill, setProfileTill] = useState(businessProfile.tillNumber);
  const [profilePaybill, setProfilePaybill] = useState(businessProfile.paybillNumber || '247247');
  const [profileInstagram, setProfileInstagram] = useState(businessProfile.instagram);
  const [profileTiktok, setProfileTiktok] = useState(businessProfile.tiktok);
  const [profileKra, setProfileKra] = useState(businessProfile.kraPin || 'P051982734K');
  const [profileHours, setProfileHours] = useState(businessProfile.workingHours);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === businessProfile.adminPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Image Upload / Camera Handling
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBranchPhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranchImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live GPS capture
  const handleCaptureLiveGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsGettingGps(true);
    setGpsSuccessMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        setBranchLat(lat);
        setBranchLng(lng);
        setIsGettingGps(false);
        setGpsSuccessMessage(`📍 Live GPS Coordinates Captured: ${lat}, ${lng}`);
      },
      (error) => {
        setIsGettingGps(false);
        alert(`Could not get live GPS location: ${error.message}. You can manually enter coordinates.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Tires');
    setFormPrice(5000);
    setFormStock(10);
    setFormBrand('Toyota Genuine');
    setFormPartNumber('');
    setFormImage('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600');
    setFormDescription('High quality replacement auto spare part for Kenyan vehicles.');
    setFormVehicles('Toyota Hilux, Toyota Prado, Toyota Probox');
    setIsAddModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormStock(p.stock);
    setFormBrand(p.brand);
    setFormPartNumber(p.partNumber || '');
    setFormImage(p.image);
    setFormDescription(p.description);
    setFormVehicles(p.compatibleVehicles.join(', '));
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleList = formVehicles
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        stock: Number(formStock),
        brand: formBrand,
        partNumber: formPartNumber,
        image: formImage,
        description: formDescription,
        compatibleVehicles: vehicleList,
      });
    } else {
      const newProd: Product = {
        id: `p-${Date.now()}`,
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        stock: Number(formStock),
        brand: formBrand,
        partNumber: formPartNumber,
        image: formImage,
        description: formDescription,
        compatibleVehicles: vehicleList,
        isGenuine: true,
        warranty: '1 Year Warranty',
      };
      onAddProduct(newProd);
    }

    setIsAddModalOpen(false);
  };

  // Open Transport Modal
  const handleOpenTransportModal = (order: Order) => {
    setSelectedOrderForTransport(order);
    if (order.transportDetails) {
      setTransportSacco(order.transportDetails.saccoOrCourier);
      setTransportPlate(order.transportDetails.vehiclePlate || '');
      setTransportPhone(order.transportDetails.driverOrOfficePhone || '');
      setTransportStage(order.transportDetails.destinationStage || '');
      setTransportETA(order.transportDetails.estimatedArrivalTime || '');
      setTransportNotes(order.transportDetails.dispatchNotes || '');
      setTransportStatus(order.transportDetails.status || 'In Transit');
    } else {
      setTransportSacco('2NK Sacco');
      setTransportPlate('');
      setTransportPhone(businessProfile.phones[0]);
      setTransportStage(order.deliveryAddress || 'Town Main Stage');
      setTransportETA('Today at 4:30 PM');
      setTransportNotes('Dispatched safely from Nairobi Hub.');
      setTransportStatus('In Transit');
    }
  };

  const handleSaveTransportDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForTransport) return;

    const details: TransportDetails = {
      saccoOrCourier: transportSacco,
      vehiclePlate: transportPlate,
      driverOrOfficePhone: transportPhone,
      destinationStage: transportStage,
      estimatedArrivalTime: transportETA,
      dispatchNotes: transportNotes,
      dispatchedAt: new Date().toLocaleString(),
      status: transportStatus,
    };

    onUpdateOrderTransport(selectedOrderForTransport.id, details);
    setSelectedOrderForTransport(null);
  };

  // Open Branch Modal
  const handleOpenAddBranch = () => {
    setEditingBranch(null);
    setBranchName('');
    setBranchShortName('');
    setBranchAddress('');
    setBranchCity('Nairobi');
    setBranchLat(-1.2815);
    setBranchLng(36.8270);
    setBranchPhones(businessProfile.phones.join(', '));
    setBranchEmails(businessProfile.emails.join(', '));
    setBranchWhatsapp(businessProfile.whatsapp);
    setBranchHours('Mon - Sat: 7:30 AM - 6:00 PM');
    setBranchManager('Main Spares Hub');
    setBranchServices('Engine & Gearbox Spares, Tires, Quick Fitting, Courier Dispatch');
    setBranchImage('https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=700');
    setGpsSuccessMessage('');
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (b: BranchLocation) => {
    setEditingBranch(b);
    setBranchName(b.name);
    setBranchShortName(b.shortName);
    setBranchAddress(b.address);
    setBranchCity(b.city);
    setBranchLat(b.latitude || -1.2815);
    setBranchLng(b.longitude || 36.8270);
    setBranchPhones(b.phones.join(', '));
    setBranchEmails((b.emails || [businessProfile.emails[0]]).join(', '));
    setBranchWhatsapp(b.whatsapp);
    setBranchHours(b.hours);
    setBranchManager(b.manager);
    setBranchServices(b.services.join(', '));
    setBranchImage(b.image);
    setGpsSuccessMessage('');
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = typeof branchLat === 'number' ? branchLat : -1.2815;
    const lng = typeof branchLng === 'number' ? branchLng : 36.8270;
    const coordsStr = `${lat}, ${lng}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    const phoneArr = branchPhones.split(',').map((p) => p.trim()).filter(Boolean);
    const emailArr = branchEmails.split(',').map((e) => e.trim()).filter(Boolean);
    const serviceArr = branchServices.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingBranch) {
      onUpdateBranch({
        ...editingBranch,
        name: branchName,
        shortName: branchShortName || branchName,
        address: branchAddress,
        city: branchCity,
        latitude: lat,
        longitude: lng,
        coords: coordsStr,
        googleMapsUrl: mapsUrl,
        phones: phoneArr,
        emails: emailArr,
        whatsapp: branchWhatsapp,
        hours: branchHours,
        manager: branchManager,
        services: serviceArr,
        image: branchImage,
        isLivePinned: true,
      });
    } else {
      const newB: BranchLocation = {
        id: `branch-${Date.now()}`,
        name: branchName,
        shortName: branchShortName || branchName,
        address: branchAddress,
        city: branchCity,
        latitude: lat,
        longitude: lng,
        coords: coordsStr,
        googleMapsUrl: mapsUrl,
        phones: phoneArr,
        emails: emailArr,
        whatsapp: branchWhatsapp,
        hours: branchHours,
        manager: branchManager,
        services: serviceArr,
        image: branchImage,
        isLivePinned: true,
      };
      onAddBranch(newB);
    }
    setIsBranchModalOpen(false);
  };

  const handleSaveBusinessProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneArr = profilePhones.split(',').map((p) => p.trim()).filter(Boolean);
    const emailArr = profileEmails.split(',').map((em) => em.trim()).filter(Boolean);

    const updated: BusinessProfile = {
      ...businessProfile,
      name: profileName,
      tagline: profileTagline,
      phones: phoneArr,
      emails: emailArr,
      whatsapp: profileWhatsapp,
      tillNumber: profileTill,
      paybillNumber: profilePaybill,
      instagram: profileInstagram,
      tiktok: profileTiktok,
      kraPin: profileKra,
      workingHours: profileHours,
    };

    onUpdateBusinessProfile(updated);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3500);
  };

  // If not logged in, show PIN entry
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-sm bg-[#111] p-8 border border-zinc-800 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 bg-orange-500 text-black flex items-center justify-center mx-auto font-black">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-orange-500 font-black uppercase text-xs tracking-widest block">
              Authorized Access Only
            </span>
            <h2 className="text-2xl font-black uppercase font-display text-white mt-1">
              Admin Portal
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Enter manager password to access catalog, dispatch &amp; settings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={10}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter Admin Password"
                className="w-full py-3.5 pl-4 pr-12 text-center text-lg font-mono font-bold tracking-widest bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-orange-500 placeholder:text-zinc-600 placeholder:text-xs placeholder:font-sans placeholder:tracking-normal"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title={showPin ? 'Hide Password' : 'Show Password'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {pinError && (
                <p className="text-xs text-red-400 font-bold mt-2 flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Access Denied. Incorrect Admin Password.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-sm transition-colors cursor-pointer"
            >
              Access Admin Portal
            </button>
          </form>

          <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold">
            {businessProfile.name} • Management Hub
          </p>
        </div>
      </div>
    );
  }

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn text-white">
      {/* Top Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#111] p-6 sm:p-8 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-orange-500 text-black font-black text-[10px] uppercase tracking-wider">
              Management Portal
            </span>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              {branches.length} Registered Branches
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase font-display text-white mt-1">
            {businessProfile.name} Operations Hub
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddProduct}
            className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Spare Part</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-black uppercase tracking-wider text-xs border border-zinc-800 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111] p-5 border border-zinc-800">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
            Total Sales (KES)
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            Ksh {totalRevenue.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">M-Pesa Verified Orders</span>
        </div>

        <div className="bg-[#111] p-5 border border-zinc-800">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
            Customer Orders
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            {orders.length}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
            {orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length} Active Processing
          </span>
        </div>

        <div className="bg-[#111] p-5 border border-zinc-800">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
            Catalog SKUs
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            {products.length}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">With Stock Photos</span>
        </div>

        <div className="bg-[#111] p-5 border border-zinc-800">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
            Active Branches
          </span>
          <span className="text-3xl font-black text-orange-500 font-display mt-1 block">
            {branches.length}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">Live GPS Pinned</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-black'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Orders &amp; Transport ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-orange-500 text-black'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Stock &amp; Camera Photos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'locations'
              ? 'bg-orange-500 text-black'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Branches &amp; Live GPS ({branches.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-orange-500 text-black'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Business Profile &amp; Socials
        </button>
      </div>

      {/* Tab 1: Orders & Transport Management */}
      {activeTab === 'orders' && (
        <div className="bg-[#111] border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-black uppercase tracking-wider text-white text-xs">
                Customer Orders, Sacco Transport &amp; Receipt Generator
              </h3>
              <p className="text-[10px] text-zinc-400">
                Generate official receipts, set transport details (Sacco / ETA), and send email notifications to buyers.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] text-zinc-500 uppercase font-black tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Order / Date</th>
                  <th className="px-4 py-3">Customer &amp; Email</th>
                  <th className="px-4 py-3">Ordered Items</th>
                  <th className="px-4 py-3">Transport / Sacco</th>
                  <th className="px-4 py-3">M-Pesa / Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-900/50">
                    <td className="px-4 py-3 font-semibold">
                      <div className="text-white font-black">{ord.orderNumber}</div>
                      <div className="text-[10px] text-zinc-500">{ord.date}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{ord.customerName}</div>
                      <a
                        href={`tel:${ord.customerPhone}`}
                        className="text-orange-400 hover:underline font-mono text-[11px] block"
                      >
                        {ord.customerPhone}
                      </a>
                      {ord.customerEmail && (
                        <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                          <Mail className="w-3 h-3 text-zinc-500" />
                          <span>{ord.customerEmail}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="truncate text-zinc-300">
                          {i.quantity}x {i.product.name}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      {ord.transportDetails ? (
                        <div className="space-y-0.5">
                          <div className="font-black text-white text-[11px] flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-orange-500" />
                            <span>{ord.transportDetails.saccoOrCourier}</span>
                          </div>
                          {ord.transportDetails.vehiclePlate && (
                            <div className="text-[10px] font-mono text-orange-400 font-bold">
                              {ord.transportDetails.vehiclePlate}
                            </div>
                          )}
                          {ord.transportDetails.estimatedArrivalTime && (
                            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>ETA: {ord.transportDetails.estimatedArrivalTime}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">
                          {ord.deliveryMethod.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-black text-white">Ksh {ord.total.toLocaleString()}</div>
                      {ord.mpesaReceipt && (
                        <span className="font-mono text-[10px] bg-zinc-900 text-emerald-400 px-1.5 py-0.5 border border-zinc-800 block w-fit mt-0.5">
                          {ord.mpesaReceipt}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(ord.id, e.target.value as Order['status'])
                        }
                        className="text-xs font-black uppercase tracking-wider bg-zinc-900 text-white border border-zinc-800 px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenTransportModal(ord)}
                          title="Manage Sacco Transport / Delivery"
                          className="p-2 bg-zinc-900 hover:bg-orange-500 hover:text-black text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setReceiptOrder(ord)}
                          title="Generate / Print Official Receipt"
                          className="p-2 bg-zinc-900 hover:bg-orange-500 hover:text-black text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {ord.customerEmail && (
                          <button
                            onClick={() => onSendOrderEmailNotification(ord.id, ord.customerEmail!)}
                            title={`Send Email Notification to ${ord.customerEmail}`}
                            className="p-2 bg-zinc-900 hover:bg-emerald-500 hover:text-black text-emerald-400 border border-zinc-800 transition-colors cursor-pointer"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Stock & Inventory Management with Camera Picture Taking */}
      {activeTab === 'inventory' && (
        <div className="bg-[#111] border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stock by part name, OEM number..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-900 border border-zinc-800 text-white font-bold placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-wider text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spare Part &amp; Take Photo</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] text-zinc-500 uppercase font-black tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Stock Photo &amp; Part</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">OEM Part No</th>
                  <th className="px-4 py-3">Price (KES)</th>
                  <th className="px-4 py-3">Stock Qty</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products
                  .filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (p.partNumber && p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt=""
                            className="w-12 h-12 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white uppercase">{prod.name}</div>
                            <div className="text-[10px] text-orange-400 font-bold">{prod.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-zinc-300 uppercase text-[10px]">
                        {prod.category}
                      </td>
                      <td className="px-4 py-3 font-mono text-zinc-400">
                        {prod.partNumber || '-'}
                      </td>
                      <td className="px-4 py-3 font-black text-white">
                        Ksh {prod.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${
                            prod.stock > 5
                              ? 'bg-zinc-900 text-emerald-400 border border-zinc-800'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}
                        >
                          {prod.stock} In Stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
                            title="Edit Spare Part & Update Photo"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 cursor-pointer"
                            title="Delete Spare Part"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Branches & Live GPS Pinning */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <div className="bg-[#111] p-6 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black uppercase font-display text-white">
                Branch Locations &amp; Live GPS Management
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Add new shops, depots, and warehouses across Kenya with live GPS coordinates, contact phones, and emails.
              </p>
            </div>
            <button
              onClick={handleOpenAddBranch}
              className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Branch Location</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((b) => (
              <div key={b.id} className="bg-[#111] border border-zinc-800 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="h-44 relative bg-zinc-900 overflow-hidden">
                    <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleOpenEditBranch(b)}
                        className="p-2 bg-black/80 hover:bg-orange-500 hover:text-black text-white border border-zinc-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Edit Branch & GPS"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete branch ${b.name}?`)) {
                            onDeleteBranch(b.id);
                          }
                        }}
                        className="p-2 bg-black/80 hover:bg-red-500 text-white border border-zinc-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Delete Branch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="px-2 py-0.5 bg-orange-500 text-black font-black text-[9px] uppercase tracking-wider">
                        {b.city}
                      </span>
                      <h4 className="text-lg font-black uppercase font-display text-white mt-1">
                        {b.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
                        Street Address
                      </span>
                      <p className="text-zinc-200 font-bold">{b.address}</p>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-900 border border-zinc-800">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                          GPS Coordinates
                        </span>
                        <span className="font-mono text-xs font-black text-orange-400">
                          {b.coords || `${b.latitude}, ${b.longitude}`}
                        </span>
                      </div>
                      <a
                        href={b.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-orange-500 text-black font-black text-[10px] uppercase tracking-tighter flex items-center gap-1 transition-colors"
                      >
                        <Compass className="w-3 h-3" />
                        <span>Open Maps</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
                        Direct Hotline &amp; Emails
                      </span>
                      <p className="text-zinc-200 font-mono font-bold">{b.phones.join(' / ')}</p>
                      {b.emails && b.emails.length > 0 && (
                        <p className="text-zinc-400 font-mono text-[11px]">{b.emails.join(' | ')}</p>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
                        Operating Hours
                      </span>
                      <p className="text-zinc-300">{b.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500">
                  <span>{b.manager}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active Counter
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Business Profile, Contacts, Socials (Instagram & TikTok) */}
      {activeTab === 'profile' && (
        <div className="bg-[#111] p-6 sm:p-8 border border-zinc-800 max-w-4xl space-y-6">
          <div>
            <span className="px-2.5 py-0.5 bg-orange-500 text-black font-black text-[10px] uppercase tracking-wider">
              Organization Profile
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase font-display text-white mt-1">
              Business Information, Emails, Phone Numbers &amp; Social Channels
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Keep your contact numbers, official emails, Instagram handle, and TikTok account updated across the app.
            </p>
          </div>

          {profileSavedToast && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Business Profile and Social Channels Successfully Saved!</span>
            </div>
          )}

          <form onSubmit={handleSaveBusinessProfile} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Business Name:
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Tagline:
                </label>
                <input
                  type="text"
                  required
                  value={profileTagline}
                  onChange={(e) => setProfileTagline(e.target.value)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  <span>Phone Numbers (comma separated):</span>
                </label>
                <input
                  type="text"
                  required
                  value={profilePhones}
                  onChange={(e) => setProfilePhones(e.target.value)}
                  placeholder="0728090599, 0725309688, 0712345678"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-500" />
                  <span>Official Emails (comma separated):</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileEmails}
                  onChange={(e) => setProfileEmails(e.target.value)}
                  placeholder="sales@rissauauto.co.ke, info@rissauauto.co.ke"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instagram */}
              <div className="p-4 bg-zinc-900 border border-zinc-800 space-y-2">
                <label className="block font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram Handle / Profile:</span>
                </label>
                <input
                  type="text"
                  value={profileInstagram}
                  onChange={(e) => setProfileInstagram(e.target.value)}
                  placeholder="@rissau_auto_kenya"
                  className="w-full p-3 bg-[#0a0a0a] border border-zinc-800 text-white font-bold"
                />
                <p className="text-[10px] text-zinc-500">
                  Users can click to view automotive content and new stock drops.
                </p>
              </div>

              {/* TikTok */}
              <div className="p-4 bg-zinc-900 border border-zinc-800 space-y-2">
                <label className="block font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>TikTok Handle / Profile:</span>
                </label>
                <input
                  type="text"
                  value={profileTiktok}
                  onChange={(e) => setProfileTiktok(e.target.value)}
                  placeholder="@rissau_auto_agency"
                  className="w-full p-3 bg-[#0a0a0a] border border-zinc-800 text-white font-bold"
                />
                <p className="text-[10px] text-zinc-500">
                  Link to short video demonstrations of parts and tire installations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  M-Pesa Buy Goods Till:
                </label>
                <input
                  type="text"
                  required
                  value={profileTill}
                  onChange={(e) => setProfileTill(e.target.value)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  WhatsApp Hotline:
                </label>
                <input
                  type="text"
                  required
                  value={profileWhatsapp}
                  onChange={(e) => setProfileWhatsapp(e.target.value)}
                  placeholder="254728090599"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  KRA PIN (for Receipts):
                </label>
                <input
                  type="text"
                  value={profileKra}
                  onChange={(e) => setProfileKra(e.target.value)}
                  placeholder="P051982734K"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                Working Hours:
              </label>
              <input
                type="text"
                value={profileHours}
                onChange={(e) => setProfileHours(e.target.value)}
                className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-800">
              <button
                type="submit"
                className="px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save Business Profile &amp; Socials</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add/Edit Product with Camera & Photo Insertion */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111] text-white max-w-xl w-full p-6 max-h-[92vh] overflow-y-auto border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Catalog Editor
                </span>
                <h3 className="font-black uppercase font-display text-lg text-white">
                  {editingProduct ? 'Edit Spare Part & Photo' : 'Add New Spare Part & Take Photo'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Photo Taking & Image Preview Section */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="block font-black uppercase tracking-wider text-zinc-300">
                  Stock Photo / Camera Capture
                </span>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-28 h-28 bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {formImage ? (
                      <img src={formImage} alt="Stock Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-zinc-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* Hidden inputs for Camera and File selection */}
                    <input
                      type="file"
                      ref={cameraInputRef}
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-3.5 py-2 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Take Photo (Camera)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-wider text-xs flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="Or paste Image URL..."
                        className="w-full p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Product / Spare Part Name:
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Michelin LTX Force 265/65R17"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Category:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Product['category'])}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  >
                    <option value="Tires">Tires</option>
                    <option value="Gaskets & Seals">Gaskets &amp; Seals</option>
                    <option value="Oils & Fluids">Oils &amp; Fluids</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Filters">Filters</option>
                    <option value="Electrical & Batteries">Electrical &amp; Batteries</option>
                    <option value="Engine & Cooling">Engine &amp; Cooling</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Brand / Manufacturer:
                  </label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Michelin, Castrol, Toyota"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Price (KES):
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Stock Quantity:
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    OEM Part No:
                  </label>
                  <input
                    type="text"
                    value={formPartNumber}
                    onChange={(e) => setFormPartNumber(e.target.value)}
                    placeholder="e.g. 04331-0K040"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Compatible Vehicles (comma separated):
                </label>
                <input
                  type="text"
                  value={formVehicles}
                  onChange={(e) => setFormVehicles(e.target.value)}
                  placeholder="Toyota Hilux, Toyota Prado 120/150, Isuzu D-Max"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Description / Specifications:
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 bg-zinc-900 text-zinc-300 font-black uppercase tracking-wider border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter"
                >
                  Save Spare Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Sacco Transport / Delivery for Order */}
      {selectedOrderForTransport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111] text-white max-w-lg w-full p-6 border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Transport &amp; Dispatch Hub
                </span>
                <h3 className="font-black uppercase font-display text-lg text-white">
                  Transport for Order #{selectedOrderForTransport.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForTransport(null)}
                className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransportDetails} className="space-y-4 text-xs">
              <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
                <p className="text-zinc-400">
                  Customer: <strong className="text-white">{selectedOrderForTransport.customerName}</strong> ({selectedOrderForTransport.customerPhone})
                </p>
                <p className="text-zinc-400">
                  Destination: <strong className="text-orange-400">{selectedOrderForTransport.deliveryAddress || 'Pickup Counter'}</strong>
                </p>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Courier / Matatu Sacco:
                </label>
                <input
                  type="text"
                  required
                  value={transportSacco}
                  onChange={(e) => setTransportSacco(e.target.value)}
                  placeholder="e.g. 2NK Sacco, Guardian Coach, EasyCoach"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />

                {/* Sacco Quick Chips */}
                <div className="flex gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
                  {COMMON_SACCOS.map((sacco) => (
                    <button
                      key={sacco}
                      type="button"
                      onClick={() => setTransportSacco(sacco)}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase whitespace-nowrap border border-zinc-800"
                    >
                      {sacco}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Vehicle Plate / Waybill #:
                  </label>
                  <input
                    type="text"
                    value={transportPlate}
                    onChange={(e) => setTransportPlate(e.target.value)}
                    placeholder="e.g. KDL 429P / WB-891"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Driver / Stage Phone:
                  </label>
                  <input
                    type="text"
                    value={transportPhone}
                    onChange={(e) => setTransportPhone(e.target.value)}
                    placeholder="e.g. 0722123456"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Arrival Stage / Office:
                  </label>
                  <input
                    type="text"
                    value={transportStage}
                    onChange={(e) => setTransportStage(e.target.value)}
                    placeholder="e.g. Nakuru Town Stage"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Estimated Arrival Time (ETA):
                  </label>
                  <input
                    type="text"
                    value={transportETA}
                    onChange={(e) => setTransportETA(e.target.value)}
                    placeholder="e.g. Today at 4:30 PM"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Parcel Status:
                </label>
                <select
                  value={transportStatus}
                  onChange={(e) => setTransportStatus(e.target.value as any)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                >
                  <option value="Awaiting Dispatch">Awaiting Dispatch</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Ready for Collection at Stage">Ready for Collection at Stage</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Dispatch Notes / Waybill details:
                </label>
                <textarea
                  rows={2}
                  value={transportNotes}
                  onChange={(e) => setTransportNotes(e.target.value)}
                  placeholder="e.g. Parcel wrapped in black heavy polythene, collect with National ID."
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForTransport(null)}
                  className="px-5 py-3 bg-zinc-900 text-zinc-300 font-black uppercase tracking-wider border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>Update &amp; Notify Transport</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Branch Location with Live GPS Pinning */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111] text-white max-w-xl w-full p-6 max-h-[92vh] overflow-y-auto border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Location &amp; GPS Manager
                </span>
                <h3 className="font-black uppercase font-display text-lg text-white">
                  {editingBranch ? 'Edit Branch & GPS Location' : 'Add New Branch Location'}
                </h3>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-4 text-xs">
              {/* GPS Live Pinning Button */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>Live GPS Location Pinning</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleCaptureLiveGps}
                    disabled={isGettingGps}
                    className="px-3.5 py-2 bg-white hover:bg-orange-500 text-black font-black uppercase tracking-tighter text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Compass className={`w-3.5 h-3.5 ${isGettingGps ? 'animate-spin' : ''}`} />
                    <span>{isGettingGps ? 'Pinning GPS...' : '📍 Pin My Live GPS Location'}</span>
                  </button>
                </div>

                {gpsSuccessMessage && (
                  <p className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 p-2 border border-emerald-500/30">
                    {gpsSuccessMessage}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
                      Latitude:
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={branchLat}
                      onChange={(e) => setBranchLat(parseFloat(e.target.value) || '')}
                      placeholder="-1.2815"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
                      Longitude:
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={branchLng}
                      onChange={(e) => setBranchLng(parseFloat(e.target.value) || '')}
                      placeholder="36.8270"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Branch Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. Mombasa Road Mega Hub"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    City / Town:
                  </label>
                  <input
                    type="text"
                    required
                    value={branchCity}
                    onChange={(e) => setBranchCity(e.target.value)}
                    placeholder="e.g. Nairobi / Kisumu / Mombasa / Nakuru"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Short Name / Badge:
                  </label>
                  <input
                    type="text"
                    value={branchShortName}
                    onChange={(e) => setBranchShortName(e.target.value)}
                    placeholder="e.g. Mombasa Rd"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Street Address / Landmark:
                </label>
                <input
                  type="text"
                  required
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  placeholder="e.g. Next to TotalEnergies, Opposite Park, Nairobi"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Branch Phone Numbers:
                  </label>
                  <input
                    type="text"
                    required
                    value={branchPhones}
                    onChange={(e) => setBranchPhones(e.target.value)}
                    placeholder="0728090599, 0725309688"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Branch Emails:
                  </label>
                  <input
                    type="text"
                    value={branchEmails}
                    onChange={(e) => setBranchEmails(e.target.value)}
                    placeholder="sales@rissauauto.co.ke"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Branch Photo (URL or Upload):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={branchImage}
                    onChange={(e) => setBranchImage(e.target.value)}
                    className="flex-1 p-2.5 bg-zinc-900 border border-zinc-800 text-white text-[11px]"
                  />
                  <input
                    type="file"
                    ref={branchFileInputRef}
                    accept="image/*"
                    onChange={handleBranchPhotoCapture}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => branchFileInputRef.current?.click()}
                    className="px-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Operating Hours:
                  </label>
                  <input
                    type="text"
                    value={branchHours}
                    onChange={(e) => setBranchHours(e.target.value)}
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                    Hub Type / Manager:
                  </label>
                  <input
                    type="text"
                    value={branchManager}
                    onChange={(e) => setBranchManager(e.target.value)}
                    placeholder="e.g. Engine Hub & Courier Counter"
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Services Provided (comma separated):
                </label>
                <input
                  type="text"
                  value={branchServices}
                  onChange={(e) => setBranchServices(e.target.value)}
                  placeholder="Tires, Engine Spares, Battery Fitting, Countrywide Dispatch"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-5 py-3 bg-zinc-900 text-zinc-300 font-black uppercase tracking-wider border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter"
                >
                  Save Branch Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal for Screen & Printing */}
      <ReceiptModal
        order={receiptOrder}
        businessProfile={businessProfile}
        onClose={() => setReceiptOrder(null)}
        onSendEmailNotification={onSendOrderEmailNotification}
      />
    </div>
  );
};
