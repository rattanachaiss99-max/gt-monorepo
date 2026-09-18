/* ============================================================
   components/Navbar.jsx
   The dark-blue header bar used on every page.

   Contains:
   - the "GoThailand" logo + tagline (left side)
   - the main menu: Home / Services / Destinations / About Us
   - the gold "Book Now" button (right side)

   Hover behaviour : menu items turn gold + get a light background
   Press behaviour : while the mouse button is down the item gets
                     a gold background with navy text (active:...)
   The current page is highlighted with a gold underline.
   ============================================================ */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks, tagline } from "../mock-data/siteInfo";

export default function Navbar() {
  // location tells us which page is currently open,
  // so we can highlight the active menu item.
  const location = useLocation();

  // open/close state of the mobile hamburger menu
  const [menuOpen, setMenuOpen] = useState(false);

  /* A menu item is "active" when its path matches the current URL.
     Hash links (like /#services) are never marked active. */
  const isActive = (to) => {
    if (to.includes("#")) return false;              // anchor link -> never active
    if (to === "/") return location.pathname === "/"; // home must match exactly
    return location.pathname.startsWith(to);          // other pages: match by prefix
  };

  return (
    <header className="sticky top-0 z-50 bg-thai-navy shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        {/* ----- Logo (links back to the home page) ----- */}
        <Link to="/" className="leading-tight">
          <span className="font-display text-3xl font-bold text-white sm:text-4xl">
            Go<span className="text-thai-gold">Thailand</span>
          </span>
          <span className="block text-[11px] font-medium tracking-wide text-thai-gold-light">
            {tagline}
          </span>
        </Link>

        {/* ----- Desktop menu (hidden on small screens) ----- */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`
                rounded-lg px-4 py-2 font-medium transition-colors duration-200
                hover:bg-white/10 hover:text-thai-gold            /* mouse over  */
                active:bg-thai-gold active:text-thai-navy         /* mouse press */
                ${isActive(link.to)
                  ? "text-thai-gold underline decoration-2 underline-offset-8"
                  : "text-white"}
              `}
            >
              {link.label}
            </Link>
          ))}

          {/* ----- Gold "Book Now" pill button ----- */}
          <Link
            to="/contact"
            className="ml-3 rounded-full bg-thai-gold px-6 py-2 font-bold text-thai-navy shadow transition-all duration-150
                       hover:bg-thai-gold-light hover:shadow-lg      /* mouse over  */
                       active:scale-95 active:bg-thai-gold-dark"    /* mouse press */
          >
            Book Now
          </Link>
        </nav>

        {/* ----- Hamburger button (only visible on mobile) ----- */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 hover:text-thai-gold active:bg-thai-gold active:text-thai-navy md:hidden"
        >
          {/* simple hamburger icon drawn with 3 bars */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> /* X icon when open */
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /> /* 3 bars */
            )}
          </svg>
        </button>
      </div>

      {/* ----- Mobile drop-down menu ----- */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-thai-navy px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)} // close the menu after clicking
              className={`
                block rounded-lg px-4 py-3 font-medium transition-colors
                hover:bg-white/10 hover:text-thai-gold
                active:bg-thai-gold active:text-thai-navy
                ${isActive(link.to) ? "text-thai-gold" : "text-white"}
              `}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-full bg-thai-gold px-6 py-2 text-center font-bold text-thai-navy
                       hover:bg-thai-gold-light active:scale-95 active:bg-thai-gold-dark transition-all"
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}
