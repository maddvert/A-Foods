import React from 'react';
import { Award, CheckCircle, Clock, UtensilsCrossed, ShieldAlert } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { generateGeneralWhatsAppInquiryLink } from '../utils/whatsapp';

export const StoryAndCounterSection: React.FC = () => {
  return (
    <section id="story-section" className="py-14 sm:py-20 bg-slate-50 dark:bg-[#0b0d13] border-t border-b border-slate-200 dark:border-white/10 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Commercial Culinary Showcase Image (replacing reference photo) */}
          <div className="lg:col-span-6 relative animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-black/20 dark:shadow-black/70 group">
              <img
                src="/src/assets/images/menu_samosas_chapli_1794313770709.jpg"
                alt="A. FOODS Handcrafted Samosas, Chapli Kababs and Crispy Specialties"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Quality Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-amber-400/30 space-y-1 text-white">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                  <Award className="w-4 h-4" />
                  <span>Master Culinary Standards</span>
                </div>
                <div className="text-base font-extrabold">
                  A. FOODS Kitchen Hub · Hotline: {RESTAURANT_INFO.phone}
                </div>
                <p className="text-xs text-slate-300">
                  Every order is fried and baked fresh on demand with zero pre-cooked leftovers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Culinary Heritage & Promises */}
          <div className="lg:col-span-6 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-900">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Our Kitchen Heritage
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Authentic Taste, Hand-Crafted Recipes & Uncompromised Quality.
              </h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              At <strong>A. FOODS</strong>, we serve Karachi's favorite loaded cheesy pizzas, freshly fried crispy pakoras, golden samosas, and molten chicken cheese rolls alongside authentic street culinary specialties including spiced chapli kababs, crunchy gol gappay, Lahori potato samosas, and creamy dahi baray chaat.
            </p>

            {/* Quality Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#141721] border border-slate-200 dark:border-white/5 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">100% Fresh Poultry & Meat</div>
                  <div className="text-slate-500 dark:text-slate-400">Daily hand-picked poultry and ingredients</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#141721] border border-slate-200 dark:border-white/5 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Secret Spice Blends</div>
                  <div className="text-slate-500 dark:text-slate-400">Original crunch and signature herbal marinades</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#141721] border border-slate-200 dark:border-white/5 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Hygienic Kitchen Protocol</div>
                  <div className="text-slate-500 dark:text-slate-400">Clean oil filters and sealed thermal packaging</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#141721] border border-slate-200 dark:border-white/5 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Distance-Based Delivery</div>
                  <div className="text-slate-500 dark:text-slate-400">Riders equipped with thermal insulated delivery boxes</div>
                </div>
              </div>
            </div>

            {/* Direct Contact Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-100 dark:via-[#181b26] to-slate-100 dark:to-[#181b26] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase">
                  Order Hotline & Inquiries
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                  {RESTAURANT_INFO.phone}
                </div>
                <div className="text-xs text-slate-500">Available daily 12:00 PM – 2:00 AM</div>
              </div>

              <a
                href={generateGeneralWhatsAppInquiryLink()}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors text-center whitespace-nowrap cursor-pointer shadow-md w-full sm:w-auto"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
