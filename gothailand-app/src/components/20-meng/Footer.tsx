import React from 'react';
import { PageStep } from '../types';

interface FooterProps {
  onSelectStep?: (step: PageStep) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectStep }) => {
  return (
    <footer className="bg-[#0b1a30] text-stone-300 pt-16 pb-12 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif-luxury text-3xl font-bold text-white tracking-tight">
              GoThailand
            </span>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Curated, exclusive experiences in Thailand. Modern luxury meets authentic heritage with verified local guides.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p>Email: support@gothailand.com</p>
              <p>Hotline: +66 2 XXX XXXX</p>
              <p>Bangkok, Kingdom of Thailand</p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-amber-300 uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectStep?.(1)}
                  className="hover:text-white transition-colors cursor-pointer text-left text-stone-300"
                >
                  Accommodation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectStep?.(1)}
                  className="hover:text-white transition-colors cursor-pointer text-left text-stone-300"
                >
                  Car Rental
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectStep?.(1)}
                  className="text-amber-400 font-medium hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Local Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectStep?.(2)}
                  className="hover:text-white transition-colors cursor-pointer text-left text-stone-300"
                >
                  Private Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-amber-300 uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer text-stone-300">
                  About Us
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer text-stone-300">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer text-stone-300">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer text-stone-300">
                  Partner Program
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-amber-300 uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer text-stone-300">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer text-stone-300">
                  Booking Support
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer text-stone-300">
                  Cancellation Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer text-stone-300">
                  Sitemap
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 GoThailand. All rights reserved. Managed with Royal Thai Excellence.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-stone-300 cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
