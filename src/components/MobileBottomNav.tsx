import React from 'react';
import { Utensils, Sparkles, Bike, ShoppingBag, MapPin } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const MobileBottomNav: React.FC = () => {
  const { itemCount, setIsCartOpen, setIsTrackingOpen, activeOrder, setIsLocationModalOpen } =
    useRestaurant();

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDeals = () => {
    const el = document.getElementById('deals-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#12151e]/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/10 px-4 py-2 transition-colors duration-200">
      <div className="flex items-center justify-around text-[10px] font-semibold text-slate-600 dark:text-slate-400">
        <button
          onClick={scrollToMenu}
          className="flex flex-col items-center gap-1 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95 transition-all p-1 cursor-pointer"
        >
          <Utensils className="w-4 h-4" />
          <span>Menu</span>
        </button>

        <button
          onClick={scrollToDeals}
          className="flex flex-col items-center gap-1 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95 transition-all p-1 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Deals</span>
        </button>

        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95 transition-all p-1 cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>Area</span>
        </button>

        <button
          onClick={() => setIsTrackingOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95 transition-all p-1 relative cursor-pointer"
        >
          <Bike className="w-4 h-4" />
          <span>Track</span>
          {activeOrder && activeOrder.status !== 'delivered' && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-amber-600 dark:text-amber-400 active:scale-95 transition-all p-1 relative font-bold cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-amber-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
      </div>
    </div>
  );
};
