/**
 * GuideHero Component
 * -------------------------------------------------------------
 * Hero Section + Floating Search Bar สำหรับระบบไกด์นำเที่ยว
 * สไตล์เดียวกับ CarHero: ภาพพื้นหลัง + gradient overlay
 * Floating Search Bar: Province / Destination, Language Spoken, Tour Date
 * Province และ Language options ดึงจาก API data จริง (ไม่ hardcode)
 */

const POPULAR_PROVINCE_IDS = [
  { id: 'Chiang Mai', label: 'Chiang Mai', icon: '⛰️' },
  { id: 'Bangkok', label: 'Bangkok', icon: '🏙️' },
  { id: 'Phuket', label: 'Phuket', icon: '🏖️' },
  { id: 'Phra Nakhon Si Ayutthaya', label: 'Ayutthaya', icon: '🛕' },
  { id: 'Krabi', label: 'Krabi', icon: '⛵' },
  { id: 'Surat Thani', label: 'Surat Thani', icon: '🌴' },
];

export default function GuideHero({
  selectedProvince,
  onSelectedProvinceChange,
  tourDate,
  onTourDateChange,
  selectedLanguage,
  onSelectedLanguageChange,
  availableProvinces = [],
  availableLanguages = [],
  onSearchSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  const popularPills = POPULAR_PROVINCE_IDS.filter(
    (p) => availableProvinces.length === 0 || availableProvinces.includes(p.id)
  );

  return (
    <section className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-8 bg-[#0a192f] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 shadow-md relative overflow-hidden">
      {/* Background Image — สไตล์เดียวกับ CarHero */}
      <img
        src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1800&q=80"
        alt="Thailand travel guide"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/70 via-[#0a192f]/85 to-[#0a192f] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title & Subtitle */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3 inline-block">
            Department of Tourism Licensed Guides
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Explore Thailand with Certified Local Guides
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            ค้นพบมัคคุเทศก์มืออาชีพที่มีใบอนุญาตถูกต้อง ชำนาญเส้นทาง ประวัติศาสตร์ วัฒนธรรม และอาหารท้องถิ่นทั่วทุกจังหวัด
          </p>
        </div>

        {/* Floating Search Bar — 3 fields */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-2 sm:p-2.5 border border-slate-200/90 flex flex-col md:flex-row items-center gap-2 md:gap-0 text-slate-800 max-w-4xl mx-auto"
        >
          {/* ช่อง 1: Province */}
          <div className="w-full md:flex-1 bg-[#f1f5f9]/70 hover:bg-[#f1f5f9] transition-colors rounded-xl px-3.5 py-2.5 flex items-center gap-3">
            <span className="text-slate-500 text-base shrink-0">📍</span>
            <div className="flex-1">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Province / Destination
              </span>
              <select
                value={selectedProvince}
                onChange={(e) => onSelectedProvinceChange(e.target.value)}
                className="w-full text-sm font-semibold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="">All Provinces (ทั่วประเทศ)</option>
                {availableProvinces.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

          {/* ช่อง 2: Language */}
          <div className="w-full md:flex-1 hover:bg-slate-50 transition-colors rounded-xl px-3.5 py-2.5 flex items-center gap-3">
            <span className="text-slate-500 text-base shrink-0">🗣️</span>
            <div className="flex-1">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Language Spoken
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => onSelectedLanguageChange(e.target.value)}
                className="w-full text-sm font-semibold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="all">Any Language (ทุกภาษา)</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200 mx-1" />

          {/* ช่อง 3: Tour Date */}
          <div className="w-full md:flex-1 hover:bg-slate-50 transition-colors rounded-xl px-3.5 py-2.5 flex items-center gap-3">
            <span className="text-slate-500 text-base shrink-0">📅</span>
            <div className="flex-1">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Tour Date
              </span>
              <input
                type="date"
                value={tourDate}
                onChange={(e) => onTourDateChange(e.target.value)}
                className="w-full text-sm font-semibold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* ปุ่ม Search */}
          <div className="w-full md:w-auto shrink-0 md:ml-2">
            <button
              type="submit"
              className="w-full md:w-auto bg-[#0a192f] hover:bg-[#112240] active:bg-[#071324] text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Guides</span>
            </button>
          </div>
        </form>

        {/* Quick Province Pills */}
        {popularPills.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Popular:</span>
            <button
              type="button"
              onClick={() => onSelectedProvinceChange('')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                !selectedProvince
                  ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
              }`}
            >
              <span>🌏</span>
              <span>All</span>
            </button>
            {popularPills.map((prov) => (
              <button
                key={prov.id}
                type="button"
                onClick={() => onSelectedProvinceChange(prov.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedProvince === prov.id
                    ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                <span>{prov.icon}</span>
                <span>{prov.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
