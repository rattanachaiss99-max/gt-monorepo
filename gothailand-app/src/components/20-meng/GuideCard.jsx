/* ============================================================
   components/GuideCard.jsx
   One selection card of the Tourist Guide page.

   Card layout (like the design picture):
   - left   : cartoon portrait of the guide
   - right  : name, short description, star rating and the
              "Available Date" calendar
   - bottom : navy "More information >" pill button that
              overlaps the lower edge of the card

   Hover : gold border + bigger shadow (card "selected" feeling)
   Press : card shrinks slightly + navy border (pressed feeling)
   ============================================================ */

import AvailabilityCalendar from "./AvailabilityCalendar";
import GuideAvatar from "./GuideAvatar";

/* Renders 5 stars; the first `rating` stars are gold. */
function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-sm leading-none" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-thai-gold" : "text-gray-300"}>
          &#9733; {/* star character */}
        </span>
      ))}
    </div>
  );
}

export default function GuideCard({ guide }) {
  return (
    // "relative" lets the "More information" button overlap the
    // bottom edge of the card (absolute positioning below).
    <article
      className="
        relative rounded-xl border-2 border-transparent bg-white p-3 shadow-md
        transition-all duration-200
        hover:-translate-y-0.5 hover:border-thai-gold hover:shadow-xl  /* mouse over  */
        active:translate-y-0 active:scale-[0.98]
        active:border-thai-navy                                        /* mouse press */
      "
    >
      
        <div className="flex gap-3">
        {/* ----- left side: portrait photo ----- */}
        <div className="h-44 w-[36%] shrink-0 overflow-hidden rounded-lg">
          {/* [แก้ไขบรรทัดที่ 40]: เปลี่ยนจาก <GuideAvatar /> มาเป็นแท็ก <img> เพื่อแสดงรูปจาก public/images/ */}
          {/* หมายเหตุ: 
              1. ใน Next.js / React รูปที่อยู่ในโฟลเดอร์ public สามารถอ้างอิงด้วย /images/... ได้เลย
              2. หาก guide.image เก็บค่าเป็น "Guide01.jpg" โค้ดจะดึงเป็น /images/Guide01.jpg
              3. หากต้องการดึงรูปตาม id เช่น Guide01 สามารถเขียนเป็น `/images/Guide0${guide.id}.jpg` แทนได้เช่นกัน
          */}
          <img 
            src={guide.image ? `/images/${guide.image}` : `/images/Guide0${guide.id}.jpg`} 
            alt={guide.name}
            className="h-full w-full object-cover"
          />
        </div>

      

        {/* ----- right side: information ----- */}
        <div className="min-w-0 flex-1">
          {/* guide name */}
          <h3 className="font-display text-lg font-bold text-thai-navy">{guide.name}</h3>

          {/* short description of the guide */}
          <p className="mt-0.5 text-xs leading-snug text-gray-600">{guide.description}</p>

          {/* star rating */}
          <Stars rating={guide.rating} />

          {/* small calendar with the available days */}
          <AvailabilityCalendar guideId={guide.id} />
        </div>
      </div>

      {/* ----- "More information" button overlapping the card edge ----- */}
      <button
        type="button"
        className="
          absolute -bottom-3 left-4 flex items-center gap-1 rounded-full bg-thai-navy
          px-4 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-150
          hover:bg-thai-navy-light hover:shadow-lg      /* mouse over  */
          active:scale-95 active:bg-thai-gold active:text-thai-navy /* mouse press */
        "
      >
        More information <span className="text-sm leading-none">&rsaquo;</span>
      </button>
    </article>
  );
}
