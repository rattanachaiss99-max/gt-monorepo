import { useState } from 'react';

/**
 * FilterSidebar Component
 * -------------------------------------------------------------
 * แถบตัวกรองดีไซน์คลีน เรียบหรู:
 *  - เอา Emoji ออกทั้งหมด แสดงตัวหนังสือภาษาไทยและอังกฤษคมชัดเต็มคำ
 *  - ปุ่มเลือกภาคแสดงข้อความเต็ม ไม่มีการถูกตัดทอน (No truncation)
 *  - Province Selector: Dropdown คลีน + ชิปเลือกจุดหมายยอดนิยมแบบ 1-Click
 *  - Price Range: สไลเดอร์พร้อมปุ่มลัดราคาด่วน (Presets)
 *  - Collapsible Sections: พับ/ขยายส่วนต่างๆ ได้พร้อมป้ายนับ
 *  - Custom Checkbox Cards: ติ๊กง่าย มองเห็นสถานะชัดเจน
 * -------------------------------------------------------------
 */
export default function FilterSidebar({
  selectedRegion = 'central',
  onSelectRegion,
  selectedProvince = '',
  onSelectProvince,
  regionCounts = {},
  regionProvinces = {},
  maxPrice = 20000,
  onMaxPriceChange,
  selectedSpecialOptions = [],
  onToggleSpecialOption,
  selectedCategories = [],
  onToggleCategory,
  selectedFacilities = [],
  onToggleFacility,
  onResetFilters,
  // Dynamic facet counts passed from parent
  optionCounts = {},
  categoryCounts = {},
  facilityCounts = {},
  totalCount = 0,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    region: true,
    price: true,
    popular: true,
    category: true,
    facilities: false, // Default collapsed to keep sidebar tidy
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Region list without any emojis for clear, unobstructed typography
  const regionList = [
    { id: 'central', label: 'ภาคกลาง', en: 'Central' },
    { id: 'north', label: 'ภาคเหนือ', en: 'North' },
    { id: 'isan', label: 'ภาคอีสาน', en: 'Isan' },
    { id: 'south', label: 'ภาคใต้', en: 'South' },
    { id: 'east', label: 'ภาคตะวันออก', en: 'East' },
    { id: 'west', label: 'ภาคตะวันตก', en: 'West' },
    { id: 'all', label: 'ทุกภาค (ทั่วประเทศ)', en: 'All Thailand' },
  ];

  const specialOptionList = [
    'Breakfast Included',
    'Free Cancellation',
    'Private Pool',
    'Beachfront',
  ];

  const categoryList = [
    'Bed & Breakfast',
    'Guest House',
    'Luxury Resort',
    'Private Villa',
    'Luxury Hotel',
    'Budget Hotel',
  ];

  const facilityList = [
    'Free Wi-Fi',
    'Swimming Pool',
    'Gym',
    'Spa',
    'Restaurant',
    'Room Service',
    'Bar',
    'River View',
    'Mountain View',
    'Beach Access',
  ];

  // Check if any filter is active
  const hasActiveFilters =
    selectedRegion !== 'central' ||
    Boolean(selectedProvince) ||
    maxPrice < 20000 ||
    selectedSpecialOptions.length > 0 ||
    selectedCategories.length > 0 ||
    selectedFacilities.length > 0;

  // Provinces of currently selected region
  const activeRegionProvinces =
    selectedRegion !== 'all' ? regionProvinces[selectedRegion] || [] : [];

  // Top 3 tourist provinces in current region for quick-selection chips
  const quickProvinces = activeRegionProvinces.slice(0, 3);

  // Price presets
  const pricePresets = [
    { label: '< ฿2,500', value: 2500 },
    { label: '< ฿5,000', value: 5000 },
    { label: '< ฿10,000', value: 10000 },
    { label: 'ทั้งหมด', value: 20000 },
  ];

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
                Filters
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {totalCount} stays available
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
            {selectedRegion !== 'central' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                <span>{regionList.find((r) => r.id === selectedRegion)?.label}</span>
                <button
                  type="button"
                  onClick={() => onSelectRegion?.('central')}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedProvince && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg">
                <span>{selectedProvince}</span>
                <button
                  type="button"
                  onClick={() => onSelectProvince?.('')}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {maxPrice < 20000 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                <span>&le; ฿{maxPrice.toLocaleString()}</span>
                <button
                  type="button"
                  onClick={() => onMaxPriceChange?.(20000)}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedSpecialOptions.map((opt) => (
              <span
                key={opt}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-100 text-sky-950 px-2.5 py-1 rounded-lg"
              >
                <span>{opt}</span>
                <button
                  type="button"
                  onClick={() => onToggleSpecialOption?.(opt)}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 1. Region & Province (ภาค และ จังหวัด) */}
        <div className="space-y-3">
          <div
            onClick={() => toggleSection('region')}
            className="flex items-center justify-between cursor-pointer group select-none"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">
              Region (ภาค)
            </span>
            <span className="text-slate-400 text-xs font-bold">
              {openSections.region ? '▲' : '▼'}
            </span>
          </div>

          {openSections.region && (
            <div className="space-y-3">
              {/* Region List (Full width for clear, complete text) */}
              <div className="space-y-1">
                {regionList.map((r) => {
                  const isSelected = selectedRegion === r.id;
                  const count =
                    r.id === 'all'
                      ? Object.values(regionCounts).reduce((a, b) => a + b, 0)
                      : regionCounts[r.id] || 0;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        onSelectRegion?.(r.id);
                        if (selectedRegion !== r.id) {
                          onSelectProvince?.('');
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0a192f] text-white shadow-xs ring-2 ring-[#0a192f]/20'
                          : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      <span className="font-semibold text-xs sm:text-[13px] tracking-tight">
                        {r.label}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-2 ${
                          isSelected
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-white text-slate-500 border border-slate-200/60'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Province Selector for Selected Region */}
              {selectedRegion !== 'all' && activeRegionProvinces.length > 0 && (
                <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      จังหวัดใน{regionList.find((r) => r.id === selectedRegion)?.label}
                    </span>
                    {selectedProvince && (
                      <button
                        type="button"
                        onClick={() => onSelectProvince?.('')}
                        className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Clean Dropdown */}
                  <select
                    value={selectedProvince}
                    onChange={(e) => onSelectProvince?.(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-2xs"
                  >
                    <option value="">
                      ทุกจังหวัดใน{regionList.find((r) => r.id === selectedRegion)?.label} (
                      {regionCounts[selectedRegion] || 0} แห่ง)
                    </option>
                    {activeRegionProvinces.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} ({p.count} แห่ง)
                      </option>
                    ))}
                  </select>

                  {/* Quick Popular Province Chips (Top 3) */}
                  {quickProvinces.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 scrollbar-none">
                      <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                        ยอดนิยม:
                      </span>
                      {quickProvinces.map((p) => {
                        const isProvActive = selectedProvince === p.name;
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() =>
                              onSelectProvince?.(isProvActive ? '' : p.name)
                            }
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                              isProvActive
                                ? 'bg-amber-400 text-slate-900 shadow-2xs'
                                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                            }`}
                          >
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-px bg-slate-100" />

        {/* 2. Price Range (per night) */}
        <div className="space-y-3">
          <div
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between cursor-pointer group select-none"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">
              Price Range (per night)
            </span>
            <span className="text-slate-400 text-xs font-bold">
              {openSections.price ? '▲' : '▼'}
            </span>
          </div>

          {openSections.price && (
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Min ฿590
                </span>
                <span className="text-xs font-extrabold text-slate-900 bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-md font-mono shadow-2xs">
                  Up to ฿{Number(maxPrice).toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange?.(Number(e.target.value))}
                className="w-full accent-[#0a192f] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-1 pt-1">
                {pricePresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onMaxPriceChange?.(preset.value)}
                    className={`text-[10px] py-1 rounded-lg font-bold transition-all text-center cursor-pointer ${
                      maxPrice === preset.value
                        ? 'bg-[#0a192f] text-white shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-slate-100" />

        {/* 3. Popular Filters / Special Options */}
        <div className="space-y-3">
          <div
            onClick={() => toggleSection('popular')}
            className="flex items-center justify-between cursor-pointer group select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">
                Popular Filters
              </span>
              {selectedSpecialOptions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                  {selectedSpecialOptions.length}
                </span>
              )}
            </div>
            <span className="text-slate-400 text-xs font-bold">
              {openSections.popular ? '▲' : '▼'}
            </span>
          </div>

          {openSections.popular && (
            <div className="space-y-1.5">
              {specialOptionList.map((option) => {
                const isChecked = selectedSpecialOptions.includes(option);
                const count = optionCounts[option] || 0;

                return (
                  <label
                    key={option}
                    onClick={() => onToggleSpecialOption?.(option)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-amber-50/70 border border-amber-200/80 text-slate-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-[#0a192f] border-[#0a192f] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-amber-400 stroke-current stroke-3"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span>{option}</span>
                    </span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                        isChecked
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : 'text-slate-400 bg-slate-100'
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

        <div className="h-px bg-slate-100" />

        {/* 4. Property Type / Category */}
        <div className="space-y-3">
          <div
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between cursor-pointer group select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">
                Property Type
              </span>
              {selectedCategories.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </div>
            <span className="text-slate-400 text-xs font-bold">
              {openSections.category ? '▲' : '▼'}
            </span>
          </div>

          {openSections.category && (
            <div className="space-y-1.5">
              {categoryList.map((category) => {
                const isChecked = selectedCategories.includes(category);
                const count = categoryCounts[category] || 0;

                return (
                  <label
                    key={category}
                    onClick={() => onToggleCategory?.(category)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-amber-50/70 border border-amber-200/80 text-slate-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-[#0a192f] border-[#0a192f] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-amber-400 stroke-current stroke-3"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span>{category}</span>
                    </span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                        isChecked
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : 'text-slate-400 bg-slate-100'
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

        <div className="h-px bg-slate-100" />

        {/* 5. Facilities (Collapsible by default for clean UX) */}
        <div className="space-y-3">
          <div
            onClick={() => toggleSection('facilities')}
            className="flex items-center justify-between cursor-pointer group select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">
                Facilities
              </span>
              {selectedFacilities.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                  {selectedFacilities.length}
                </span>
              )}
            </div>
            <span className="text-slate-400 text-xs font-bold">
              {openSections.facilities ? '▲' : '▼'}
            </span>
          </div>

          {openSections.facilities && (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {facilityList.map((facility) => {
                const isChecked = selectedFacilities.includes(facility);
                const count = facilityCounts[facility] || 0;

                return (
                  <label
                    key={facility}
                    onClick={() => onToggleFacility?.(facility)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-amber-50/70 border border-amber-200/80 text-slate-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#0a192f] border-[#0a192f] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-amber-400 stroke-current stroke-3"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="truncate">{facility}</span>
                    </span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium shrink-0 ml-1.5 ${
                        isChecked
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : 'text-slate-400 bg-slate-100'
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
      </div>
    </aside>
  );
}
