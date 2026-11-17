import React from 'react';
import { Flame, Clock, ShieldCheck, Banknote, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { useRestaurant } from '../context/RestaurantContext';
import { generateGeneralWhatsAppInquiryLink } from '../utils/whatsapp';
import { FOOD_IMAGES } from '../assets/images';
import { ImageWithSkeleton } from './ImageWithSkeleton';

export const HeroSection: React.FC = () => {
  const { deliveryLocation, setIsLocationModalOpen } = useRestaurant();

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-14 md:py-20 lg:py-24 border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -top-12 -left-20 w-96 h-96 bg-red-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Clean Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Authentic Fast Food & Street Delicacies</span>
              </span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-amber-500 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Location: {deliveryLocation.name}</span>
              </button>
            </div>

            {/* Display Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] text-balance break-words">
              Pizza, Chapli Kababs, Gol Gappay & Chicken Cheese Rolls{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500">
                Delivered Hot to Your Door.
              </span>
            </h1>

            {/* Pure English Editorial Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Experience the unmatched taste of our hot cheesy pizzas, golden samosas, handmade chapli kababs, chilled gol gappay, and chicken cheese rolls made fresh on every single order.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
              <button
                onClick={scrollToMenu}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Order Online Now (COD)</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href={generateGeneralWhatsAppInquiryLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-lg shadow-emerald-950/30 active:scale-98 transition-all whitespace-nowrap cursor-pointer"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.07-.09-.23-.15-.47-.27z" />
                </svg>
                <span>WhatsApp: {RESTAURANT_INFO.phone}</span>
              </a>
            </div>

            {/* Claim-to-Proof Features Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">30 - 45 Mins</div>
                  <div className="text-slate-500 text-[11px]">Hot & Fast Delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Cash on Delivery</div>
                  <div className="text-slate-500 text-[11px]">Pay at Doorstep</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Fresh Daily</div>
                  <div className="text-slate-500 text-[11px]">Premium Poultry</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Hot & Crunchy</div>
                  <div className="text-slate-500 text-[11px]">Cooked on Demand</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase (5 cols) with Upward Slide Animation */}
          <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-bottom-8 duration-900">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-2xl shadow-black/30 group">
              <ImageWithSkeleton
                src={FOOD_IMAGES.heroFeastSpread}
                alt="A. FOODS Signature Counter Delicacies Spread"
                loading="lazy"
                wrapperClassName="w-full h-[360px] sm:h-[440px] lg:h-[480px]"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-3 sm:p-3.5 bg-black/80 backdrop-blur-md rounded-xl border border-white/15 flex items-center justify-between gap-2.5 sm:gap-3 text-white">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-400 font-bold truncate">
                    Signature Feast
                  </div>
                  <div className="text-xs sm:text-sm font-bold truncate">
                    Loaded Hot Pizza & Chicken Cheese Rolls
                  </div>
                </div>
                <button
                  onClick={scrollToMenu}
                  className="px-3 sm:px-3.5 py-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
