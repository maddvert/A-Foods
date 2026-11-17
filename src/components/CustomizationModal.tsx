import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { AddOnOption } from '../types/restaurant';
import { ImageWithSkeleton } from './ImageWithSkeleton';

export const CustomizationModal: React.FC = () => {
  const { customizingItem, setCustomizingItem, addToCart, setIsCartOpen } = useRestaurant();

  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [selectedCrustIdx, setSelectedCrustIdx] = useState(0);
  const [selectedPortionIdx, setSelectedPortionIdx] = useState(0);
  const [selectedSpice, setSelectedSpice] = useState<string>('Medium');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (customizingItem) {
      setSelectedSizeIdx(0);
      setSelectedCrustIdx(0);
      setSelectedPortionIdx(0);
      setSelectedSpice(customizingItem.spiceLevel || 'Medium');
      setSelectedAddOns([]);
      setInstructions('');
      setQuantity(1);
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  const item = customizingItem;

  const basePrice = item.basePrice;
  const sizePrice = item.sizes ? item.sizes[selectedSizeIdx]?.priceDelta || 0 : 0;
  const crustPrice = item.crusts ? item.crusts[selectedCrustIdx]?.priceDelta || 0 : 0;
  const portionPrice = item.portions ? item.portions[selectedPortionIdx]?.priceDelta || 0 : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);

  const unitPrice = basePrice + sizePrice + crustPrice + portionPrice + addOnsTotal;
  const itemTotal = unitPrice * quantity;

  const handleToggleAddOn = (addon: AddOnOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    const modalEl = event.currentTarget.closest('.relative');
    const imgEl = (modalEl?.querySelector('img') as HTMLElement) || event.currentTarget;

    addToCart(
      {
        cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        menuItemId: item.id,
        name: item.name,
        basePrice: item.basePrice,
        selectedSize: item.sizes ? item.sizes[selectedSizeIdx]?.name : undefined,
        selectedCrust: item.crusts ? item.crusts[selectedCrustIdx]?.name : undefined,
        selectedPortion: item.portions ? item.portions[selectedPortionIdx]?.label : undefined,
        selectedSpice,
        selectedAddOns: selectedAddOns.map((a) => ({ id: a.id, name: a.name, price: a.price })),
        instructions: instructions.trim() ? instructions.trim() : undefined,
        unitPrice,
        quantity,
        itemTotal,
        image: item.image,
      },
      imgEl
    );

    setCustomizingItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-[#141721] text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
          <ImageWithSkeleton
            src={item.image}
            alt={item.name}
            loading="lazy"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          <button
            onClick={() => setCustomizingItem(null)}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-xl font-bold leading-tight">{item.name}</h3>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              Base Price: Rs. {item.basePrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Scrollable Options Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Size Selection (e.g. for Pizza) */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Choose Size <span className="text-amber-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {item.sizes.map((size, idx) => {
                  const isSelected = selectedSizeIdx === idx;
                  return (
                    <button
                      key={size.name}
                      type="button"
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1c202d] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-xs sm:text-sm">{size.name}</div>
                      {size.serves && (
                        <div className="text-[11px] text-slate-400">{size.serves}</div>
                      )}
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                        Rs. {(item.basePrice + size.priceDelta).toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Portion Selection (e.g. for Platters, Pakoras, or Samosas) */}
          {item.portions && item.portions.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Choose Portion <span className="text-amber-500">*</span>
              </label>
              <div className="space-y-2">
                {item.portions.map((portion, idx) => {
                  const isSelected = selectedPortionIdx === idx;
                  return (
                    <button
                      key={portion.label}
                      type="button"
                      onClick={() => setSelectedPortionIdx(idx)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1c202d] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <span className="font-semibold text-xs sm:text-sm">{portion.label}</span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                        Rs. {(item.basePrice + portion.priceDelta).toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Crust Selection (for Pizza) */}
          {item.crusts && item.crusts.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Pizza Crust
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.crusts.map((crust, idx) => {
                  const isSelected = selectedCrustIdx === idx;
                  return (
                    <button
                      key={crust.name}
                      type="button"
                      onClick={() => setSelectedCrustIdx(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1c202d] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium text-xs">{crust.name}</div>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400">
                        {crust.priceDelta === 0 ? 'Standard' : `+Rs. ${crust.priceDelta}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level Preference */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              Spice Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Mild', 'Medium', 'Spicy Hot'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedSpice(level)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedSpice === level
                      ? 'border-amber-500 bg-amber-400 text-black font-bold'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1c202d] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252a3a]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons Checklist */}
          {item.availableAddOns && item.availableAddOns.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Extra Toppings & Dips
              </label>
              <div className="space-y-2">
                {item.availableAddOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddOn(addon)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-colors ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1c202d] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-amber-400 border-amber-400 text-black'
                              : 'border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm">{addon.name}</span>
                      </div>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
                        +Rs. {addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              Kitchen Instructions (Optional)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra crispy, send extra mint dip..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#1c202d] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 bg-slate-50 dark:bg-[#11141c] border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1c202d] border border-slate-200 dark:border-white/10 rounded-xl p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center font-bold text-slate-900 dark:text-white text-sm tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold rounded-xl text-sm flex items-center justify-between shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <span>Add to Cart</span>
            <span className="tabular-nums">Rs. {itemTotal.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
