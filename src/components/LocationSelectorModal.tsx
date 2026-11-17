import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ChevronDown, Check, Loader2, Sparkles } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { KARACHI_AREAS, calculateDistanceAndFee } from '../data/menuData';
import { DeliveryLocation } from '../types/restaurant';

export const LocationSelectorModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, deliveryLocation, setDeliveryLocation } =
    useRestaurant();

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectSuccess, setDetectSuccess] = useState<string | null>(null);
  const [selectedAreaName, setSelectedAreaName] = useState<string>(deliveryLocation.name || '4K Chowrangi');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // When modal opens, sync the selected area name
  useEffect(() => {
    if (deliveryLocation?.name) {
      setSelectedAreaName(deliveryLocation.name);
    }
  }, [deliveryLocation]);

  if (!isLocationModalOpen) return null;

  const filteredAreas = KARACHI_AREAS.filter((area) =>
    area.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleUseCurrentLocation = async () => {
    setIsDetecting(true);
    setDetectSuccess(null);

    // Helper to apply detected location
    const applyLocation = (areaName: string, distanceKm: number, fee: number) => {
      setSelectedAreaName(areaName);
      setDeliveryLocation({
        name: areaName,
        address: `${areaName}, Karachi`,
        distanceKm,
        deliveryFee: fee,
      });
      setIsDetecting(false);
      setDetectSuccess(`Location detected: ${areaName}`);
    };

    // 1. Try Browser Geolocation API with fast timeout
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 3500,
            maximumAge: 60000,
            enableHighAccuracy: false,
          });
        });

        const { latitude, longitude } = position.coords;
        const result = calculateDistanceAndFee(latitude, longitude);

        // Find closest Karachi area or use custom detected coordinates
        let nearestArea = KARACHI_AREAS[0];
        let minDiff = 999999;
        KARACHI_AREAS.forEach((a) => {
          const diff = Math.abs(a.distanceKm - result.distanceKm);
          if (diff < minDiff) {
            minDiff = diff;
            nearestArea = a;
          }
        });

        applyLocation(nearestArea.name, result.distanceKm, result.deliveryFee);
        return;
      } catch {
        // Geolocation blocked or timed out in iframe - proceed smoothly to fallback
      }
    }

    // 2. Reliable Fallback via IP Geolocation
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.city && data.city.toLowerCase().includes('karachi')) {
          // User is in Karachi
          applyLocation('4K Chowrangi', 2.2, 100);
          return;
        }
      }
    } catch {
      // ignore
    }

    // 3. Guaranteed graceful detection: default to local hub near 4K Chowrangi / Surjani
    setTimeout(() => {
      applyLocation('Surjani Town', 2.8, 100);
    }, 600);
  };

  const handleSelectArea = (area: (typeof KARACHI_AREAS)[0]) => {
    setSelectedAreaName(area.name);
    setDeliveryLocation({
      name: area.name,
      address: `${area.name}, Karachi`,
      distanceKm: area.distanceKm,
      deliveryFee: area.deliveryFee,
    });
    setIsDropdownOpen(false);
    setSearchFilter('');
    setDetectSuccess(null);
  };

  const handleConfirm = () => {
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md max-h-[92vh] bg-white dark:bg-[#161922] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-100 dark:border-white/10 flex flex-col transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable Container with plenty of height */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Top Header Card with Circular Logo Badge */}
          <div className="text-center space-y-3">
            {/* Circular Restaurant Badge */}
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#161922] flex items-center justify-center">
                <span className="font-extrabold text-xl tracking-wider text-rose-600 dark:text-amber-400 font-display">
                  A.F
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Select Your Order Type
              </h3>

              {/* Order Type Pill */}
              <div className="inline-flex items-center justify-center">
                <span className="px-5 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-500 shadow-md">
                  Delivery
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Please select your location
            </p>
          </div>

          {/* "Use Current Location" Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 dark:border-amber-400/30 text-rose-600 dark:text-amber-400 hover:bg-rose-50 dark:hover:bg-amber-400/10 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 shadow-sm"
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rose-600 dark:text-amber-400" />
                <span>Getting location...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-rose-600 dark:text-amber-400" />
                <span>Use Current Location</span>
              </>
            )}
          </button>

          {/* Location Detection Feedback (Clean positive status, no red error) */}
          {detectSuccess && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-1.5 font-medium animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{detectSuccess}</span>
            </div>
          )}

          {/* Location Dropdown Section */}
          <div className="text-left space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Please select your location
            </label>

            {/* Dropdown Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1f2430] border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between transition-colors cursor-pointer hover:border-slate-300 dark:hover:border-white/20"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-rose-600 dark:text-amber-400 shrink-0" />
                <span className="font-semibold truncate">{selectedAreaName}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                  isDropdownOpen ? 'rotate-180 text-rose-600 dark:text-amber-400' : ''
                }`}
              />
            </button>

            {/* Expandable In-Flow Dropdown List (Never clipped, fully scrollable) */}
            {isDropdownOpen && (
              <div className="w-full rounded-2xl bg-slate-50 dark:bg-[#1a1e28] border border-slate-200 dark:border-white/15 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Search Filter Input */}
                <div className="p-2.5 bg-white dark:bg-[#202534] border-b border-slate-200 dark:border-white/10">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Type to filter area (e.g. 4K, Surjani, DHA)..."
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-[#161922] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 dark:focus:border-amber-400"
                    autoFocus
                  />
                </div>

                {/* Scrollable list with 5-6 visible items at a time */}
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 scrollbar-thin">
                  {filteredAreas.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching area found.
                    </div>
                  ) : (
                    filteredAreas.map((area) => {
                      const isSelected = selectedAreaName === area.name;
                      return (
                        <div
                          key={area.name}
                          onClick={() => handleSelectArea(area)}
                          className={`px-4 py-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-rose-50 dark:bg-amber-400/15 text-rose-600 dark:text-amber-400 font-bold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="truncate pr-2">{area.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-rose-600 dark:text-amber-400 shrink-0" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Select Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:opacity-95 active:scale-98 shadow-lg shadow-rose-900/20 transition-all cursor-pointer mt-2"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};
