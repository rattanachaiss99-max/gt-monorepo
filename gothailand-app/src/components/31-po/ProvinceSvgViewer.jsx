import { matchProvince } from "../../services/yokService";

export default function ProvinceSvgViewer({
  province,
  provinces = [],
  selectedSlug = "",
  onSelectProvince,
  accommodations = [],
  guides = [],
}) {
  if (!province) return null;

  // กรองที่พักและไกด์ของคุณ Yok ที่ตรงกับจังหวัดที่เลือก
  const localAccommodations = accommodations.filter((a) =>
    matchProvince(a.location, province)
  );
  const localGuides = guides.filter((g) =>
    matchProvince(g.province, province)
  );

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* หัวข้อ & Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🗺️ ผลลัพธ์การวาดแผนที่จาก MongoDB:
            <span className="text-blue-600">{province.nameTh}</span>
            <span className="text-sm font-normal text-slate-400">
              ({province.nameEn})
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            เวกเตอร์ SVG ด้านล่างถูกวาดขึ้นมาจากฟิลด์ <code>vectorData.d</code>{" "}
            ในฐานข้อมูล MongoDB Atlas โดยตรง
          </p>
        </div>

        {/* ตัวเลือกแบบ Dropdown */}
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

      {/* พื้นที่วาด SVG & แผงข้อมูล */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* ตัวแสดงผล SVG โดยตรง */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-xl">
          {province.d ? (
            <svg
              viewBox={province.viewBox || "0 0 200 200"}
              className="w-48 h-48 filter drop-shadow-md hover:scale-105 transition-transform"
            >
              <path
                d={province.d}
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
            viewBox: {province.viewBox}
          </span>
        </div>

        {/* ฟิลด์ข้อมูลที่ดึงมาจาก MongoDB & Yok API */}
        <div className="md:col-span-8 space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block">
                รหัสจังหวัด (provinceId)
              </span>
              <span className="font-bold text-slate-800 font-mono text-sm">
                {province.provinceId}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block">ภูมิภาค (region)</span>
              <span className="font-bold text-blue-700 capitalize">
                {province.region}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block">
                ขนาด Path (ตัวอักษร d)
              </span>
              <span className="font-bold text-emerald-600 font-mono">
                {province.d?.length.toLocaleString() || 0} ตัว
              </span>
            </div>
          </div>

          {/* คำขวัญประจำจังหวัด */}
          {province.slogan && (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-slate-700">
              <span className="font-bold text-blue-900 block mb-0.5">
                💬 คำขวัญ:
              </span>
              <span className="italic">"{province.slogan}"</span>
            </div>
          )}

          {/* บริการของ Yok ในจังหวัดนี้ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* ที่พัก */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  🏨 ที่พักในพื้นที่ (Yok API)
                </span>
                <span className="font-semibold text-blue-600 font-mono">
                  {localAccommodations.length} แห่ง
                </span>
              </div>
              {localAccommodations.length > 0 ? (
                <ul className="space-y-1">
                  {localAccommodations.map((acc) => (
                    <li
                      key={acc._id}
                      className="flex items-center justify-between text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-100"
                    >
                      <span className="truncate">{acc.name}</span>
                      <span className="font-medium text-emerald-600 ml-2 whitespace-nowrap">
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

            {/* ไกด์ */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  🧭 ไกด์นำเที่ยว (Yok API)
                </span>
                <span className="font-semibold text-blue-600 font-mono">
                  {localGuides.length} คน
                </span>
              </div>
              {localGuides.length > 0 ? (
                <ul className="space-y-1">
                  {localGuides.map((g) => (
                    <li
                      key={g._id}
                      className="flex items-center justify-between text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-100"
                    >
                      <span className="truncate">{g.name}</span>
                      <span className="font-medium text-emerald-600 ml-2 whitespace-nowrap">
                        ฿{(g.daily_fee ?? g.pricePerDay ?? g.price)?.toLocaleString()}/วัน
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

          {/* ตัวอย่าง SVG Path ดิบ */}
          <div>
            <span className="text-slate-400 block mb-1">
              ตัวอย่าง SVG Path Snippet (จาก MongoDB):
            </span>
            <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap line-clamp-2">
              {province.d?.slice(0, 120)}...
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
