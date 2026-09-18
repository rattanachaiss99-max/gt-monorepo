/* ============================================================
   components/ServiceCard.jsx
   One white selection card of the home page
   (Accommodation / Car Rental / Tourist Guide).

   The whole card is a link:
   - hover : gold border, bigger shadow, card lifts up
   - press : card is pushed down + navy border (pressed feeling)
   ============================================================ */

import { Link } from "react-router-dom";

export default function ServiceCard({ title, image, link }) {
  return (
    <Link
      to={link}
      className="
        block rounded-2xl border-2 border-transparent bg-white p-5 shadow-md
        transition-all duration-200
        hover:-translate-y-1 hover:border-thai-gold hover:shadow-xl   /* mouse over  */
        active:translate-y-0 active:scale-[0.98]
        active:border-thai-navy active:shadow-md                      /* mouse press */
      "
    >
      {/* card title */}
      <h3 className="text-center font-display text-2xl font-bold text-thai-navy">{title}</h3>

      {/* card illustration */}
      <img src={image} alt={title} className="mt-4 h-52 w-full rounded-xl object-cover shadow-inner" />
    </Link>
  );
}
