import { matchProvince, matchCarProvince } from "../../services/yokService";

export default function ProvinceSvgViewer({
  province,
  provinces = [],
  selectedSlug = "",
  onSelectProvince,
  accommodations = [],
  guides = [],
  cars = [],
}) {
  if (!province) return null;

  // กรองที่พัก รถเช่า และไกด์ของคุณ Yok ที่ตรงกับจังหวัดที่เลือก
  const localAccommodations = accommodations.filter((a) =>
    matchProvince(a.location, province)
  );
  const localCars = cars.filter((c) =>
    matchCarProvince(c, province)
  );
  const localGuides = guides.filter((g) =>
    matchProvince(g.province, province)
  );

  // Fallbacks รองรับโครงสร้างข้อมูลทั้งจาก Po API และ Yok Backend
  const svgPath = province.d || province.vectorData?.d || "";
  const svgViewBox = province.viewBox || province.vectorData?.viewBox || "0 0 800 600";
  const pId = province.provinceId || (province.code ? `TH-${province.code}` : (province.id ? `TH-${province.id}` : "-"));
  const displayNameTh = province.nameTh || province.name_th || province.name || "";
  const displayNameEn = province.nameEn || province.name_en || province.slug || "";
  const pathLength = svgPath ? svgPath.length : 0;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header & Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🗺️ ผลลัพธ์การวาดแผนที่จาก MongoDB:
            <span className="text-blue-600">{displayNameTh}</span>
            <span className="text-sm font-normal text-slate-400">
              ({displayNameEn})
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            เวกเตอร์ SVG ด้านล่างถูกวาดขึ้นมาจากฟิลด์ <code>vectorData.d</code>{" "}
            ในฐานข้อมูล MongoDB Atlas โดยตรง
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="province-select"
            className="text-xs font-medium text-slate-600"
          >
            เลือกจังหวัด:
          </label>
          <select
            id="province-select"
            value={selectedSlug}
            onChange={(e) => onSelectProvince?.(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {provinces.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.nameTh} ({p.nameEn}) - {p.provinceId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SVG Canvas & Info Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Native SVG Renderer */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-xl">
          {svgPath ? (
            <svg
              viewBox={svgViewBox}
              className="w-48 h-48 filter drop-shadow-md hover:scale-105 transition-transform"
            >
              <path
                d={svgPath}
                fill="#0284c7"
                stroke="#0369a1"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <div className="text-xs text-slate-400">
              ไม่มีข้อมูล vectorData.d
            </div>
          )}
          <span className="mt-3 text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
            viewBox: {svgViewBox}
          </span>
        </div>

        {/* Fields extracted from MongoDB & Yok API */}
        <div className="md:col-span-8 space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block">
                รหัสจังหวัด (provinceId)
              </span>
              <span className="font-bold text-slate-800 font-mono text-sm">
                {pId}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block">ภูมิภาค (region)</span>
              <span className="font-bold text-blue-700 capitalize">
                {province.region_th || province.region}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block">
                ขนาด Path (ตัวอักษร d)
              </span>
              <span className="font-bold text-emerald-600 font-mono">
                {pathLength.toLocaleString()} ตัว
              </span>
            </div>
          </div>

          {/* Slogan */}
          {province.slogan && (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-slate-700">
              <span className="font-bold text-blue-900 block mb-0.5">
                💬 คำขวัญ:
              </span>
              <span className="italic">"{province.slogan}"</span>
            </div>
          )}

          {/* Yok Services in this Province */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {/* 1. Accommodations */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    🏨 ที่พักในพื้นที่ (Yok API)
                  </span>
                  <span className="font-semibold text-blue-600 font-mono">
                    {localAccommodations.length} แห่ง
                  </span>
                </div>
                {localAccommodations.length > 0 ? (
                  <ul className="space-y-1 max-h-32 overflow-y-auto pr-0.5">
                    {localAccommodations.map((acc) => (
                      <li
                        key={acc._id}
                        className="flex items-center justify-between text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-100"
                      >
                        <span className="truncate" title={acc.name}>{acc.name}</span>
                        <span className="font-medium text-emerald-600 ml-1.5 whitespace-nowrap">
                          ฿{(acc.price ?? acc.base_price_per_night ?? acc.basePrice)?.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    ยังไม่มีที่พักในระบบของจังหวัดนี้
                  </p>
                )}
              </div>
            </div>

            {/* 2. Cars */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    🚗 รถเช่าในพื้นที่ (Yok API)
                  </span>
                  <span className="font-semibold text-blue-600 font-mono">
                    {localCars.length} คัน
                  </span>
                </div>
                {localCars.length > 0 ? (
                  <ul className="space-y-1 max-h-32 overflow-y-auto pr-0.5">
                    {localCars.map((car) => (
                      <li
                        key={car._id || car.slug}
                        className="flex items-center justify-between text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-100"
                      >
                        <span className="truncate" title={car.name}>{car.name}</span>
                        <span className="font-medium text-emerald-600 ml-1.5 whitespace-nowrap">
                          ฿{(car.pricePerDay ?? car.price)?.toLocaleString()}/วัน
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    ยังไม่มีรถเช่าในระบบของจังหวัดนี้
                  </p>
                )}
              </div>
            </div>

            {/* 3. Guides */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    🧭 ไกด์นำเที่ยว (Yok API)
                  </span>
                  <span className="font-semibold text-blue-600 font-mono">
                    {localGuides.length} คน
                  </span>
                </div>
                {localGuides.length > 0 ? (
                  <ul className="space-y-1 max-h-32 overflow-y-auto pr-0.5">
                    {localGuides.map((g) => (
                      <li
                        key={g._id}
                        className="flex items-center justify-between text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-100"
                      >
                        <span className="truncate" title={g.name}>{g.name}</span>
                        <span className="font-medium text-emerald-600 ml-1.5 whitespace-nowrap">
                          ฿{g.price?.toLocaleString()}/วัน
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    ยังไม่มีไกด์ในระบบของจังหวัดนี้
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Raw SVG Path Snippet */}
          <div>
            <span className="text-slate-400 block mb-1">
              ตัวอย่าง SVG Path Snippet (จาก MongoDB):
            </span>
            <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap line-clamp-2">
              {svgPath?.slice(0, 120)}...
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
