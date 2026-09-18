/* ============================================================
   components/CtaBanner.jsx
   The "Book Your Unforgettable Thai Experience Today!" banner
   shown above the footer on the Home page and the Tourist Guide
   page.

   - Background: sunset beach illustration (public/images/)
   - Left side : heading + text + gold "Book Now >" button
   - The button changes color on hover and shrinks/darkens
     while it is pressed (active state).
   ============================================================ */

import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    // id="book" so the "Book Now" menu link can scroll here
    <section id="book" className="relative overflow-hidden">
      {/* background illustration covering the whole banner */}
      <img
        src="/images/cta-sunset.jpg"
        alt="Sunset over a Thai beach with an infinity pool"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* light gradient from the left so the navy text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/30 to-transparent" />

      {/* banner content */}
      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-bold leading-tight text-thai-navy sm:text-4xl">
            Book Your Unforgettable Thai Experience Today!
          </h2>
          <p className="mt-3 text-sm font-medium text-thai-navy/90 sm:text-base">
            Let us take care of your journey while you create beautiful memories.
          </p>

          {/* gold call-to-action button with hover + pressed states */}
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-thai-gold px-8 py-3 text-lg font-bold text-thai-navy shadow-lg transition-all duration-150
                       hover:bg-thai-gold-light hover:shadow-xl      /* mouse over  */
                       active:scale-95 active:bg-thai-gold-dark"    /* mouse press */
          >
            Book Now <span className="text-xl leading-none">&rsaquo;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
