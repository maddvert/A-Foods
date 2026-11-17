import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  Menu as MenuIcon,
  X,
  Sparkles,
  Sun,
  Moon,
  MapPin,
  User,
  ChevronDown,
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { useRestaurant } from '../context/RestaurantContext';
import { generateGeneralWhatsAppInquiryLink } from '../utils/whatsapp';

export const Navbar: React.FC = () => {
  const {
    itemCount,
    setIsCartOpen,
    setIsTrackingOpen,
    activeOrder,
    theme,
    toggleTheme,
    deliveryLocation,
    setIsLocationModalOpen,
    currentUser,
    setIsGoogleLoginOpen,
    setIsDashboardOpen,
    cartIconRef,
    isCartBouncing,
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0e1015]/95 backdrop-blur-md transition-colors duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black px-4 py-1.5 text-xs font-bold tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 rounded-full bg-black/80" />
            <span className="truncate">
              Fast Home Delivery in 30-45 Mins · Cash on Delivery (COD) · Fresh on Every Order
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs shrink-0 font-medium text-black">
            {/* Location Selector Quick Switcher */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/10 hover:bg-black/20 text-black font-bold transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-black" />
              <span>{deliveryLocation.name}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" /> {RESTAURANT_INFO.timings}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation - 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 h-16 sm:h-18">
          {/* Zone 1: Single Brand Wordmark in Display Font */}
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-2.5 font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
          >
            <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-base sm:text-xl shadow-md sm:shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              A
            </span>
            <span className="font-display tracking-wider text-lg sm:text-2xl">
              A. <span className="text-amber-500 dark:text-amber-400">FOODS</span>
            </span>
          </a>

          {/* Zone 2: Clean 4-5 Navigation Links (single-line, subtle hover) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('menu-section')}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection('deals-section')}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Super Deals
            </button>
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer relative"
            >
              Track Order
              {activeOrder && activeOrder.status !== 'delivered' && (
                <span className="inline-block ml-1.5 w-2 h-2 rounded-full bg-emerald-500 align-middle" />
              )}
            </button>
            <button
              onClick={() => scrollToSection('story-section')}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Kitchen & Story
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions (Theme Toggle, WhatsApp, Auth, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle theme mode"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Google Login / Customer Dashboard Trigger */}
            {currentUser ? (
              <button
                onClick={() => setIsDashboardOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer text-xs font-bold text-slate-900 dark:text-white shrink-0"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                />
                <span className="hidden sm:inline max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsGoogleLoginOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                <span>Google Sign In</span>
              </button>
            )}

            {/* Official WhatsApp Icon Button (Desktop top bar - hidden on mobile to avoid overcrowding) */}
            <a
              href={generateGeneralWhatsAppInquiryLink()}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex p-2 sm:p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
              aria-label="Direct WhatsApp Chat"
              title="Chat on WhatsApp"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.07-.09-.23-.15-.47-.27z" />
              </svg>
            </a>

            {/* Cart Button with Ref & Bounce Animation (Yellow Button - Fully visible and unclipped) */}
            <button
              ref={cartIconRef}
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isCartBouncing ? 'scale-110 ring-2 ring-amber-400' : ''
              }`}
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-black shrink-0" />
              <span className="hidden xs:inline">Cart</span>
              {itemCount > 0 && (
                <span className="flex items-center justify-center min-w-4.5 h-4.5 sm:min-w-5 sm:h-5 px-1 text-[10px] sm:text-xs font-black bg-black text-amber-400 rounded-full tabular-nums shrink-0">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#11141c] px-4 pt-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Mobile Location Selector Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsLocationModalOpen(true);
            }}
            className="w-full text-left py-2 px-3 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>Location: {deliveryLocation.name}</span>
            </span>
            <span className="text-[11px] font-mono">Rs. {deliveryLocation.deliveryFee}</span>
          </button>

          <button
            onClick={() => scrollToSection('menu-section')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-lg"
          >
            Explore Delicious Menu (Pakoras, Rolls, Chaat)
          </button>
          <button
            onClick={() => scrollToSection('deals-section')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Super Saver Family Deals
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsTrackingOpen(true);
            }}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-lg flex items-center justify-between"
          >
            <span>Live Order Tracking</span>
            {activeOrder && (
              <span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                #{activeOrder.orderId}
              </span>
            )}
          </button>
          <button
            onClick={() => scrollToSection('story-section')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-lg"
          >
            Kitchen & Story
          </button>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsGoogleLoginOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Sign in with Google</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDashboardOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>My Customer Dashboard ({currentUser.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
