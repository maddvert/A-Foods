import React from 'react';
import { generateGeneralWhatsAppInquiryLink } from '../utils/whatsapp';

export const FloatingWhatsAppButton: React.FC = () => {
  return (
    <div className="fixed bottom-20 md:bottom-8 left-4 sm:left-6 z-40 flex items-center justify-center">
      {/* Ripple pulse ring */}
      <div className="absolute w-14 h-14 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />

      {/* Pure Circular WhatsApp Icon Button */}
      <a
        href={generateGeneralWhatsAppInquiryLink()}
        target="_blank"
        rel="noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 shadow-2xl shadow-emerald-900/50 hover:scale-110 transition-all duration-300 group cursor-pointer"
        aria-label="Direct WhatsApp Chat"
        title="Chat with A. FOODS on WhatsApp"
      >
        {/* Authentic Official WhatsApp SVG Icon */}
        <svg
          className="w-8 h-8 fill-white group-hover:scale-105 transition-transform"
          viewBox="0 0 24 24"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.07-.09-.23-.15-.47-.27z" />
        </svg>
      </a>
    </div>
  );
};
