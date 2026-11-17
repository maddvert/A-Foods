import React, { useState, useCallback } from 'react';
import { Search, Plus, SlidersHorizontal, Flame, Check, Mic, MicOff } from 'lucide-react';
import { MENU_ITEMS } from '../data/menuData';
import { FoodCategory, MenuItem } from '../types/restaurant';
import { useRestaurant } from '../context/RestaurantContext';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { useVoiceInput } from '../hooks/useVoiceInput';

const CATEGORIES: { id: FoodCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: '🍽️' },
  { id: 'pizza', label: 'Cheesy Pizza', icon: '🍕' },
  { id: 'pakoras', label: 'Crispy Pakoras', icon: '✨' },
  { id: 'chaat', label: 'Gol Gappay & Chaat', icon: '🍲' },
  { id: 'samosas', label: 'Crispy Samosas', icon: '🥟' },
  { id: 'rolls', label: 'Rolls & Spring Rolls', icon: '🌯' },
  { id: 'kababs', label: 'Chapli & Shami Kababs', icon: '🔥' },
  { id: 'deals', label: 'Super Deals', icon: '🎁' },
  { id: 'beverages', label: 'Chilled Drinks', icon: '🥤' },
];

export const MenuSection: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setCustomizingItem,
    addToCart,
  } = useRestaurant();

  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);

  const handleVoiceSearchTranscript = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [setSearchQuery]
  );

  const {
    isSupported: isVoiceSupported,
    isListening: isVoiceListening,
    error: voiceError,
    toggleListening: toggleVoiceSearch,
  } = useVoiceInput({ onTranscript: handleVoiceSearchTranscript });

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ? true : item.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCardAction = (item: MenuItem, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonEl = event.currentTarget;
    const cardEl = buttonEl.closest('.group');
    const imgEl = (cardEl?.querySelector('img') as HTMLElement) || buttonEl;

    // If item has customizable options (sizes, crusts, portions, addons), open modal
    if (
      (item.sizes && item.sizes.length > 0) ||
      (item.crusts && item.crusts.length > 0) ||
      (item.portions && item.portions.length > 0) ||
      (item.availableAddOns && item.availableAddOns.length > 0)
    ) {
      setCustomizingItem(item);
    } else {
      // Direct Add with smooth fly-to-cart animation starting from the food image
      addToCart(
        {
          cartItemId: `${item.id}-${Date.now()}`,
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

      setAddedItemEffect(item.id);
      setTimeout(() => setAddedItemEffect(null), 1200);
    }
  };

  return (
    <section id="menu-section" className="py-14 sm:py-20 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              Fresh & Crunchy Selection
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A. FOODS Delicious Menu
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Choose your favorite hot cheesy pizzas, crispy pakoras, chapli kababs, samosas, chicken cheese rolls, dahi baray, or gol gappay. Handcrafted fresh on every order.
            </p>
          </div>

          {/* Search Bar with Web Speech Voice-to-Text */}
          <div className="w-full md:w-80 space-y-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isVoiceListening ? 'Listening... say a dish name' : 'Search pizza, pakoras, rolls, gol gappay...'}
                className={`w-full pl-10 ${searchQuery ? 'pr-20' : 'pr-11'} py-2.5 bg-slate-100 dark:bg-[#171a23] border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all ${
                  isVoiceListening
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : 'border-slate-200 dark:border-white/10'
                }`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white px-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                {isVoiceSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceSearch}
                    title={isVoiceListening ? 'Stop voice search' : 'Search by voice'}
                    aria-label={isVoiceListening ? 'Stop voice search' : 'Search menu by voice'}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      isVoiceListening
                        ? 'bg-red-500 text-white animate-pulse shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-amber-500/10'
                    }`}
                  >
                    {isVoiceListening ? (
                      <MicOff className="w-3.5 h-3.5" />
                    ) : (
                      <Mic className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            {voiceError && (
              <p className="text-[11px] text-red-500 px-1">{voiceError}</p>
            )}
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-slate-100 dark:bg-[#171a23] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1f2430] border border-slate-200 dark:border-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid with Upward Stagger Animations */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 dark:bg-[#141720] rounded-2xl border border-slate-200 dark:border-white/10">
            <p className="text-base text-slate-700 dark:text-slate-300 font-medium">
              No food items match "{searchQuery}"
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching for "pizza", "pakoras", "samosas", "rolls", "gol gappay", or click All Items.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, idx) => {
              const isAdded = addedItemEffect === item.id;
              const hasOptions =
                (item.sizes && item.sizes.length > 0) ||
                (item.crusts && item.crusts.length > 0) ||
                (item.portions && item.portions.length > 0) ||
                (item.availableAddOns && item.availableAddOns.length > 0);

              return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-[#151821] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between hover:border-amber-400/50 hover:-translate-y-1.5 transition-all duration-300 shadow-sm dark:shadow-lg dark:shadow-black/40 animate-in fade-in slide-in-from-bottom-5 duration-500"
                  style={{ animationDelay: `${(idx % 6) * 70}ms` }}
                >
                  {/* Food Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-[#1f232e]">
                    <ImageWithSkeleton
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600 ease-out"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {item.isChefSpecial && (
                        <span className="px-2.5 py-1 text-[11px] font-bold text-amber-950 bg-amber-400 rounded-md shadow-sm">
                          Special
                        </span>
                      )}
                      {item.isPopular && !item.isChefSpecial && (
                        <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-red-600 rounded-md shadow-sm">
                          Hot Seller
                        </span>
                      )}
                    </div>

                    {/* Spice Level */}
                    {item.spiceLevel && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium text-white bg-black/60 backdrop-blur-md rounded border border-white/10 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>{item.spiceLevel}</span>
                      </div>
                    )}
                  </div>

                  {/* Food Info & Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">
                          {hasOptions ? 'Starts from' : 'Price'}
                        </span>
                        <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums truncate block">
                          Rs. {item.basePrice.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleCardAction(item, e)}
                        className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                          isAdded
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-400 text-black hover:bg-amber-300 active:scale-95 shadow-sm'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : hasOptions ? (
                          <>
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Customize</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
