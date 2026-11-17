import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Tag, X, ArrowRight } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const PromoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { setSelectedCategory } = useRestaurant();

  const handleViewDeals = () => {
    setSelectedCategory('deals');
    const el = document.getElementById('deals-section') || document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black border-b border-amber-600/20"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black text-amber-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shrink-0">
                <Sparkles className="w-3 h-3" />
                <span>Hot Deal</span>
              </span>

              <p className="font-bold truncate text-[11px] sm:text-xs md:text-sm">
                Use Code{' '}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/15 font-black tracking-wide">
                  <Tag className="w-3 h-3 inline" />
                  FIRSTORDER100
                </span>{' '}
                for Rs. 100 OFF orders above Rs. 1,000 + FREE Delivery over Rs. 2,000!
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={handleViewDeals}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black hover:bg-slate-900 text-amber-400 text-[11px] font-extrabold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>View Deals</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                aria-label="Dismiss promotional banner"
                title="Dismiss banner"
                className="p-1 rounded-lg hover:bg-black/15 text-black/80 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
