import React from 'react';
import { Phone, MessageSquare, MapPin, Car, ShoppingCart, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';
import { VehicleSelection } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenCarSelector: () => void;
  onOpenAiAdvisor: () => void;
  selectedVehicle: VehicleSelection | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenCarSelector,
  onOpenAiAdvisor,
  selectedVehicle,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md text-white border-b border-zinc-800">
      {/* Top status & quick contact bar */}
      <div className="bg-[#050505] px-4 py-2 text-xs border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-black px-2.5 py-0.5 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 rounded-xs">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              ONLINE IN NAIROBI
            </div>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400 font-bold uppercase text-[11px] tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Kirinyaga Rd (CBD) &amp; Umoja (Kangundo Rd)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <a
              href={`tel:${BUSINESS_INFO.phones[0]}`}
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-orange-500 transition-colors uppercase tracking-wider text-[11px]"
            >
              <Phone className="w-3 h-3 text-orange-500" />
              <span>{BUSINESS_INFO.phones[0]}</span>
            </a>
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=Hello%20Rissau%20Auto%20Agency`}
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-black font-black text-xl sm:text-2xl flex items-center justify-center tracking-tighter group-hover:scale-105 transition-transform rounded-xs">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-white group-hover:text-orange-500 transition-colors leading-none font-display">
                  RISSAU AUTO
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] bg-zinc-800 text-orange-400 border border-zinc-700">
                  EST. 2020
                </span>
              </div>
              <p className="text-orange-500 font-bold uppercase tracking-[0.25em] text-[10px] mt-1 hidden sm:block">
                Serving customers since 2020
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Vehicle Selector Badge / Trigger */}
            <button
              onClick={onOpenCarSelector}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider border transition-all ${
                selectedVehicle
                  ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                  : 'bg-[#111] hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              <Car className={`w-4 h-4 ${selectedVehicle ? 'text-orange-500' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">
                {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Select Car Match'}
              </span>
              <span className="sm:hidden">
                {selectedVehicle ? selectedVehicle.make : 'Car'}
              </span>
            </button>

            {/* AI Advisor Button */}
            <button
              onClick={onOpenAiAdvisor}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>AI Parts Advisor</span>
            </button>

            {/* Cart Status Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-white hover:bg-orange-500 hover:text-black text-black font-black uppercase tracking-tighter text-xs sm:text-sm transition-colors active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart Status:</span>
              <span className="font-black italic text-sm">
                {cartCount < 10 ? `0${cartCount}` : cartCount} ITEMS
              </span>
            </button>
          </div>
        </div>

        {/* Desktop tab bar */}
        <div className="hidden md:flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800 text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-orange-500 text-black font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Spare Parts Catalog
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-2 transition-all cursor-pointer ${
              activeTab === 'locations'
                ? 'bg-orange-500 text-black font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Store Locations (CBD &amp; Umoja)
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-4 py-2 transition-all cursor-pointer ${
              activeTab === 'cart'
                ? 'bg-orange-500 text-black font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Cart &amp; M-Pesa ({cartCount})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-orange-500 text-black font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Admin Portal
          </button>
        </div>
      </div>
    </header>
  );
};
