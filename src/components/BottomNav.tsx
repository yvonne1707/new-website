import React from 'react';
import { Store, Car, MapPin, ShoppingCart, UserCheck, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCarSelector: () => void;
  onOpenAiAdvisor: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCarSelector,
  onOpenAiAdvisor,
}) => {
  return (
    <>
      {/* Floating AI Advisor Bubble for Mobile */}
      <button
        onClick={onOpenAiAdvisor}
        className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-orange-500 text-black flex items-center justify-center shadow-2xl border-2 border-white/20 active:scale-95 transition-transform"
        aria-label="Ask AI Auto Parts Advisor"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-md border-t border-zinc-800 px-2 py-2 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center py-1 px-3 transition-all ${
            activeTab === 'shop'
              ? 'text-orange-500 font-black'
              : 'text-zinc-500 hover:text-zinc-300 font-bold'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider mt-0.5 font-bold">Catalog</span>
        </button>

        <button
          onClick={onOpenCarSelector}
          className="flex flex-col items-center py-1 px-3 text-zinc-500 hover:text-zinc-300 font-bold transition-all"
        >
          <Car className="w-5 h-5 text-orange-500" />
          <span className="text-[9px] uppercase tracking-wider mt-0.5 font-bold">Car Match</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex flex-col items-center py-1 px-3 transition-all ${
            activeTab === 'locations'
              ? 'text-orange-500 font-black'
              : 'text-zinc-500 hover:text-zinc-300 font-bold'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider mt-0.5 font-bold">Branches</span>
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          className={`relative flex flex-col items-center py-1 px-3 transition-all ${
            activeTab === 'cart'
              ? 'text-orange-500 font-black'
              : 'text-zinc-500 hover:text-zinc-300 font-bold'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-orange-500 text-black flex items-center justify-center text-[9px] font-black">
              {cartCount}
            </span>
          )}
          <span className="text-[9px] uppercase tracking-wider mt-0.5 font-bold">Cart</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center py-1 px-3 transition-all ${
            activeTab === 'admin'
              ? 'text-orange-500 font-black'
              : 'text-zinc-500 hover:text-zinc-300 font-bold'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider mt-0.5 font-bold">Admin</span>
        </button>
      </nav>
    </>
  );
};
