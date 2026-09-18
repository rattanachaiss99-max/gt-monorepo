import React from 'react';
import { Search, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

export const HeaderNav = ({
  currentStep,
  onSelectStep,
  activeNav = 'Local Guide',
  isConfirmedPage = false,
}) => {
  const stepsList = [
    { step: 0, label: 'Home Page', pageLabel: 'GoThailandHomePage.png' },
    { step: 1, label: 'Guide Directory', pageLabel: 'Guide_Page1.png' },
    { step: 2, label: 'Guide Profile', pageLabel: 'Guide_Page2.png' },
    { step: 3, label: 'Booking Details', pageLabel: 'Guide_Page3.png' },
    { step: 4, label: 'Secure Checkout', pageLabel: 'Guide_Page4.png' },
    { step: 5, label: 'Confirmation', pageLabel: 'Guide_Page5.png' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top flow indicator banner */}
      <div className="bg-[#0b1a30] text-stone-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#d4a326] uppercase tracking-wider text-[11px] bg-[#d4a326]/15 px-2 py-0.5 rounded">
              Page Sequence Flow
            </span>
            <span className="hidden sm:inline text-stone-400">
              Home → Guide 1 → Profile 2 → Details 3 → Checkout 4 → Confirm 5
            </span>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-0.5">
            {stepsList.map((item) => {
              const isActive = currentStep === item.step;
              const isPassed = currentStep > item.step;
              return (
                <button
                  key={item.step}
                  id={`flow-step-btn-${item.step}`}
                  onClick={() => onSelectStep(item.step)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#c99726] text-white font-medium shadow-sm ring-1 ring-amber-300/40'
                      : isPassed
                      ? 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                  title={`Go to ${item.pageLabel}`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-white text-[#996d13] font-bold' : isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-700 text-stone-300'
                  }`}>
                    {isPassed ? '✓' : item.step}
                  </span>
                  <span>{item.label}</span>
                  <span className="hidden lg:inline text-[10px] opacity-75">({item.pageLabel.replace('.png','')})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              id="brand-logo-btn"
              onClick={() => onSelectStep(0)}
              className="text-left group cursor-pointer"
            >
              <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#0b1a30] group-hover:text-[#c99726] transition-colors">
                GoThailand
              </span>
              <span className="block text-[9px] text-stone-500 font-sans tracking-widest uppercase -mt-1">
                Experience the Best of Asia
              </span>
            </button>
          </div>

          {/* Navigation Items */}
          {!isConfirmedPage ? (
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <button
                id="nav-home-btn"
                onClick={() => onSelectStep(0)}
                className={`transition-colors cursor-pointer pb-1 ${
                  currentStep === 0
                    ? "relative text-[#0b1a30] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c99726]"
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Home
              </button>
              <button
                id="nav-accommodation-btn"
                onClick={() => onSelectStep(0)}
                className="text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Accommodation
              </button>
              <button
                id="nav-carrental-btn"
                onClick={() => onSelectStep(0)}
                className="text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Car Rental
              </button>
              <button
                id="nav-localguide-btn"
                onClick={() => onSelectStep(1)}
                className={`transition-colors cursor-pointer pb-1 ${
                  currentStep >= 1
                    ? "relative text-[#0b1a30] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c99726]"
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Tourist Guide
              </button>
            </nav>
          ) : (
            <div className="flex items-center gap-3">
              <button
                id="nav-home-from-confirmation-btn"
                onClick={() => onSelectStep(0)}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer"
              >
                Back to Home
              </button>
              <button
                id="nav-close-confirmation-btn"
                onClick={() => onSelectStep(1)}
                className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer"
              >
                <span>✕</span>
                <span>Guide Directory</span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {!isConfirmedPage && (
            <div className="flex items-center space-x-4">
              <button
                id="nav-search-btn"
                onClick={() => onSelectStep(1)}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                title="Search Guides"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button
                id="nav-booknow-btn"
                onClick={() => onSelectStep(1)}
                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-[#f3ba36] text-stone-900 text-sm font-bold rounded-full hover:bg-[#e0a623] transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
