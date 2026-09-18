/* ============================================================
   components/AvailabilityCalendar.jsx
   The small "Available Date" calendar inside every guide card.

   - The dark header shows the month with < > arrows to move to
     the previous / next month.
   - Days where the guide is available are highlighted in gold
     (the days come from getAvailableDays() in moc-data/guides.js).
   - Available days change color on hover and darken while
     pressed, like the rest of the website.
   ============================================================ */

import { useState } from "react";
import { getAvailableDays } from "../mock-data/guides";

// Column headers of the calendar (Sunday first, like the design)
const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// English month names for the header tooltip / label
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AvailabilityCalendar({ guideId }) {
  // The month that is currently displayed.
  // We start with the current real month.
  const today = new Date();
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(), // 0 = January ... 11 = December
  });

  // Days this guide is free in the displayed month (e.g. [2, 3, 8, ...])
  const availableDays = getAvailableDays(guideId, view.year, view.month);

  // Calendar maths:
  const firstWeekday = new Date(view.year, view.month, 1).getDay();          // 0=Su of the 1st
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();      // length of month

  // Go one month back (January wraps to December of the previous year)
  const goPrevMonth = () => {
    setView(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
  };

  // Go one month forward (December wraps to January of the next year)
  const goNextMonth = () => {
    setView(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );
  };

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-gray-300 bg-white">
      {/* ----- dark header with month navigation ----- */}
      <div className="flex items-center justify-between bg-thai-navy px-2 py-1 text-white">
        {/* previous month arrow */}
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label="Previous month"
          className="rounded px-1.5 text-sm transition-colors hover:text-thai-gold active:text-thai-gold-dark"
        >
          &lsaquo;
        </button>
        <span className="text-[11px] font-semibold">
          {/* example: "Available Date" on the first line, month below */}
          <span className="block leading-tight">Available Date</span>
          <span className="block text-[9px] font-normal text-white/70">
            {MONTH_NAMES[view.month]} {view.year}
          </span>
        </span>
        {/* next month arrow */}
        <button
          type="button"
          onClick={goNextMonth}
          aria-label="Next month"
          className="rounded px-1.5 text-sm transition-colors hover:text-thai-gold active:text-thai-gold-dark"
        >
          &rsaquo;
        </button>
      </div>

      {/* ----- weekday header row ----- */}
      <div className="grid grid-cols-7 bg-gray-100 text-center text-[9px] font-semibold text-gray-500">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="py-0.5">{day}</span>
        ))}
      </div>

      {/* ----- day number grid ----- */}
      <div className="grid grid-cols-7 gap-y-0.5 p-1 text-center text-[9px]">
        {/* empty cells before day 1 so the 1st falls on the correct weekday */}
        {Array.from({ length: firstWeekday }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {/* one cell for every day of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const isAvailable = availableDays.includes(day);
          return (
            <span
              key={day}
              title={isAvailable ? `${name(guideId)} is available on ${day}` : undefined}
              className={
                isAvailable
                  ? // available day -> gold badge, darker on hover / press
                    "mx-auto flex h-4.5 w-4.5 items-center justify-center rounded bg-thai-gold font-bold text-white cursor-pointer transition-colors hover:bg-thai-gold-light active:bg-thai-gold-dark"
                  : // normal day -> plain gray number
                    "mx-auto flex h-4.5 w-4.5 items-center justify-center rounded text-gray-400"
              }
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* Small helper: the calendar only receives the guide id, but the
   tooltip text looks nicer with a name. "Guide #12" is enough. */
function name(guideId) {
  return `Guide #${guideId}`;
}
