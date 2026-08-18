import React from 'react';
import { Phone, MessageSquare, MapPin, Car, ShoppingCart, Sparkles, Instagram, Share2 } from 'lucide-react';
import { VehicleSelection, BusinessProfile, BranchLocation } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenCarSelector: () => void;
  onOpenAiAdvisor: () => void;
  selectedVehicle: VehicleSelection | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  businessProfile: BusinessProfile;
  branches: BranchLocation[];
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenCarSelector,
  onOpenAiAdvisor,
  selectedVehicle,
  activeTab,
  setActiveTab,
  businessProfile,
  branches,
}) => {
  const primaryPhone = businessProfile.phones[0] || '0728090599';
  const branchSummary = branches.map((b) => b.shortName).join(' & ') || 'Nairobi Branches';

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md text-white border-b border-zinc-800">
      {/* Top status & quick contact bar */}
      <div className="bg-[#050505] px-4 py-2 text-xs border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-black px-2.5 py-0.5 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 rounded-xs">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              LIVE IN KENYA
            </div>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400 font-bold uppercase text-[11px] tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              {branchSummary}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <a
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-orange-500 transition-colors uppercase tracking-wider text-[11px]"
            >
              <Phone className="w-3 h-3 text-orange-500" />
              <span>{primaryPhone}</span>
            </a>
            <a
              href={`https://wa.me/${businessProfile.whatsapp}?text=Hello%20${encodeURIComponent(businessProfile.name)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider text-[11px]"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Bold Typographic Name */}
          <div 
            onClick={() => setActiveTab('shop')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {businessProfile.profilePicture ? (
              <img
                src={businessProfile.profilePicture}
                alt={businessProfile.name}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover border-2 border-orange-500 rounded-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-black font-black text-xl sm:text-2xl flex items-center justify-center tracking-tighter group-hover:scale-105 transition-transform rounded-xs">
                {businessProfile.name.charAt(0) || 'R'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter font-display text-white group-hover:text-orange-500 transition-colors">
                  {businessProfile.name}
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border border-zinc-700">
                  Est. 2020
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest hidden sm:block">
                {businessProfile.tagline}
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-white text-black font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Spare Parts Catalog
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'locations'
                  ? 'bg-white text-black font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Store Locations ({branches.length})
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-orange-500 text-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Admin Portal
            </button>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Vehicle Match Selector Button */}
            <button
              onClick={onOpenCarSelector}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                selectedVehicle
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400 hover:bg-orange-500/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
              }`}
              title="Select your car to filter exact fitting parts"
            >
              <Car className="w-3.5 h-3.5 text-orange-500" />
              <span className="max-w-[120px] sm:max-w-[150px] truncate">
                {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Select Vehicle'}
              </span>
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={onOpenAiAdvisor}
              className="px-3 py-2 bg-[#161616] hover:bg-zinc-800 text-orange-400 hover:text-orange-300 border border-orange-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative px-3.5 sm:px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-tight flex items-center gap-2 transition-transform active:scale-95 cursor-pointer rounded-xs"
              aria-label="View shopping cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="font-mono bg-black text-white text-[11px] px-1.5 py-0.2 rounded-xs font-black">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
