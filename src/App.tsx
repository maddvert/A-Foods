/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RestaurantProvider } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { DealsSection } from './components/DealsSection';
import { StoryAndCounterSection } from './components/StoryAndCounterSection';
import { ReviewsAndFaqSection } from './components/ReviewsAndFaqSection';
import { Footer } from './components/Footer';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { CustomerDashboardModal } from './components/CustomerDashboardModal';
import { FlyToCartOverlay } from './components/FlyToCartOverlay';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  return (
    <RestaurantProvider>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0e1015] text-slate-900 dark:text-[#f3f4f6] flex flex-col font-sans selection:bg-amber-400 selection:text-black transition-colors duration-200 overflow-x-hidden w-full max-w-full">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection />

          {/* Interactive Menu Section */}
          <MenuSection />

          {/* Value Deals Section */}
          <DealsSection />

          {/* Master Culinary Story Section */}
          <StoryAndCounterSection />

          {/* Testimonials & FAQs */}
          <ReviewsAndFaqSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Modals & Interactive Overlays */}
        <LocationSelectorModal />
        <CustomerDashboardModal />
        <CustomizationModal />
        <CartDrawer />
        <OrderTrackerModal />
        <FlyToCartOverlay />
        <FloatingWhatsAppButton />
        <MobileBottomNav />
      </div>
    </RestaurantProvider>
  );
}
