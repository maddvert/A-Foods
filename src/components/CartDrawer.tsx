import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Bike,
  Store,
  ArrowRight,
  ShieldCheck,
  Banknote,
  CreditCard,
  Send,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Mic,
  MicOff,
  Sparkles,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/menuData';
import { CustomerDetails } from '../types/restaurant';
import { generateWhatsAppOrderLink } from '../utils/whatsapp';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { ImageWithSkeleton } from './ImageWithSkeleton';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    deliveryFee,
    discount,
    total,
    orderType,
    setOrderType,
    placeOrder,
    deliveryLocation,
    setIsLocationModalOpen,
    currentUser,
    addToCart,
  } = useRestaurant();

  const [voiceOrderFeedback, setVoiceOrderFeedback] = useState<string | null>(null);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'online_transfer'>('cash_on_delivery');

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.savedAddresses[0]?.address || deliveryLocation.address,
    landmark: currentUser?.savedAddresses[0]?.landmark || '',
    notes: '',
    orderType: 'delivery',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Hands-free voice order parser: splits clauses by "and"/comma, extracts quantity + best matching dish
  const handleVoiceCartTranscript = React.useCallback(
    (transcript: string, isFinal: boolean) => {
      setLastSpokenText(transcript);
      if (!isFinal) return;

      const wordQtyMap: Record<string, number> = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
      };

      const clauses = transcript
        .toLowerCase()
        .split(/\b(?:and|plus|with)\b|,/i)
        .map((s) => s.trim())
        .filter(Boolean);

      const addedNames: string[] = [];

      clauses.forEach((clause) => {
        const digitMatch = clause.match(/\b(\d+)\b/);
        let qty = digitMatch ? Math.min(10, Math.max(1, parseInt(digitMatch[1], 10))) : 1;
        if (!digitMatch) {
          for (const [word, val] of Object.entries(wordQtyMap)) {
            if (new RegExp(`\\b${word}\\b`, 'i').test(clause)) {
              qty = val;
              break;
            }
          }
        }

        const cleanedClause = clause
          .replace(/\b(add|order|please|want|get|give|me|one|two|three|four|five|six|\d+)\b/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const tokens = cleanedClause.split(' ').filter((t) => t.length >= 3);
        if (tokens.length === 0) return;

        let bestMatch = MENU_ITEMS[0];
        let bestScore = 0;

        for (const item of MENU_ITEMS) {
          const haystack = `${item.name} ${item.category}`.toLowerCase();
          let score = 0;
          for (const token of tokens) {
            const singular = token.endsWith('s') ? token.slice(0, -1) : token;
            if (haystack.includes(token) || haystack.includes(singular)) {
              score += 1;
            }
          }
          if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
          }
        }

        if (bestScore > 0) {
          addToCart({
            cartItemId: `voice-${bestMatch.id}-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 5)}`,
            menuItemId: bestMatch.id,
            name: bestMatch.name,
            basePrice: bestMatch.basePrice,
            unitPrice: bestMatch.basePrice,
            quantity: qty,
            itemTotal: bestMatch.basePrice * qty,
            selectedAddOns: [],
            image: bestMatch.image,
          });
          addedNames.push(`${qty}x ${bestMatch.name}`);
        }
      });

      if (addedNames.length > 0) {
        setVoiceOrderFeedback(`Added to cart: ${addedNames.join(', ')}`);
      } else {
        setVoiceOrderFeedback(
          `Heard "${transcript}" — try saying e.g. "2 Chicken Cheese Roll" or "1 Tikka Pizza".`
        );
      }
    },
    [addToCart]
  );

  const {
    isSupported: isVoiceSupported,
    isListening: isVoiceOrderListening,
    error: voiceOrderError,
    toggleListening: toggleVoiceOrder,
  } = useVoiceInput({ onTranscript: handleVoiceCartTranscript });

  const handleAddressVoiceTranscript = React.useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      setCustomer((prev) => ({
        ...prev,
        address: prev.address ? `${prev.address.trim()}, ${text}` : text,
      }));
    }
  }, []);

  const {
    isListening: isAddressListening,
    toggleListening: toggleAddressVoice,
  } = useVoiceInput({ onTranscript: handleAddressVoiceTranscript });

  const handleNotesVoiceTranscript = React.useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      setCustomer((prev) => ({
        ...prev,
        notes: prev.notes ? `${prev.notes.trim()} ${text}` : text,
      }));
    }
  }, []);

  const {
    isListening: isNotesListening,
    toggleListening: toggleNotesVoice,
  } = useVoiceInput({ onTranscript: handleNotesVoiceTranscript });

  if (!isCartOpen) return null;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Please enter your name';
    if (!customer.phone.trim() || customer.phone.length < 10) {
      errors.phone = 'Valid phone / WhatsApp number required';
    }
    if (orderType === 'delivery') {
      if (!customer.address.trim() || customer.address.length < 8) {
        errors.address = 'Please provide full delivery address';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmOrder = () => {
    if (!validateForm()) return;
    const orderCustomer: CustomerDetails = {
      ...customer,
      orderType,
      areaName: deliveryLocation.name,
      distanceKm: deliveryLocation.distanceKm,
    };
    placeOrder(orderCustomer, paymentMethod);
    setStep('cart');
  };

  const handleWhatsAppCheckout = () => {
    if (!validateForm()) return;
    const orderCustomer: CustomerDetails = {
      ...customer,
      orderType,
      areaName: deliveryLocation.name,
      distanceKm: deliveryLocation.distanceKm,
    };
    const newOrder = placeOrder(orderCustomer, paymentMethod);
    const link = generateWhatsAppOrderLink(newOrder);
    window.open(link, '_blank');
    setStep('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#13161f] text-slate-900 dark:text-white border-l border-slate-200 dark:border-white/10 flex flex-col shadow-2xl transition-colors duration-200">
          {/* Drawer Top Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-[#171a24]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold">
                {step === 'cart' ? 'Your Shopping Bag' : 'Checkout & Delivery'}
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5 cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher: Delivery vs Takeaway */}
          <div className="p-4 bg-slate-50/80 dark:bg-[#11131a] border-b border-slate-200 dark:border-white/5 space-y-2">
            <div className="grid grid-cols-2 gap-2 bg-slate-200/70 dark:bg-[#1b1f2b] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Home Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Self Pickup</span>
              </button>
            </div>

            {/* Delivery Area Bar */}
            {orderType === 'delivery' && (
              <div
                onClick={() => setIsLocationModalOpen(true)}
                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs cursor-pointer hover:bg-amber-500/15 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {deliveryLocation.name}
                    </span>{' '}
                    <span className="text-slate-500 dark:text-slate-400">
                      ({deliveryLocation.distanceKm} km · Rs. {deliveryLocation.deliveryFee} fee)
                    </span>
                  </div>
                </div>
                <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 text-[11px] flex items-center">
                  Change <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            )}
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Hands-Free Voice Order Bar (Web Speech API) */}
            {step === 'cart' && isVoiceSupported && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Hands-Free Voice Order
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Say e.g. "Add 2 Chicken Cheese Roll and 1 Supreme Pizza"
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleVoiceOrder}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                      isVoiceOrderListening
                        ? 'bg-red-500 text-white animate-pulse shadow-sm'
                        : 'bg-amber-400 hover:bg-amber-300 text-black'
                    }`}
                  >
                    {isVoiceOrderListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Speak Order</span>
                      </>
                    )}
                  </button>
                </div>

                {lastSpokenText && isVoiceOrderListening && (
                  <p className="text-[11px] italic text-amber-700 dark:text-amber-300">
                    Hearing: "{lastSpokenText}"
                  </p>
                )}
                {voiceOrderFeedback && (
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {voiceOrderFeedback}
                  </p>
                )}
                {voiceOrderError && (
                  <p className="text-[11px] text-red-500">{voiceOrderError}</p>
                )}
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-14 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold">Your cart is empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Add crispy pakoras, samosas, chicken cheese rolls, or chaat from our delicious menu, or use voice ordering above.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 text-xs font-bold bg-amber-400 text-black rounded-xl hover:bg-amber-300 shadow-md cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : step === 'cart' ? (
              <>
                {/* Itemized Cart List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3.5 bg-slate-50 dark:bg-[#181b26] border border-slate-200 dark:border-white/10 rounded-xl flex gap-3 relative group"
                    >
                      <ImageWithSkeleton
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        wrapperClassName="w-16 h-16 rounded-lg shrink-0 bg-slate-200 dark:bg-[#222736]"
                        className="w-full h-full object-cover"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected options preview */}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                          {item.selectedSize && <div>Size: {item.selectedSize}</div>}
                          {item.selectedCrust && <div>Crust: {item.selectedCrust}</div>}
                          {item.selectedPortion && <div>Portion: {item.selectedPortion}</div>}
                          {item.selectedSpice && <div>Spice: {item.selectedSpice}</div>}
                          {item.selectedAddOns.length > 0 && (
                            <div className="text-amber-600 dark:text-amber-400 truncate">
                              + {item.selectedAddOns.map((a) => a.name).join(', ')}
                            </div>
                          )}
                          {item.instructions && (
                            <div className="italic text-slate-400 truncate">
                              "{item.instructions}"
                            </div>
                          )}
                        </div>

                        {/* Price and quantity stepper */}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                            Rs. {item.itemTotal.toLocaleString()}
                          </span>

                          <div className="flex items-center gap-1.5 bg-white dark:bg-[#11131a] border border-slate-200 dark:border-white/10 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="p-1 text-slate-500 hover:text-black dark:hover:text-white rounded cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="p-1 text-slate-500 hover:text-black dark:hover:text-white rounded cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free Delivery Meter */}
                {orderType === 'delivery' && (
                  <div className="p-3 bg-slate-50 dark:bg-[#171a24] rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Free Delivery Goal:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold tabular-nums">
                        {subtotal >= RESTAURANT_INFO.freeDeliveryThreshold
                          ? 'FREE DELIVERY UNLOCKED!'
                          : `Add Rs. ${(RESTAURANT_INFO.freeDeliveryThreshold - subtotal).toLocaleString()} more`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-black/40 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (subtotal / RESTAURANT_INFO.freeDeliveryThreshold) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* STEP 2: Checkout Details Form */
              <div className="space-y-4 text-xs">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 mb-2 font-medium cursor-pointer"
                >
                  ← Back to cart items
                </button>

                <div className="space-y-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g. Usama Khan"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1e2a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.fullName && (
                    <span className="text-red-500 text-[11px]">{formErrors.fullName}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="e.g. 0300 1234567"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1e2a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.phone && (
                    <span className="text-red-500 text-[11px]">{formErrors.phone}</span>
                  )}
                </div>

                {orderType === 'delivery' && (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <label className="block text-slate-700 dark:text-slate-300 font-bold">
                          Delivery Street Address <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          {isVoiceSupported && (
                            <button
                              type="button"
                              onClick={toggleAddressVoice}
                              title="Dictate street address by voice"
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                                isAddressListening
                                  ? 'bg-red-500 text-white animate-pulse'
                                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                              }`}
                            >
                              {isAddressListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                              <span>{isAddressListening ? 'Stop' : 'Speak'}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsLocationModalOpen(true)}
                            className="text-amber-600 dark:text-amber-400 text-[11px] hover:underline cursor-pointer"
                          >
                            Change Area ({deliveryLocation.name})
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="House / Flat No, Street, Sector or Block..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1e2a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                      {formErrors.address && (
                        <span className="text-red-500 text-[11px]">{formErrors.address}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-700 dark:text-slate-300 font-bold">
                        Nearest Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={customer.landmark}
                        onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                        placeholder="e.g. Near Bilal Masjid, Opposite Bank"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1e2a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-bold">
                      Delivery Instructions (Optional)
                    </label>
                    {isVoiceSupported && (
                      <button
                        type="button"
                        onClick={toggleNotesVoice}
                        title="Dictate delivery notes by voice"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                          isNotesListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                        }`}
                      >
                        {isNotesListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                        <span>{isNotesListening ? 'Stop' : 'Speak'}</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    placeholder="e.g. Call upon arrival, bring change for Rs. 5,000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1e2a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Payment Selection */}
                <div className="space-y-2 pt-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-slate-900 dark:text-white ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181b26] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Banknote className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="font-bold">Cash on Delivery (COD)</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Pay in cash when order arrives at your door
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                        Recommended
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online_transfer')}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        paymentMethod === 'online_transfer'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-slate-900 dark:text-white ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181b26] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-amber-500" />
                        <div>
                          <div className="font-bold">EasyPaisa / JazzCash / Bank</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Transfer directly and share screenshot on WhatsApp
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Order Summary & Primary Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#171a24] border-t border-slate-200 dark:border-white/10 space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Delivery ({deliveryLocation.name}):</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-500 font-bold">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span className="text-amber-600 dark:text-amber-400 tabular-nums">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleConfirmOrder}
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Place Order (Cash on Delivery)</span>
                  </button>

                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/20"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.07-.09-.23-.15-.47-.27z" />
                    </svg>
                    <span>Send Order Directly to WhatsApp</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
