import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShoppingBag,
  MapPin,
  Gift,
  LogOut,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChefHat,
  Bike,
  PackageCheck,
  Store,
  Banknote,
  CreditCard,
} from 'lucide-react';
import {
  useRestaurant,
  readOrdersFromLocalStorage,
  STORAGE_ORDERS_KEY,
} from '../context/RestaurantContext';
import { Order, OrderStatus } from '../types/restaurant';
import { ImageWithSkeleton } from './ImageWithSkeleton';

const STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    badgeClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  confirmed: {
    label: 'Confirmed',
    badgeClass:
      'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
    icon: CheckCircle2,
  },
  kitchen: {
    label: 'In Kitchen',
    badgeClass:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    icon: ChefHat,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    badgeClass:
      'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    icon: Bike,
  },
  delivered: {
    label: 'Delivered',
    badgeClass:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    icon: PackageCheck,
  },
};

export const CustomerDashboardModal: React.FC = () => {
  const {
    currentUser,
    isDashboardOpen,
    setIsDashboardOpen,
    isGoogleLoginOpen,
    setIsGoogleLoginOpen,
    loginWithGoogle,
    logout,
    allOrders,
    refreshOrdersFromStorage,
    deleteOrderFromHistory,
    clearOrderHistory,
    setTrackingOrderId,
    setIsTrackingOpen,
    quickReorder,
    setDeliveryLocation,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'rewards'>('orders');
  const [googleName, setGoogleName] = useState('Usama Khan');
  const [googleEmail, setGoogleEmail] = useState('usama.khan@gmail.com');

  // My Orders localStorage state & filters
  const [storedOrders, setStoredOrders] = useState<Order[]>(() => readOrdersFromLocalStorage());
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Retrieve latest order history directly from localStorage whenever modal opens or tab switches
  useEffect(() => {
    if (isDashboardOpen) {
      const latestFromStorage = refreshOrdersFromStorage();
      setStoredOrders(latestFromStorage);
      setConfirmClearAll(false);
    }
  }, [isDashboardOpen, activeTab, refreshOrdersFromStorage]);

  // Keep synced with live order updates and cross-tab localStorage changes
  useEffect(() => {
    setStoredOrders(allOrders);
  }, [allOrders]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_ORDERS_KEY) {
        setStoredOrders(readOrdersFromLocalStorage());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const sortedOrders = useMemo(() => {
    return [...storedOrders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [storedOrders]);

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return sortedOrders.filter((ord) => {
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'delivered'
          ? ord.status === 'delivered'
          : ord.status !== 'delivered';

      const matchesSearch =
        !q ||
        ord.orderId.toLowerCase().includes(q) ||
        (ord.customer?.areaName || '').toLowerCase().includes(q) ||
        (ord.customer?.address || '').toLowerCase().includes(q) ||
        ord.items.some((i) => i.name.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [sortedOrders, statusFilter, orderSearch]);

  const orderStats = useMemo(() => {
    const activeCount = sortedOrders.filter((o) => o.status !== 'delivered').length;
    const totalSpent = sortedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      totalCount: sortedOrders.length,
      activeCount,
      totalSpent,
    };
  }, [sortedOrders]);

  // Google Login Dialog
  if (isGoogleLoginOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-md bg-white dark:bg-[#141722] text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl p-6 space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsGoogleLoginOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2 pt-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shadow-inner">
              {/* Google multicolored 'G' icon */}
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Sign in with Google</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Access your saved delivery addresses, view past orders, and earn food rewards points.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1b1f2d] border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Google Account Email
              </label>
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1b1f2d] border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            onClick={() => loginWithGoogle({ name: googleName, email: googleEmail })}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#1b1f2d] hover:bg-slate-50 dark:hover:bg-[#23283a] text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-[11px] text-center text-slate-400">
            By continuing, you agree to A. FOODS Customer Terms & Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  // Customer Dashboard
  if (!isDashboardOpen || !currentUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsDashboardOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#141722] text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Profile Banner */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-black/20 object-cover shadow-md shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-xl font-black truncate">{currentUser.name}</h3>
                <span className="px-2 py-0.5 text-[10px] font-black bg-black text-amber-400 rounded-full uppercase shrink-0">
                  Verified
                </span>
              </div>
              <div className="text-xs font-semibold text-black/80 truncate">{currentUser.email}</div>
              <div className="text-xs font-medium text-black/70 mt-0.5 truncate">
                Loyalty: {currentUser.rewardPoints} Points (Rs. {currentUser.rewardPoints} Value)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                logout();
                setIsDashboardOpen(false);
              }}
              className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-black transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setIsDashboardOpen(false)}
              className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-black transition-colors cursor-pointer"
              title="Close"
              aria-label="Close Dashboard"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="p-3 bg-slate-50 dark:bg-[#11131a] border-b border-slate-200 dark:border-white/5 flex gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-black font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({sortedOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'addresses'
                ? 'bg-amber-400 text-black font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'rewards'
                ? 'bg-amber-400 text-black font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Rewards & Offers</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Order Summary Stats Strip */}
              {sortedOrders.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-white/10">
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Total Orders
                    </div>
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
                      {orderStats.totalCount}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-white/10">
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      In Progress
                    </div>
                    <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums mt-0.5">
                      {orderStats.activeCount}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-white/10">
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Total Spent
                    </div>
                    <div className="text-sm sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 truncate">
                      Rs. {orderStats.totalSpent.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Search, Filter & Clear History Controls */}
              {sortedOrders.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search by Order ID, item, or area..."
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-1.5">
                      <div className="flex bg-slate-100 dark:bg-[#191d2a] p-1 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-semibold">
                        {(['all', 'active', 'delivered'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                              statusFilter === tab
                                ? 'bg-amber-400 text-black font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {tab === 'active' ? 'In Progress' : tab}
                          </button>
                        ))}
                      </div>

                      {!confirmClearAll ? (
                        <button
                          onClick={() => setConfirmClearAll(true)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-colors cursor-pointer shrink-0"
                          title="Clear order history"
                          aria-label="Clear order history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 rounded-xl px-2 py-1 text-[11px]">
                          <button
                            onClick={() => {
                              clearOrderHistory();
                              setStoredOrders([]);
                              setConfirmClearAll(false);
                            }}
                            className="font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                          >
                            Confirm Clear
                          </button>
                          <span className="text-slate-400">·</span>
                          <button
                            onClick={() => setConfirmClearAll(false)}
                            className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State / Filtered Empty State / Orders List */}
              {sortedOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-3 bg-slate-50 dark:bg-[#191d2a]/60 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 px-4">
                  <ShoppingBag className="w-10 h-10 mx-auto opacity-40 text-amber-500" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      No previous orders found
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                      Orders placed on A. FOODS are automatically saved in this browser so you can track or reorder anytime.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDashboardOpen(false);
                      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Explore Menu & Order
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2 bg-slate-50 dark:bg-[#191d2a]/60 rounded-2xl border border-slate-200 dark:border-white/10 px-4">
                  <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                    No orders match your current search or filter.
                  </p>
                  <button
                    onClick={() => {
                      setOrderSearch('');
                      setStatusFilter('all');
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((ord) => {
                    const meta = STATUS_META[ord.status] || STATUS_META.confirmed;
                    const StatusIcon = meta.icon;
                    const isExpanded = expandedOrderId === ord.orderId;
                    const createdDate = new Date(ord.createdAt);

                    return (
                      <div
                        key={ord.orderId}
                        className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#191d2a] space-y-3 transition-colors hover:border-amber-400/40"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-sm text-amber-600 dark:text-amber-400">
                                Order #{ord.orderId}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${meta.badgeClass}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span>{meta.label}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {createdDate.toLocaleDateString()} ·{' '}
                                {createdDate.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1">
                                {ord.customer?.orderType === 'pickup' ? (
                                  <>
                                    <Store className="w-3 h-3 text-amber-500" />
                                    Self Pickup
                                  </>
                                ) : (
                                  <>
                                    <Bike className="w-3 h-3 text-amber-500" />
                                    {ord.customer?.areaName || 'Home Delivery'}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                setExpandedOrderId(isExpanded ? null : ord.orderId)
                              }
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-[#141722] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>

                            <button
                              onClick={() => deleteOrderFromHistory(ord.orderId)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Remove order from history"
                              aria-label={`Remove order ${ord.orderId}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Itemized Preview */}
                        <div className="space-y-2 pt-1">
                          {ord.items.map((item, idx) => (
                            <div
                              key={`${ord.orderId}-${item.cartItemId || idx}`}
                              className="flex items-center justify-between gap-2.5 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {item.image && (
                                  <ImageWithSkeleton
                                    src={item.image}
                                    alt={item.name}
                                    loading="lazy"
                                    wrapperClassName="w-9 h-9 rounded-lg shrink-0 bg-slate-200 dark:bg-[#242938]"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <div className="min-w-0">
                                  <div className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                                    {item.quantity}x {item.name}
                                  </div>
                                  {(item.selectedSize ||
                                    item.selectedCrust ||
                                    item.selectedPortion ||
                                    item.selectedSpice ||
                                    (item.selectedAddOns && item.selectedAddOns.length > 0)) && (
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                      {[
                                        item.selectedSize,
                                        item.selectedCrust,
                                        item.selectedPortion,
                                        item.selectedSpice,
                                        item.selectedAddOns?.length
                                          ? `+ ${item.selectedAddOns.map((a) => a.name).join(', ')}`
                                          : '',
                                      ]
                                        .filter(Boolean)
                                        .join(' · ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200 shrink-0">
                                Rs. {item.itemTotal.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Expandable Full Breakdown & Delivery Address */}
                        {isExpanded && (
                          <div className="p-3 rounded-xl bg-white dark:bg-[#131620] border border-slate-200 dark:border-white/10 space-y-2 text-[11px] animate-in fade-in duration-150">
                            <div className="space-y-1 text-slate-500 dark:text-slate-400">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                                  Rs. {ord.subtotal.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>
                                  Delivery Fee
                                  {ord.customer?.distanceKm
                                    ? ` (${ord.customer.distanceKm} km)`
                                    : ''}
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                                  {ord.deliveryFee === 0 ? 'FREE' : `Rs. ${ord.deliveryFee}`}
                                </span>
                              </div>
                              {ord.discount > 0 && (
                                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                  <span>Discount</span>
                                  <span className="font-semibold tabular-nums">
                                    -Rs. {ord.discount.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {ord.customer && (
                              <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1 text-slate-600 dark:text-slate-300">
                                <div className="font-bold text-slate-800 dark:text-white">
                                  {ord.customer.fullName} · {ord.customer.phone}
                                </div>
                                {ord.customer.orderType === 'delivery' && ord.customer.address && (
                                  <div className="text-slate-500 dark:text-slate-400">
                                    Address: {ord.customer.address}
                                    {ord.customer.landmark ? ` (${ord.customer.landmark})` : ''}
                                  </div>
                                )}
                                {ord.customer.notes && (
                                  <div className="italic text-slate-400">
                                    Note: "{ord.customer.notes}"
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Order Footer & Actions */}
                        <div className="pt-2.5 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="text-xs flex items-center gap-1.5 flex-wrap">
                            <span className="text-slate-500">Total:</span>
                            <strong className="text-amber-600 dark:text-amber-400 font-black tabular-nums text-sm">
                              Rs. {ord.total.toLocaleString()}
                            </strong>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                              {ord.paymentMethod === 'cash_on_delivery' ? (
                                <>
                                  <Banknote className="w-3 h-3 text-emerald-500" />
                                  COD
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-3 h-3 text-amber-500" />
                                  Online
                                </>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setTrackingOrderId(ord.orderId);
                                setIsDashboardOpen(false);
                                setIsTrackingOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Track Status
                            </button>
                            <button
                              onClick={() => {
                                quickReorder(ord);
                                setIsDashboardOpen(false);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <RotateCcw className="w-3 h-3" /> Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {currentUser.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#191d2a] flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs uppercase text-amber-600 dark:text-amber-400">
                        {addr.label}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        ({addr.distanceKm} km · Rs. {addr.deliveryFee} Delivery)
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{addr.address}</p>
                    {addr.landmark && (
                      <p className="text-[11px] text-slate-500">Landmark: {addr.landmark}</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setDeliveryLocation({
                        name: addr.label,
                        address: addr.address,
                        distanceKm: addr.distanceKm,
                        deliveryFee: addr.deliveryFee,
                      });
                      setIsDashboardOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 text-black hover:bg-amber-300 shrink-0 cursor-pointer self-start"
                  >
                    Select for Order
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                    Available Food Balance
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    {currentUser.rewardPoints} Points
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    1 Point = Rs. 1 instant discount on checkout
                  </p>
                </div>
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#191d2a] space-y-1">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Active Coupon: FIRSTORDER100
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Get Rs. 100 off on your first food order above Rs. 1,000.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
