export default function ProvinceSvgViewer({
  province,
  provinces = [],
  selectedSlug = "",
  onSelectProvince,
}) {
  if (!province) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header & Dropdown */}
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

        {/* Fields extracted from MongoDB */}
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

          {/* Slogan */}
          {province.slogan && (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-slate-700">
              <span className="font-bold text-blue-900 block mb-0.5">
                💬 คำขวัญ:
              </span>
              <span className="italic">"{province.slogan}"</span>
            </div>
          )}

          {/* Raw SVG Path Snippet */}
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
