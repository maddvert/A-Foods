import React, { useState } from 'react';
import { Star, ChevronDown, HelpCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

const REVIEWS = [
  {
    name: 'Hamza Farooq',
    location: 'North Karachi (Sector 5)',
    rating: 5,
    date: 'Yesterday',
    text: 'A. FOODS crispy pakoras and chicken cheese rolls are truly golden and crunchy! The signature mint chutney and dips are top notch. Delivery took only 32 mins to 4K Chowrangi.',
  },
  {
    name: 'Dr. Ayesha Malik',
    location: 'Buffer Zone (Sector 15-A)',
    rating: 5,
    date: '3 days ago',
    text: 'We ordered the Grand Counter Feast for a weekend gathering. The Chapli Kababs, Chicken Samosas, and Chicken Cheese Rolls were outstanding. Cash on delivery was seamless.',
  },
  {
    name: 'Bilal Qureshi',
    location: 'Powerhouse / Nagan',
    rating: 5,
    date: '1 week ago',
    text: 'Chicken Cheese Roll, Gol Gappay platter, and crispy pakoras are 10/10. WhatsApp order option is super convenient with instant confirmation. Highly recommended!',
  },
];

const FAQS = [
  {
    q: 'How is the delivery fee calculated?',
    a: 'Our kitchen hub is located near 4K Chowrangi, North Karachi. The benchmark fee for 4K Chowrangi (~2.2 km) is Rs. 100. For nearby areas and farther sectors across Karachi, the fee calculates automatically according to exact distance.',
  },
  {
    q: 'How does Cash on Delivery (COD) work?',
    a: 'Simply select "Cash on Delivery" at checkout or on WhatsApp. Our delivery rider will bring your freshly cooked meal in a heat-insulated bag, and you can pay the exact cash amount right at your doorstep.',
  },
  {
    q: 'Can I order directly on WhatsApp?',
    a: 'Yes, absolutely! Click any WhatsApp button on the website. The system will pre-fill your exact order items, customizations, address, and bill in a ready-to-send message to 0303-3477887.',
  },
  {
    q: 'What are your operational opening hours?',
    a: 'We are open 7 days a week from 12:00 PM in the afternoon until 2:00 AM late night. Late night cravings are always welcome!',
  },
  {
    q: 'Can this website be hosted on a custom domain when purchased?',
    a: 'Yes! This entire website is built to standard modern production standards (React SPA with Vite and Tailwind CSS). Once your client purchases a domain and hosting (cPanel, Hostinger, Vercel, Netlify, or VPS), simply run `npm run build` and upload the `/dist` folder to go live instantly.',
  },
];

export const ReviewsAndFaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0e1017] border-t border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Customer Reviews Section */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Customer Love & Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              What Our Food Lovers Say
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-amber-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-slate-900 dark:text-white font-bold ml-1">4.9 / 5.0</span>
              <span className="text-slate-500 dark:text-slate-400">(Over 1,200+ satisfied customers)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 dark:bg-[#151822] rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 flex flex-col justify-between shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{rev.name}</div>
                    <div className="text-[11px] text-slate-500">{rev.location}</div>
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6 pt-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase">
              <HelpCircle className="w-4 h-4" />
              <span>Questions & Answers</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151822] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
