import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  X,
  MessageCircle,
  PackageSearch,
  MapPin,
  Sparkles,
  Headphones,
  ExternalLink,
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export interface FloatingWhatsAppProps {
  autoExpandWaitTimeTooltip?: boolean;
}

interface DynamicWaitInfo {
  waitTime: string;
  label: string;
}

function getDynamicWaitTimeByHour(hour: number): DynamicWaitInfo {
  if (hour >= 19 && hour <= 23) {
    return {
      waitTime: '35 - 45 mins',
      label: 'Peak Dinner Rush',
    };
  }
  if (hour >= 12 && hour <= 15) {
    return {
      waitTime: '25 - 35 mins',
      label: 'Fresh Lunch Hours',
    };
  }
  if (hour >= 16 && hour < 19) {
    return {
      waitTime: '20 - 30 mins',
      label: 'Fast Kitchen Prep',
    };
  }
  if (hour >= 0 && hour < 2) {
    return {
      waitTime: '25 - 35 mins',
      label: 'Late Night Cravings',
    };
  }
  return {
    waitTime: 'Pre-Order · Opens 12 PM',
    label: 'Advance Kitchen Queue',
  };
}

// Inline subtle notification pop WAV chime (no external asset dependency)
const NOTIFICATION_POP_DATA_URI = (() => {
  if (typeof window === 'undefined') return '';
  const sampleRate = 8000;
  const durationSec = 0.14;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new Uint8Array(44 + numSamples);
  const view = new DataView(buffer.buffer);

  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 620 + (t / durationSec) * 440;
    const envelope = Math.exp(-t * 24);
    const sample = 128 + Math.round(Math.sin(2 * Math.PI * freq * t) * envelope * 42);
    buffer[44 + i] = Math.max(0, Math.min(255, sample));
  }

  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
})();

interface WhatsAppTemplate {
  id: string;
  title: string;
  subtitle: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
}

const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'track-order',
    title: 'How to track my order',
    subtitle: 'Check live rider & kitchen status',
    message:
      'Hello A. FOODS! How to track my order? Could you share an update on my delivery status?',
    icon: PackageSearch,
  },
  {
    id: 'menu-deals',
    title: "Today's deals & discounts",
    subtitle: 'Ask about FIRSTORDER100 & combos',
    message:
      'Hello A. FOODS! Please share today’s running deals, discounts, and combo offers.',
    icon: Sparkles,
  },
  {
    id: 'delivery-fee',
    title: 'Check delivery area & time',
    subtitle: 'Confirm delivery coverage near me',
    message:
      'Hello A. FOODS! What is the estimated delivery time and fee for my area?',
    icon: MapPin,
  },
  {
    id: 'customer-support',
    title: 'Talk to customer support',
    subtitle: 'Modify an order or quick inquiry',
    message:
      'Hello A. FOODS! I need assistance with my order from your website.',
    icon: Headphones,
  },
];

function buildWhatsAppTemplateUrl(message: string): string {
  return `https://wa.me/${RESTAURANT_INFO.phoneClean.replace('+', '')}?text=${encodeURIComponent(
    message
  )}`;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppProps> = ({
  autoExpandWaitTimeTooltip = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWaitTimeAutoExpanded, setIsWaitTimeAutoExpanded] = useState(
    autoExpandWaitTimeTooltip
  );
  const [showNeedHelpGreeting, setShowNeedHelpGreeting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());

  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize subtle notification pop Audio object on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && NOTIFICATION_POP_DATA_URI) {
      const audio = new Audio(NOTIFICATION_POP_DATA_URI);
      audio.volume = 0.25;
      audio.preload = 'auto';
      notificationAudioRef.current = audio;
    }

    // Update hour dynamically every minute
    const hourTimer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);

    return () => clearInterval(hourTimer);
  }, []);

  // Trigger automatic 3-second Wait Time tooltip expansion on component mount
  useEffect(() => {
    if (!autoExpandWaitTimeTooltip) return;
    setIsWaitTimeAutoExpanded(true);
    const collapseTimer = setTimeout(() => {
      setIsWaitTimeAutoExpanded(false);
    }, 3000);
    return () => clearTimeout(collapseTimer);
  }, [autoExpandWaitTimeTooltip]);

  // Display temporary slide-in "Need help?" greeting 3 seconds after page finishes loading
  // and play subtle notification pop sound effect
  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleGreeting = () => {
      showTimer = setTimeout(() => {
        setShowNeedHelpGreeting(true);
        if (notificationAudioRef.current) {
          notificationAudioRef.current.currentTime = 0;
          notificationAudioRef.current.play().catch(() => {
            // Silently ignore browser autoplay block if user hasn't interacted yet
          });
        }

        hideTimer = setTimeout(() => {
          setShowNeedHelpGreeting(false);
        }, 6500);
      }, 3000);
    };

    if (document.readyState === 'complete') {
      scheduleGreeting();
    } else {
      window.addEventListener('load', scheduleGreeting, { once: true });
    }

    return () => {
      window.removeEventListener('load', scheduleGreeting);
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  // Close template menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const waitInfo = getDynamicWaitTimeByHour(currentHour);
  const showWaitTimeTooltip = !isMenuOpen && (isHovered || isWaitTimeAutoExpanded);

  return (
    <div
      ref={containerRef}
      className="fixed left-3.5 bottom-3.5 sm:left-6 sm:bottom-6 z-40 mb-16 md:mb-0 flex flex-col items-start gap-2.5"
    >
      {/* Predefined Template Message Menu with Backdrop Blur Glassmorphism */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            className="w-[300px] sm:w-[330px] rounded-2xl border border-slate-200/70 dark:border-white/15 bg-white/80 dark:bg-[#121622]/75 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Menu Header */}
            <div className="px-4 py-3 bg-[#25D366]/15 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    A. FOODS WhatsApp Concierge
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>Wait Time: {waitInfo.waitTime}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close WhatsApp support menu"
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Predefined Query Templates */}
            <div className="p-2.5 space-y-1.5">
              <div className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quick Help Templates
              </div>

              {WHATSAPP_TEMPLATES.map((tpl) => {
                const IconComp = tpl.icon;
                return (
                  <a
                    key={tpl.id}
                    href={buildWhatsAppTemplateUrl(tpl.message)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-[#25D366]/15 border border-slate-200/60 dark:border-white/10 hover:border-[#25D366]/40 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 text-[#1da851] dark:text-[#25D366] flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#1da851] dark:group-hover:text-[#25D366]">
                          {tpl.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {tpl.subtitle}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#25D366] shrink-0" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Wait Time Tooltip (auto-expands for 3s on mount + shows on hover) */}
      <AnimatePresence>
        {showWaitTimeTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="px-3 py-2 rounded-xl bg-slate-900/95 dark:bg-[#171b27]/95 backdrop-blur-md text-white border border-amber-400/35 shadow-xl flex items-center gap-2 text-xs pointer-events-none"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold leading-tight">
                Current Wait Time:{' '}
                <span className="text-amber-400">{waitInfo.waitTime}</span>
              </div>
              <div className="text-[10px] text-slate-300">{waitInfo.label} · Instant reply</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button Row + Temporary Slide-In "Need help?" Greeting */}
      <div
        className="flex items-center gap-2.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-center justify-center">
          {/* Ripple pulse ring */}
          <div className="absolute w-14 h-14 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />

          {/* Circular WhatsApp Icon Button */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              setShowNeedHelpGreeting(false);
            }}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 shadow-2xl shadow-emerald-900/50 hover:scale-110 transition-all duration-300 group cursor-pointer"
            aria-label="Open WhatsApp quick help & templates"
            aria-expanded={isMenuOpen}
            title={`WhatsApp Concierge · Wait Time: ${waitInfo.waitTime}`}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <svg
                className="w-8 h-8 fill-white group-hover:scale-105 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.07-.09-.23-.15-.47-.27z" />
              </svg>
            )}
          </button>
        </div>

        {/* Temporary slide-in greeting text "Need help?" appearing 3s after load */}
        <AnimatePresence>
          {showNeedHelpGreeting && !isMenuOpen && (
            <motion.button
              type="button"
              onClick={() => {
                setIsMenuOpen(true);
                setShowNeedHelpGreeting(false);
              }}
              initial={{ opacity: 0, x: -16, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -12, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#171b27]/95 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 shadow-lg text-xs font-extrabold flex items-center gap-1.5 hover:border-[#25D366] transition-colors cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Need help?</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const FloatingWhatsApp = FloatingWhatsAppButton;
