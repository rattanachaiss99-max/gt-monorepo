import { useState, useRef, useEffect } from 'react';
import { formatDateLabel, calculateDateSpan } from '../../../utils/date';

/**
 * AccommodationHero Component
 * -------------------------------------------------------------
 * ส่วนหัว Hero Banner พร้อม Floating Search Bar Card
 * สไตล์รูปแบบตามภาพตัวอย่างใหม่ แต่ใช้โทนสีกรมท่าเข้ม (#0a192f) เดิม
 * -------------------------------------------------------------
 */
export default function AccommodationHero({
  searchTerm = '',
  onSearchTermChange,
  checkIn = '2026-09-18',
  onCheckInChange,
  checkOut = '2026-09-19',
  onCheckOutChange,
  guestCount = 2,
  onGuestCountChange,
  onSearchSubmit,
}) {
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(guestCount);
  const [children, setChildren] = useState(0);

  // ทำให้ state adults ภายในตรงกับ guestCount ที่ parent reset หรืออัปเดต
  const [prevGuestCount, setPrevGuestCount] = useState(guestCount);
  if (prevGuestCount !== guestCount) {
    setPrevGuestCount(guestCount);
    setAdults(guestCount);
  }

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);

  const datePickerRef = useRef(null);
  const guestPickerRef = useRef(null);

  // ปิด dropdown เมื่อคลิกนอกกล่อง
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setDatePickerOpen(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target)) {
        setGuestPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ซิงก์จำนวนผู้ใหญ่กับตัวกรอง guest count ของ parent
  const handleAdultsChange = (val) => {
    const newAdults = Math.max(1, val);
    setAdults(newAdults);
    onGuestCountChange?.(newAdults);
  };

  const nights = calculateDateSpan(checkIn, checkOut);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDatePickerOpen(false);
    setGuestPickerOpen(false);
    onSearchSubmit?.();
  };

  return (
    <section className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-8 bg-[#0a192f] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 shadow-md relative overflow-hidden">
      {/* รูปพื้นหลัง — สไตล์เดียวกับ CarHero */}
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80"
        alt="Thailand hotel resort"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/70 via-[#0a192f]/85 to-[#0a192f] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* หัวข้อ & คำอธิบายย่อย */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3 inline-block">
            Handpicked Hotels, Villas & Resorts
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Curated Stays Across Thailand
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Handpicked hotels, villas, and resorts with verified reviews and flexible booking.
          </p>
        </div>

        {/* กล่องค้นหาแบบลอย (ดีไซน์ตามภาพตัวอย่าง) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-2 sm:p-2.5 border border-slate-200/90 flex flex-col md:flex-row items-center gap-2 md:gap-3 text-slate-800"
        >
          {/* ส่วนที่ 1: จะไปที่ไหน? */}
          <div className="w-full md:flex-1 bg-[#f1f5f9]/70 hover:bg-[#f1f5f9] transition-colors rounded-xl px-3.5 py-2.5 flex items-center gap-3">
            <svg
              className="w-5 h-5 text-slate-600 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Where to?"
              value={searchTerm}
              onChange={(e) => onSearchTermChange?.(e.target.value)}
              className="w-full text-sm font-semibold text-slate-800 placeholder-slate-500 bg-transparent border-none outline-none p-0 focus:ring-0"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchTermChange?.('')}
                className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* เส้นคั่น */}
          <div className="hidden md:block w-px h-7 bg-slate-200" />

          {/* ส่วนที่ 2: วันที่ (เช่น Fri, Sep 18 - Sat, Sep 19 + ป้ายจำนวนคืน) */}
          <div className="relative w-full md:w-auto shrink-0" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => {
                setDatePickerOpen((prev) => !prev);
                setGuestPickerOpen(false);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between md:justify-start gap-2.5 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <svg
                  className="w-5 h-5 text-slate-700 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    strokeWidth={1.8}
                  />
                  <line
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="6"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="2"
                    x2="8"
                    y2="6"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.8} />
                </svg>

                <div className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                  <span>{formatDateLabel(checkIn) || 'Check in'}</span>
                  <span className="mx-1.5 text-slate-400">-</span>
                  <span>{formatDateLabel(checkOut) || 'Check out'}</span>
                </div>
              </div>

              {/* ป้ายจำนวนคืน */}
              <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ml-1">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
            </button>

            {/* Popover เลือกวันที่ */}
            {datePickerOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 min-w-[280px]">
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="hero-checkin"
                      className="block text-xs font-bold text-slate-500 uppercase mb-1"
                    >
                      Check-in Date
                    </label>
                    <input
                      id="hero-checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => onCheckInChange?.(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hero-checkout"
                      className="block text-xs font-bold text-slate-500 uppercase mb-1"
                    >
                      Check-out Date
                    </label>
                    <input
                      id="hero-checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => onCheckOutChange?.(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setDatePickerOpen(false)}
                      className="text-xs font-bold text-[#0a192f] hover:underline"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* เส้นคั่น */}
          <div className="hidden md:block w-px h-7 bg-slate-200" />

          {/* ส่วนที่ 3: ห้องพัก & ผู้เข้าพัก (1 ห้อง, 2 ผู้ใหญ่, 0 เด็ก) */}
          <div className="relative w-full md:w-auto shrink-0" ref={guestPickerRef}>
            <button
              type="button"
              onClick={() => {
                setGuestPickerOpen((prev) => !prev);
                setDatePickerOpen(false);
              }}
              className="w-full md:w-auto px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer text-left"
            >
              <svg
                className="w-5 h-5 text-slate-700 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                {rooms} room{rooms > 1 ? 's' : ''}, {adults} adult{adults > 1 ? 's' : ''},{' '}
                {children} {children === 1 ? 'child' : 'children'}
              </span>
            </button>

            {/* Popover ผู้เข้าพัก */}
            {guestPickerOpen && (
              <div className="absolute top-full left-0 md:right-0 md:left-auto mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 min-w-[270px]">
                <div className="space-y-3.5">
                  {/* ห้องพัก */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Rooms</div>
                      <div className="text-xs text-slate-500">Number of rooms</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRooms((r) => Math.max(1, r - 1))}
                        disabled={rooms <= 1}
                        className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-sm text-slate-900">
                        {rooms}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRooms((r) => r + 1)}
                        className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ผู้ใหญ่ */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Adults</div>
                      <div className="text-xs text-slate-500">Ages 13 or above</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleAdultsChange(adults - 1)}
                        disabled={adults <= 1}
                        className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-sm text-slate-900">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdultsChange(adults + 1)}
                        className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* เด็ก */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Children</div>
                      <div className="text-xs text-slate-500">Ages 0 to 12</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setChildren((c) => Math.max(0, c - 1))}
                        disabled={children <= 0}
                        className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-sm text-slate-900">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren((c) => c + 1)}
                        className="w-7 h-7 rounded-full border border-slate-300 text-slate-700 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setGuestPickerOpen(false)}
                      className="text-xs font-bold text-[#0a192f] hover:underline"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ส่วนที่ 4: ปุ่มค้นหา (โทนสีกรมท่าเข้ม #0a192f และสีทองเดิม) */}
          <div className="w-full md:w-auto shrink-0 md:ml-auto">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#0a192f] hover:bg-[#112240] active:bg-[#071324] text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
