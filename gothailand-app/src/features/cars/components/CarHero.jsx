import { useState, useRef, useEffect } from 'react';

/**
 * CarHero Component (Yok Search Bar Pattern)
 * -------------------------------------------------------------
 * ส่วนหัวแบนเนอร์ภาพรถ/การเดินทาง พร้อม Floating Search Card สไตล์เดียวกับ Yok
 * รองรับการเลือก: สถานที่รับ-คืนรถ, ช่วงวันเดินทาง (พร้อมคำนวณจำนวนวัน), ประเภทรถยนต์
 */
export default function CarHero({
  searchLocation = '',
  onSearchLocationChange,
  pickupDate = '2026-10-15',
  onPickupDateChange,
  returnDate = '2026-10-18',
  onReturnDateChange,
  selectedCategory = 'all',
  onSelectedCategoryChange,
  onSearchSubmit,
}) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [typePickerOpen, setTypePickerOpen] = useState(false);

  const datePickerRef = useRef(null);
  const typePickerRef = useRef(null);

  // ปิด Popover เมื่อคลิกภายนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setDatePickerOpen(false);
      }
      if (typePickerRef.current && !typePickerRef.current.contains(event.target)) {
        setTypePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ฟังก์ชันจัดรูปแบบวันที่ให้อ่านง่าย เช่น "Thu, Oct 15"
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // คำนวณจำนวนวันเช่า
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 3;
    try {
      const d1 = new Date(pickupDate);
      const d2 = new Date(returnDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 3;
    }
  };

  const rentalDays = calculateDays();

  const categories = [
    { id: 'all', label: 'All Types' },
    { id: 'SUV', label: 'SUV' },
    { id: 'Sedan', label: 'Sedan' },
    { id: 'Economy', label: 'Economy' },
    { id: 'Luxury', label: 'Luxury' },
    { id: 'MPV', label: 'MPV / Van' },
  ];

  const currentCategoryLabel =
    categories.find((c) => c.id.toLowerCase() === selectedCategory.toLowerCase())?.label ||
    'All Types';

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDatePickerOpen(false);
    setTypePickerOpen(false);
    onSearchSubmit?.();
  };

  return (
    <section className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-8 bg-[#0a192f] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 shadow-md relative overflow-hidden">
      {/* Background Graphic Pattern */}
      <img
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80"
        alt="Scenic Highway Drive"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/70 via-[#0a192f]/85 to-[#0a192f] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title & Subtitle */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3 inline-block">
            Premium Car Rentals in Thailand
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Explore Thailand Your Way
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Premium car rentals for your exclusive journey. From sleek sedans to luxury SUVs, discover the freedom of the open road.
          </p>
        </div>

        {/* Floating Search Bar Card (Yok Pattern) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-2 sm:p-2.5 border border-slate-200/90 flex flex-col md:flex-row items-center gap-2 md:gap-3 text-slate-800 max-w-5xl mx-auto"
        >
          {/* Section 1: Pick-up & Return Location */}
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
            <div className="flex-1">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Pick-up & Return Location
              </span>
              <input
                type="text"
                placeholder="Bangkok, Chiang Mai, Phuket..."
                value={searchLocation}
                onChange={(e) => onSearchLocationChange?.(e.target.value)}
                className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent border-none outline-none p-0 focus:ring-0"
              />
            </div>
            {searchLocation && (
              <button
                type="button"
                onClick={() => onSearchLocationChange?.('')}
                className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                title="Clear location"
              >
                ✕
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-slate-200" />

          {/* Section 2: Dates (Pick-up - Return + Days Pill) */}
          <div className="relative w-full md:w-auto shrink-0" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => {
                setDatePickerOpen((prev) => !prev);
                setTypePickerOpen(false);
              }}
              className="w-full md:w-auto px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between md:justify-start gap-2.5 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <svg
                  className="w-5 h-5 text-slate-700 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={1.8} />
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.8} strokeLinecap="round" />
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.8} strokeLinecap="round" />
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.8} />
                </svg>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Rental Dates
                  </span>
                  <div className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                    <span>{formatDateLabel(pickupDate) || 'Pick-up'}</span>
                    <span className="mx-1.5 text-slate-400">-</span>
                    <span>{formatDateLabel(returnDate) || 'Return'}</span>
                  </div>
                </div>
              </div>

              {/* Rental days badge */}
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ml-1">
                {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
              </span>
            </button>

            {/* Date Picker Popover */}
            {datePickerOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 min-w-[280px]">
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="hero-pickup"
                      className="block text-xs font-bold text-slate-500 uppercase mb-1"
                    >
                      Pick-up Date
                    </label>
                    <input
                      id="hero-pickup"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => onPickupDateChange?.(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hero-return"
                      className="block text-xs font-bold text-slate-500 uppercase mb-1"
                    >
                      Return Date
                    </label>
                    <input
                      id="hero-return"
                      type="date"
                      value={returnDate}
                      onChange={(e) => onReturnDateChange?.(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="pt-1 flex justify-end border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setDatePickerOpen(false)}
                      className="text-xs font-bold text-[#0a192f] hover:text-amber-600 cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-slate-200" />

          {/* Section 3: Vehicle Type */}
          <div className="relative w-full md:w-auto shrink-0" ref={typePickerRef}>
            <button
              type="button"
              onClick={() => {
                setTypePickerOpen((prev) => !prev);
                setDatePickerOpen(false);
              }}
              className="w-full md:w-auto px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer text-left"
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
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h2"
                />
              </svg>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Vehicle Type
                </span>
                <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                  {currentCategoryLabel} ▾
                </span>
              </div>
            </button>

            {/* Vehicle Type Dropdown */}
            {typePickerOpen && (
              <div className="absolute top-full left-0 md:right-0 md:left-auto mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 min-w-[200px]">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectedCategoryChange?.(cat.id);
                        setTypePickerOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCategory.toLowerCase() === cat.id.toLowerCase()
                          ? 'bg-amber-100 text-amber-950 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory.toLowerCase() === cat.id.toLowerCase() && (
                        <span className="text-amber-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Search Button */}
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
              <span>Search Cars</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
