import { useState } from 'react';

/**
 * CarFilterSidebar Component (Yok Design Pattern)
 * -------------------------------------------------------------
 * แถบตัวกรองรถยนต์ดีไซน์คลีน เรียบหรู:
 *  - Header พร้อมปุ่ม Reset all เมื่อมีตัวกรองถูกเลือก
 *  - Active Filter Pills: ป้ายตัวกรองที่เลือกพร้อมปุ่มกากบาท ✕ เพื่อยกเลิก
 *  - หมวดหมู่รถ (Car Type) พร้อมป้ายแสดงจำนวน (Facet Counts)
 *  - สไลเดอร์และปุ่มลัดราคาด่วน (Price Presets)
 *  - จุดรับ-ส่งรถยอดนิยม (Airport & City Hubs)
 *  - ชนิดเชื้อเพลิง (Fuel Type) และจำนวนที่นั่ง (Seats)
 *  - Collapsible Sections: รองรับการพับ/ขยายแต่ละกลุ่ม
 * -------------------------------------------------------------
 */
export default function CarFilterSidebar({
  selectedCategories = [],
  onToggleCategory,
  maxPrice = 5000,
  onMaxPriceChange,
  selectedLocation = '',
  onSelectLocation,
  selectedFuelTypes = [],
  onToggleFuelType,
  selectedSeats = null, // null | 5 | 7
  onSelectSeats,
  selectedTransmission = 'all', // 'all' | 'Automatic' | 'Manual'
  onSelectTransmission,
  onResetFilters,
  // Dynamic counts
  categoryCounts = {},
  fuelCounts = {},
  totalCount = 0,
  locations = [],
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // การพับ/ขยายส่วนต่างๆ
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    location: true,
    fuel: true,
    seats: true,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const categories = ['Economy', 'Sedan', 'SUV', 'MPV', 'Luxury'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

  const pricePresets = [
    { label: '< ฿1,500', value: 1500 },
    { label: '< ฿2,500', value: 2500 },
    { label: '< ฿4,000', value: 4000 },
    { label: 'ทั้งหมด', value: 5000 },
  ];

  // ตรวจสอบว่ามีการเลือกตัวกรองใดๆ อยู่หรือไม่
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    maxPrice < 5000 ||
    Boolean(selectedLocation) ||
    selectedFuelTypes.length > 0 ||
    selectedSeats !== null ||
    selectedTransmission !== 'all';

  return (
    <aside className="w-full lg:w-76 shrink-0">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="w-full bg-white border border-slate-200/80 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-800 flex items-center justify-between shadow-2xs cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </span>
          <span className="text-slate-400 text-xs font-bold">
            {mobileOpen ? 'Hide ▲' : 'Show ▼'}
          </span>
        </button>
      </div>

      {/* Main Filter Card Container */}
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-5 ${
          mobileOpen ? 'block' : 'hidden lg:block'
        } lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto`}
      >
        {/* Header: Title, Active Count Badge & Reset */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center shadow-2xs">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Filter Cars
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {totalCount} vehicles available
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Reset all
            </button>
          )}
        </div>

        {/* Active Filter Pills Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => onToggleCategory?.(cat)}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            ))}

            {selectedLocation && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                <span className="max-w-[120px] truncate">{selectedLocation}</span>
                <button
                  type="button"
                  onClick={() => onSelectLocation?.('')}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {maxPrice < 5000 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                <span>&le; ฿{maxPrice.toLocaleString()}</span>
                <button
                  type="button"
                  onClick={() => onMaxPriceChange?.(5000)}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedFuelTypes.map((fuel) => (
              <span
                key={fuel}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
              >
                <span>{fuel}</span>
                <button
                  type="button"
                  onClick={() => onToggleFuelType?.(fuel)}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            ))}

            {selectedSeats !== null && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                <span>{selectedSeats === 7 ? '7+ Seats' : '4-5 Seats'}</span>
                <button
                  type="button"
                  onClick={() => onSelectSeats?.(null)}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        {/* Section 1: Car Type (Category) */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer py-1"
          >
            <span>Car Type</span>
            <span className="text-slate-400 font-normal">
              {openSections.category ? '−' : '+'}
            </span>
          </button>

          {openSections.category && (
            <div className="space-y-1.5 pt-1">
              {categories.map((cat) => {
                const checked = selectedCategories.includes(cat);
                const count = categoryCounts[cat] || 0;
                return (
                  <label
                    key={cat}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      checked
                        ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/80'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleCategory?.(cat)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                      />
                      <span>{cat}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        checked
                          ? 'bg-amber-200 text-amber-900 font-bold'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Price Range */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer py-1"
          >
            <span>Price / Day</span>
            <span className="text-slate-400 font-normal">
              {openSections.price ? '−' : '+'}
            </span>
          </button>

          {openSections.price && (
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Up to:</span>
                <span className="font-serif font-bold text-sm text-slate-900">
                  ฿{maxPrice.toLocaleString()} / day
                </span>
              </div>

              <input
                type="range"
                min="1000"
                max="5000"
                step="200"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange?.(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              {/* Price Presets */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {pricePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onMaxPriceChange?.(preset.value)}
                    className={`text-[11px] font-semibold py-1.5 px-2 rounded-lg transition-colors cursor-pointer text-center ${
                      maxPrice === preset.value
                        ? 'bg-[#0a192f] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Pick-up Location */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer py-1"
          >
            <span>Pick-up Location</span>
            <span className="text-slate-400 font-normal">
              {openSections.location ? '−' : '+'}
            </span>
          </button>

          {openSections.location && (
            <div className="space-y-2 pt-1">
              <select
                value={selectedLocation}
                onChange={(e) => onSelectLocation?.(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 outline-none focus:border-amber-500"
              >
                <option value="">All Locations (ทุกจุดรับรถ)</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              {/* Quick Hub Chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {['Bangkok (BKK)', 'Don Mueang (DMK)', 'Chiang Mai (CNX)', 'Phuket (HKT)'].map(
                  (hub) => {
                    const matchedLoc = locations.find((l) => l.includes(hub.split(' ')[0]));
                    const isActive = selectedLocation && selectedLocation.includes(hub.split(' ')[0]);
                    return (
                      <button
                        key={hub}
                        type="button"
                        onClick={() =>
                          onSelectLocation?.(isActive ? '' : matchedLoc || hub)
                        }
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#0a192f] text-amber-400 border-[#0a192f]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {hub}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Fuel Type */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection('fuel')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer py-1"
          >
            <span>Fuel Type</span>
            <span className="text-slate-400 font-normal">
              {openSections.fuel ? '−' : '+'}
            </span>
          </button>

          {openSections.fuel && (
            <div className="space-y-1.5 pt-1">
              {fuelTypes.map((fuel) => {
                const checked = selectedFuelTypes.includes(fuel);
                const count = fuelCounts[fuel] || 0;
                return (
                  <label
                    key={fuel}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      checked
                        ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/80'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleFuelType?.(fuel)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                      />
                      <span>{fuel}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 5: Seating Capacity */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection('seats')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer py-1"
          >
            <span>Seating Capacity</span>
            <span className="text-slate-400 font-normal">
              {openSections.seats ? '−' : '+'}
            </span>
          </button>

          {openSections.seats && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onSelectSeats?.(selectedSeats === 5 ? null : 5)}
                className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-colors cursor-pointer text-center ${
                  selectedSeats === 5
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                4-5 Seats
              </button>
              <button
                type="button"
                onClick={() => onSelectSeats?.(selectedSeats === 7 ? null : 7)}
                className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-colors cursor-pointer text-center ${
                  selectedSeats === 7
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                7+ Seats
              </button>
            </div>
          )}
        </div>

        {/* Section 6: Transmission */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleSection('transmission')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer py-1"
          >
            <span>Transmission</span>
            <span className="text-slate-400 font-normal">
              {openSections.transmission ? '−' : '+'}
            </span>
          </button>

          {openSections.transmission && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onSelectTransmission?.(selectedTransmission === 'Automatic' ? 'all' : 'Automatic')}
                className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-colors cursor-pointer text-center ${
                  selectedTransmission === 'Automatic'
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Automatic
              </button>
              <button
                type="button"
                onClick={() => onSelectTransmission?.(selectedTransmission === 'Manual' ? 'all' : 'Manual')}
                className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-colors cursor-pointer text-center ${
                  selectedTransmission === 'Manual'
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Manual
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
