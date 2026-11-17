import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { MENU_ITEMS } from '../data/menuData';
import { useRestaurant } from '../context/RestaurantContext';

export const DealsSection: React.FC = () => {
  const { addToCart, setIsCartOpen } = useRestaurant();
  const deals = MENU_ITEMS.filter((item) => item.category === 'deals');

  const handleAddDeal = (item: (typeof MENU_ITEMS)[0], event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonEl = event.currentTarget;
    const cardEl = buttonEl.closest('.relative');
    const imgEl = (cardEl?.querySelector('img') as HTMLElement) || buttonEl;

    addToCart(
      {
        cartItemId: `deal-${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        basePrice: item.basePrice,
        unitPrice: item.basePrice,
        quantity: 1,
        itemTotal: item.basePrice,
        selectedAddOns: [],
        image: item.image,
      },
      imgEl
    );
  };

  return (
    <section id="deals-section" className="py-14 sm:py-20 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Value Combos & Savings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Special Super Saver Deals
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enjoy complete feasts with big savings. Ideal for family gatherings, friends hangouts, and midnight hunger.
          </p>
        </div>

        {/* Deals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {deals.map((deal, idx) => (
            <div
              key={deal.id}
              className={`relative bg-white dark:bg-[#161924] rounded-2xl border p-6 flex flex-col justify-between space-y-6 hover:-translate-y-1.5 transition-all duration-300 shadow-md dark:shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-600 ${
                idx === 2
                  ? 'border-amber-500 ring-1 ring-amber-400'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              {idx === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-black text-[11px] font-black rounded-full uppercase tracking-wider shadow-md">
                  Most Popular Family Choice
                </div>
              )}

              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-[#202535]">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{deal.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{deal.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">Deal Price</span>
                  <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums truncate block">
                    Rs. {deal.basePrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={(e) => handleAddDeal(deal, e)}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Deal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
