import { useState } from 'react';
import FilterSidebarShell from '../../../components/common/FilterSidebarShell';
import AdminVisibilityFilterSection from '../../../components/common/AdminVisibilityFilterSection';

/**
 * GuideFilterSidebar Component (Unified Design Pattern)
 * -------------------------------------------------------------
 * แถบตัวกรองด้านซ้ายสำหรับระบบมัคคุเทศก์ท่องเที่ยว:
 *  - ใช้งาน FilterSidebarShell เพื่อความสอดคล้องกับ CarFilterSidebar และ FilterSidebar
 *  - รองรับ Mobile Drawer พับ/ขยายอัตโนมัติบนจอมือถือ
 *  - Header พร้อมปุ่ม Reset all เมื่อมีตัวกรองถูกเลือก
 *  - Active Filter Pills พร้อมปุ่ม ✕ สำหรับลบตัวกรอง
 *  - หมวดหมู่แบบ Collapsible Sections
 *  - สไลเดอร์ราคาและปุ่มลัดราคาด่วน (Presets)
 *  - ตัวกรองภาษา, ใบอนุญาต, เพศสภาพ, และป้าย Verified Guides Only
 */
export default function GuideFilterSidebar({
  selectedProvince = '',
  onSelectProvince,
  maxDailyRate = 5000,
  onMaxDailyRateChange,
  selectedLanguages = [],
  onToggleLanguage,
  selectedLicenseCategory = 'all',
  onSelectLicenseCategory,
  selectedGender = 'all',
  onSelectGender,
  verifiedOnly = false,
  onToggleVerifiedOnly,
  onResetFilters,
  provinceCounts = {},
  languageCounts = {},
  totalCount = 0,
  visibilityFilter = 'all',
  onVisibilityFilterChange,
  visibilityStats,
}) {
  // สถานะการพับ/ขยายแต่ละ Section
  const [openSections, setOpenSections] = useState({
    verified: true,
    destination: true,
    price: true,
    languages: true,
    license: true,
    gender: true,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const commonLanguages =
    Object.keys(languageCounts).length > 0
      ? Object.keys(languageCounts).sort()
      : ['English', 'Thai', 'Mandarin', 'Japanese', 'Korean', 'French', 'German'];

  const pricePresets = [
    { label: '< ฿2,000', value: 2000 },
    { label: '< ฿3,000', value: 3000 },
    { label: '< ฿4,000', value: 4000 },
  ];

  // ตรวจสอบว่ามีตัวกรองกำลังทำงานอยู่หรือไม่
  const hasActiveFilters = Boolean(
    selectedProvince ||
    maxDailyRate < 5000 ||
    selectedLanguages.length > 0 ||
    (selectedLicenseCategory && selectedLicenseCategory !== 'all') ||
    (selectedGender && selectedGender !== 'all') ||
    verifiedOnly ||
    (visibilityFilter && visibilityFilter !== 'all')
  );

  // สร้างรายการ Active Filter Pills
  const activePills = [];

  if (visibilityFilter && visibilityFilter !== 'all') {
    activePills.push({
      id: 'visibility',
      label: visibilityFilter === 'visible' ? '👁️ กำลังแสดง' : '🙈 ซ่อนอยู่',
      onRemove: () => onVisibilityFilterChange && onVisibilityFilterChange('all'),
    });
  }

  if (verifiedOnly) {
    activePills.push({
      id: 'verified',
      label: 'Verified Only',
      onRemove: () => onToggleVerifiedOnly && onToggleVerifiedOnly(false),
    });
  }

  if (selectedProvince) {
    activePills.push({
      id: 'province',
      label: selectedProvince,
      onRemove: () => onSelectProvince && onSelectProvince(''),
    });
  }

  if (maxDailyRate < 5000) {
    activePills.push({
      id: 'price',
      label: `< ฿${maxDailyRate.toLocaleString()}`,
      onRemove: () => onMaxDailyRateChange && onMaxDailyRateChange(5000),
    });
  }

  selectedLanguages.forEach((lang) => {
    activePills.push({
      id: `lang-${lang}`,
      label: lang,
      onRemove: () => onToggleLanguage && onToggleLanguage(lang),
    });
  });

  if (selectedLicenseCategory && selectedLicenseCategory !== 'all') {
    activePills.push({
      id: 'license',
      label: selectedLicenseCategory,
      onRemove: () => onSelectLicenseCategory && onSelectLicenseCategory('all'),
    });
  }

  if (selectedGender && selectedGender !== 'all') {
    activePills.push({
      id: 'gender',
      label: `Gender: ${selectedGender}`,
      onRemove: () => onSelectGender && onSelectGender('all'),
    });
  }

  return (
    <FilterSidebarShell
      title="Filters"
      subtitleCount={totalCount}
      subtitleLabel="registered guides"
      hasActiveFilters={hasActiveFilters}
      onResetFilters={onResetFilters}
      activePills={activePills}
    >
      {/* ส่วนควบคุมสถานะ Admin (Shared Component - Style เดิม) */}
      <AdminVisibilityFilterSection
        visibilityFilter={visibilityFilter}
        onVisibilityFilterChange={onVisibilityFilterChange}
        stats={visibilityStats}
      />

      {/* 1. Verified Guide Quick Toggle */}
      <div className="bg-amber-50/60 border border-amber-200/70 p-3.5 rounded-2xl">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Verified Guides Only
              </span>
              <span className="text-[10px] text-slate-500 block">
                ผ่านการตรวจเอกสารกรมการท่องเที่ยว
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onToggleVerifiedOnly && onToggleVerifiedOnly(e.target.checked)}
            className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
          />
        </label>
      </div>

      {/* 2. Destination / Province */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <button
          type="button"
          onClick={() => toggleSection('destination')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
            Destination / Province
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {openSections.destination ? '▲' : '▼'}
          </span>
        </button>

        {openSections.destination && (
          <div className="space-y-2 pt-1">
            <select
              value={selectedProvince}
              onChange={(e) => onSelectProvince && onSelectProvince(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 bg-slate-50 outline-none focus:border-[#0a192f] focus:bg-white transition cursor-pointer"
            >
              <option value="">All Provinces (ทุกจังหวัด)</option>
              {Object.entries(provinceCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([prov, count]) => (
                  <option key={prov} value={prov}>
                    {prov} ({count})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* 3. Max Daily Fee Slider & Presets */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
            Daily Fee (THB)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 font-mono">
              ≤ ฿{maxDailyRate.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {openSections.price ? '▲' : '▼'}
            </span>
          </div>
        </button>

        {openSections.price && (
          <div className="space-y-3 pt-1">
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={maxDailyRate}
              onChange={(e) => onMaxDailyRateChange && onMaxDailyRateChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0a192f]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>฿1,000</span>
              <span>฿3,000</span>
              <span>฿5,000</span>
            </div>

            {/* Price Quick Presets */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {pricePresets.map((preset) => {
                const isActive = maxDailyRate === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onMaxDailyRateChange && onMaxDailyRateChange(preset.value)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0a192f] text-amber-400 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Spoken Languages */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <button
          type="button"
          onClick={() => toggleSection('languages')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
            Languages Spoken
          </span>
          <div className="flex items-center gap-2">
            {selectedLanguages.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
            <span className="text-xs text-slate-400 font-medium">
              {openSections.languages ? '▲' : '▼'}
            </span>
          </div>
        </button>

        {openSections.languages && (
          <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1">
            {commonLanguages.map((lang) => {
              const count = languageCounts[lang] || 0;
              const checked = selectedLanguages.includes(lang);
              return (
                <label
                  key={lang}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleLanguage && onToggleLanguage(lang)}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 accent-amber-500 cursor-pointer"
                    />
                    <span className={checked ? 'font-bold text-slate-900' : 'font-normal'}>
                      {lang}
                    </span>
                  </div>
                  {count > 0 && (
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {count}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. License Category */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <button
          type="button"
          onClick={() => toggleSection('license')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
            License Category
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {openSections.license ? '▲' : '▼'}
          </span>
        </button>

        {openSections.license && (
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {[
              { id: 'all', label: 'All Licenses (ทุกประเภท)' },
              { id: 'General', label: 'General (ทั่วไป)' },
              { id: 'Specific Region', label: 'Specific Region (เฉพาะภูมิภาค)' },
              { id: 'Local', label: 'Local (ท้องถิ่น)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectLicenseCategory && onSelectLicenseCategory(cat.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedLicenseCategory === cat.id
                    ? 'bg-[#0a192f] text-amber-400 shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 border border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6. Gender */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('gender')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
            Guide Gender
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {openSections.gender ? '▲' : '▼'}
          </span>
        </button>

        {openSections.gender && (
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[
              { id: 'all', label: 'Any' },
              { id: 'Male', label: 'Male' },
              { id: 'Female', label: 'Female' },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelectGender && onSelectGender(g.id)}
                className={`py-1.5 rounded-lg text-xs font-bold text-center transition cursor-pointer ${
                  selectedGender === g.id
                    ? 'bg-[#0a192f] text-amber-400 shadow-xs'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </FilterSidebarShell>
  );
}
