/**
 * GuideFilterSidebar Component
 * -------------------------------------------------------------
 * แถบตัวกรองด้านซ้ายสำหรับระบบมัคคุเทศก์ท่องเที่ยว สไตล์เดียวกับ CarFilterSidebar:
 * - ตัวกรองจังหวัดและภูมิภาค พร้อมจำนวนไกด์จริง
 * - ตัวกรองราคาค่าบริการต่อวัน (Daily Fee Slider)
 * - ตัวกรองภาษาที่สื่อสารได้ (Language Checkboxes)
 * - ตัวกรองประเภทใบอนุญาต (License Category)
 * - ตัวกรองเพศสภาพ (Gender)
 * - ป้าย Verified Guides Only (เฉพาะไกด์ที่ผ่านการตรวจสอบ)
 * - ปุ่ม Reset ตัวกรองทั้งหมด
 */

export default function GuideFilterSidebar({
  selectedProvince,
  onSelectProvince,
  maxDailyRate,
  onMaxDailyRateChange,
  selectedLanguages,
  onToggleLanguage,
  selectedLicenseCategory,
  onSelectLicenseCategory,
  selectedGender,
  onSelectGender,
  verifiedOnly,
  onToggleVerifiedOnly,
  onResetFilters,
  provinceCounts = {},
  languageCounts = {},
  totalCount = 0,
}) {
  // รายชื่อภาษาดึงจาก API data จริง ผ่าน languageCounts
  // fallback เป็น list ทั่วไปกรณีข้อมูลยังไม่โหลด
  const commonLanguages =
    Object.keys(languageCounts).length > 0
      ? Object.keys(languageCounts).sort()
      : ['English', 'Thai', 'Mandarin', 'Japanese', 'Korean', 'French', 'German'];

  return (
    <aside className="w-full lg:w-72 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6 shrink-0">
      {/* Header: Title & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900">Filters</h2>
          <span className="text-[11px] text-slate-400">
            {totalCount} registered guides
          </span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* 1. Verified Guide Quick Toggle */}
      <div className="bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-2xl">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Verified Guides
              </span>
              <span className="text-[10px] text-slate-500 block">
                ผ่านการตรวจเอกสารกรมการท่องเที่ยว
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onToggleVerifiedOnly(e.target.checked)}
            className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
          />
        </label>
      </div>

      {/* 2. Filter: Destination / Province */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Destination / Province
        </h3>
        <select
          value={selectedProvince}
          onChange={(e) => onSelectProvince(e.target.value)}
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

      {/* 3. Filter: Max Daily Fee (Slider) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
            Max Daily Fee
          </h3>
          <span className="font-serif font-bold text-slate-900 text-sm">
            ฿{maxDailyRate.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="5000"
          step="100"
          value={maxDailyRate}
          onChange={(e) => onMaxDailyRateChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0a192f]"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>฿1,000</span>
          <span>฿3,000</span>
          <span>฿5,000</span>
        </div>
      </div>

      {/* 4. Filter: Spoken Languages */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Languages Spoken
        </h3>
        <div className="space-y-2">
          {commonLanguages.map((lang) => {
            const count = languageCounts[lang] || 0;
            const checked = selectedLanguages.includes(lang);
            return (
              <label
                key={lang}
                className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleLanguage(lang)}
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
      </div>

      {/* 5. Filter: License Category */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          License Category
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { id: 'all', label: 'All Licenses' },
            { id: 'General', label: 'General (ทั่วไป)' },
            { id: 'Specific Region', label: 'Specific Region (เฉพาะภูมิภาค)' },
            { id: 'Local', label: 'Local (ท้องถิ่น)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectLicenseCategory(cat.id)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedLicenseCategory === cat.id
                  ? 'bg-[#0a192f] text-amber-400 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Filter: Gender */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Guide Gender
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'all', label: 'Any' },
            { id: 'Male', label: 'Male' },
            { id: 'Female', label: 'Female' },
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelectGender(g.id)}
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
      </div>
    </aside>
  );
}
