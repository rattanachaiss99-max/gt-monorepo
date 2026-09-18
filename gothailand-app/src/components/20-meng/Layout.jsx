/* ============================================================
   components/Layout.jsx
   The shared "frame" of every page:
       <Navbar>  (top)
       <Outlet>  (here react-router renders the current page)
       <Footer>  (bottom)

   It also contains a small scroll manager:
   - when you open a normal page      -> scroll back to the top
   - when the URL has an #anchor      -> smooth-scroll to that
     section (e.g. "/#services" scrolls to the services cards)
   ============================================================ */

import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  // location changes every time the user navigates to another page
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // The URL contains an anchor (example: /#services).
      // Find the element with that id and scroll to it smoothly.
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    // Normal navigation: always show the page from the top.
    window.scrollTo(0, 0);
  }, [location]); // run again every time the URL changes

  return (
    // min-h-screen + flex column keeps the footer at the bottom
    // even when a page has little content.
    <div className="flex min-h-screen flex-col bg-thai-cream">
      <Navbar />
      {/* The current page (Home, TouristGuide, ...) is rendered here */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
