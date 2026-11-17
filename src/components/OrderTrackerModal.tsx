import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRestaurant } from '../context/RestaurantContext';
import { RESTAURANT_INFO } from '../data/menuData';
import { generateOrderTrackingWhatsAppLink } from '../utils/whatsapp';

export const OrderTrackerModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    activeOrder,
    allOrders,
    trackingOrderId,
    setTrackingOrderId,
    quickReorder,
  } = useRestaurant();

  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState<'track' | 'history'>('track');

  if (!isTrackingOpen) return null;

  const currentOrder =
    (trackingOrderId ? allOrders.find((o) => o.orderId === trackingOrderId) : null) ||
    (searchInput.trim()
      ? allOrders.find(
          (o) => o.orderId.toLowerCase() === searchInput.trim().toLowerCase()
        )
      : null) ||
    activeOrder;

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 1;
      case 'kitchen':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const steps = [
    {
      step: 1,
      shortTitle: 'Confirmed',
      title: 'Order Confirmed',
      desc: 'Order received and verified by kitchen staff',
      icon: CheckCircle2,
    },
    {
      step: 2,
      shortTitle: 'Cooking',
      title: 'Cooking',
      desc: 'Baking pizzas, frying crispy pakoras, and prepping fresh rolls',
      icon: ChefHat,
    },
    {
      step: 3,
      shortTitle: 'Out for Delivery',
      title: 'Out for Delivery',
      desc: 'Rider is on the way in a thermal insulated bag',
      icon: Bike,
    },
    {
      step: 4,
      shortTitle: 'Delivered',
      title: 'Delivered',
      desc: 'Arrived at your doorstep. Enjoy your meal!',
      icon: PackageCheck,
    },
  ];

  const currentStep = currentOrder ? getStepProgress(currentOrder.status) : 1;
  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] bg-white dark:bg-[#141722] text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tracker Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-[#191d2a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Live Order Tracking</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Real-time milestone progress from kitchen to your door
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Order Search */}
        <div className="p-3 bg-slate-50 dark:bg-[#11131a] border-b border-slate-200 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex bg-slate-200 dark:bg-[#1b1f2d] p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('track')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'track'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Current Status
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Order History ({allOrders.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Track ID (AF-...)"
                className="w-full pl-8 pr-2 py-1.5 bg-white dark:bg-[#1b1f2d] border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-sm">
          {activeTab === 'history' ? (
            /* ORDER HISTORY TAB */
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Past Orders
              </h3>
              {allOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No orders placed yet from this browser.
                </div>
              ) : (
                allOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-3.5 bg-slate-50 dark:bg-[#1a1e2b] border border-slate-200 dark:border-white/10 rounded-xl space-y-2 hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        #{ord.orderId}
                      </span>
                      <span className="text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                        {new Date(ord.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                        Rs. {ord.total.toLocaleString()} ·{' '}
                        {ord.paymentMethod === 'cash_on_delivery' ? 'COD' : 'Online'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTrackingOrderId(ord.orderId);
                            setActiveTab('track');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded hover:bg-amber-500/20"
                        >
                          View Status
                        </button>
                        <button
                          onClick={() => {
                            quickReorder(ord);
                            setIsTrackingOpen(false);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-black bg-amber-400 rounded hover:bg-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" /> Reorder
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : !currentOrder ? (
            /* NO ACTIVE ORDER */
            <div className="text-center py-12 space-y-3">
              <Clock className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold">No active order to track</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Place an order from the menu or enter your Order ID in the search box above.
              </p>
            </div>
          ) : (
            /* ACTIVE ORDER TRACKER */
            <div className="space-y-6">
              {/* Order Quick ID Card */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-50 dark:via-[#1b1f2b] to-slate-50 dark:to-[#1b1f2b] border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                    Order In Progress
                  </div>
                  <div className="text-xl font-black flex items-center gap-2">
                    <span>#{currentOrder.orderId}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {currentOrder.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Mode: {currentOrder.customer.orderType === 'delivery' ? 'Home Delivery' : 'Self Pickup'} · Cash on Delivery
                  </div>
                </div>

                {currentOrder.status !== 'delivered' && (
                  <div className="text-left sm:text-right shrink-0 bg-white dark:bg-black/40 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Estimated Arrival</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">
                      ~ {currentOrder.deliveryMinutesRemaining} Mins
                    </span>
                  </div>
                )}
              </div>

              {/* Animated Stage Progress Bar (Framer Motion) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Live Order Progress
                  </span>
                  <span className="font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    Stage {currentStep} of {steps.length} ({progressPercent}%)
                  </span>
                </div>

                {/* Horizontal Animated Progress Track */}
                <div className="relative w-full h-3 rounded-full bg-slate-200 dark:bg-black/50 overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: 'spring', stiffness: 110, damping: 20 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                  />
                </div>

                {/* Milestone Badges */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {steps.map((st) => {
                    const isCompleted = currentStep >= st.step;
                    const isCurrent = currentStep === st.step;
                    const IconComponent = st.icon;
                    return (
                      <motion.div
                        key={`pill-${st.step}`}
                        animate={{
                          scale: isCurrent ? 1.04 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                        className={`flex flex-col items-center text-center p-1.5 rounded-xl border transition-colors ${
                          isCurrent
                            ? 'bg-amber-400/15 border-amber-400 text-amber-700 dark:text-amber-300'
                            : isCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                            : 'bg-white/60 dark:bg-white/5 border-transparent text-slate-400'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5 mb-0.5" />
                        <span className="text-[10px] font-bold leading-tight">
                          {st.shortTitle}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Step Progression Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Preparation & Delivery Stages
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
                  {steps.map((st) => {
                    const isCompleted = currentStep >= st.step;
                    const isCurrent = currentStep === st.step;
                    const IconComponent = st.icon;

                    return (
                      <motion.div
                        key={st.step}
                        initial={{ opacity: 0.7, x: -4 }}
                        animate={{ opacity: isCompleted ? 1 : 0.65, x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="relative flex items-start gap-4"
                      >
                        {/* Step Marker */}
                        <motion.div
                          animate={{
                            scale: isCurrent ? [1, 1.15, 1] : 1,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: isCurrent && currentOrder.status !== 'delivered' ? Infinity : 0,
                          }}
                          className={`absolute -left-6 flex items-center justify-center w-5.5 h-5.5 rounded-full transition-colors ${
                            isCompleted
                              ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                              : 'bg-slate-200 dark:bg-[#222736] text-slate-400'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </motion.div>

                        {/* Step Label */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-sm font-bold ${
                                isCompleted
                                  ? 'text-slate-900 dark:text-white'
                                  : 'text-slate-400'
                              }`}
                            >
                              {st.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{st.desc}</p>
                          {isCurrent && currentOrder.status !== 'delivered' && (
                            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
                              ● Live right now...
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Rider / Outlet Contact Card with official WhatsApp icon */}
              <div className="p-4 bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center font-bold">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        A. FOODS Helpline & Rider Desk
                      </div>
                      <div className="text-[11px] text-slate-500">{RESTAURANT_INFO.phone}</div>
                    </div>
                  </div>

                  <a
                    href={generateOrderTrackingWhatsAppLink(currentOrder.orderId)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.07-.09-.23-.15-.47-.27z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Itemized Order Details */}
              <div className="p-4 bg-slate-50 dark:bg-[#161924] border border-slate-200 dark:border-white/5 rounded-xl space-y-2 text-xs">
                <h5 className="font-bold text-slate-700 dark:text-slate-300">Order Summary:</h5>
                <div className="divide-y divide-slate-200 dark:divide-white/5 space-y-2 pt-1">
                  {currentOrder.items.map((i, idx) => (
                    <div key={idx} className="pt-2 flex justify-between text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {i.quantity}x {i.name}
                        </span>
                        {i.selectedSize && (
                          <span className="text-slate-400 text-[11px] block">
                            Size: {i.selectedSize} {i.selectedCrust ? `· ${i.selectedCrust}` : ''}
                          </span>
                        )}
                      </div>
                      <span className="font-bold tabular-nums">Rs. {i.itemTotal}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between font-extrabold text-sm text-amber-600 dark:text-amber-400">
                  <span>Total Payable:</span>
                  <span className="tabular-nums">Rs. {currentOrder.total.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Delivering to: {currentOrder.customer.address || 'Self pickup at counter'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
