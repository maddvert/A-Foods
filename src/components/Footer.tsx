import React from 'react';
import { Phone, MapPin, Clock, ArrowUp, Globe } from 'lucide-react';
import { RESTAURANT_INFO, RESTAURANT_COORDINATES } from '../data/menuData';
import { generateGeneralWhatsAppInquiryLink } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact-section" className="bg-slate-100 dark:bg-[#090b10] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-white/10 pt-16 pb-28 md:pb-16 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-2xl font-black text-slate-900 dark:text-white">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400 text-black font-black text-lg">
                A
              </span>
              <span>
                A. <span className="text-amber-500 dark:text-amber-400">FOODS</span>
              </span>
            </div>
            <p className="leading-relaxed">
              Your neighborhood culinary destination for loaded hot pizzas, crispy pakoras, chicken cheese rolls, crunchy samosas, dahi baray, chapli kababs, and gol gappay.
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
              100% Fresh Daily Preparation
            </div>
          </div>

          {/* Col 2: Order & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2.5">
              <a
                href={`tel:${RESTAURANT_INFO.phoneClean}`}
                className="flex items-center gap-2 text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-bold text-sm"
              >
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{RESTAURANT_INFO.phone}</span>
              </a>
              <a
                href={generateGeneralWhatsAppInquiryLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                <svg className="w-4 h-4 fill-emerald-500 shrink-0" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.07-.09-.23-.15-.47-.27z" />
                </svg>
                <span>Direct WhatsApp Chat</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </div>
              <a
                href={RESTAURANT_COORDINATES.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>View Google Maps Pin</span>
              </a>
            </div>
          </div>

          {/* Col 3: Delivery Zones & Timings */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Hours & Coverage
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-900 dark:text-white font-semibold">12:00 PM – 2:00 AM</div>
                  <div className="text-slate-500">Open 7 Days a Week</div>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-slate-900 dark:text-white font-semibold block">Key Delivery Zones:</span>
                <span>4K Chowrangi, Surjani, Powerhouse, Nagan Chowrangi, UP More, Shadman, North Nazimabad, FB Area, Gulshan and beyond.</span>
              </div>
            </div>
          </div>

          {/* Col 4: Hosting & Domain Deployment Ready */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-500" />
              <span>Hosting & Domain Ready</span>
            </h4>
            <p className="leading-relaxed">
              This website is 100% complete and ready to connect to any custom hosting domain (e.g. yourclientfoods.com) whenever your client purchases one.
            </p>
            <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] text-amber-600 dark:text-amber-400 font-mono shadow-sm">
              Build: npm run build &rarr; upload /dist
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} A. FOODS. All rights reserved. Order Line: {RESTAURANT_INFO.phone}.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
