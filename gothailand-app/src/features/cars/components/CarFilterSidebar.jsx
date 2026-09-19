import { useState } from 'react';
import FilterSidebarShell from '../../../components/common/FilterSidebarShell';

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
  selectedSeats = null, // ค่าที่เป็นไปได้: null | 5 | 7
  onSelectSeats,
  selectedTransmission = 'all', // ค่าที่เป็นไปได้: 'all' | 'Automatic' | 'Manual'
  onSelectTransmission,
  onResetFilters,
  // จำนวนแบบไดนามิก
  categoryCounts = {},
  fuelCounts = {},
  totalCount = 0,
  locations = [],
}) {
  // การพับ/ขยายส่วนต่างๆ
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    location: true,
    fuel: true,
    seats: true,
    transmission: true,
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

  const activePills = (
    <>
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
    </>
  );

  return (
    <FilterSidebarShell
      title="Filter Cars"
      subtitleCount={totalCount}
      subtitleLabel="vehicles available"
      hasActiveFilters={hasActiveFilters}
      onResetFilters={onResetFilters}
      activePills={activePills}
    >
        {/* ส่วนที่ 1: ประเภทรถ (หมวดหมู่) */}
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

        {/* ส่วนที่ 2: ช่วงราคา */}
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

              {/* ปุ่มลัดราคาด่วน */}
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

        {/* ส่วนที่ 3: จุดรับรถ */}
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

              {/* ชิปจุดรับรถยอดนิยม */}
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

        {/* ส่วนที่ 4: ชนิดเชื้อเพลิง */}
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

        {/* ส่วนที่ 5: จำนวนที่นั่ง */}
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

        {/* ส่วนที่ 6: ระบบเกียร์ */}
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
    </FilterSidebarShell>
  );
}
