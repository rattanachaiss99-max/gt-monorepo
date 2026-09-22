import { useState } from "react";
import { matchProvince, matchCarProvince } from "../../services/yokService";
import { useAuth } from "../../context/AuthContext";
import { useItemVisibility } from "../../context/ItemVisibilityContext";

export default function ProvinceTable({
  provinces = [],
  selectedSlug = "",
  onSelectProvince,
  accommodations = [],
  guides = [],
  cars = [],
}) {
  const { isAdmin } = useAuth();
  const { isItemVisible, adminCustomerPreview } = useItemVisibility();
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const filteredProvinces = provinces.filter((p) => {
    const q = search.trim().toLowerCase();
    const nameTh = p.nameTh || p.name_th || p.name || "";
    const nameEn = p.nameEn || p.name_en || p.slug || "";
    const pId = p.provinceId || (p.code ? `TH-${p.code}` : (p.id ? `TH-${p.id}` : ""));

    const matchSearch =
      !q ||
      nameTh.includes(q) ||
      nameEn.toLowerCase().includes(q) ||
      pId.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q);

    const matchRegion =
      selectedRegion === "all" ||
      p.region === selectedRegion ||
      p.region_th === selectedRegion;

    return matchSearch && matchRegion;
  });

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-slate-900">
            รายการข้อมูล 77 จังหวัดใน MongoDB Atlas
          </h3>
          <p className="text-xs text-slate-500">
            คลิกที่แถวของจังหวัดเพื่อสลับดูรูปทรง SVG และข้อมูลทันที
          </p>
        </div>

        {/* Search & Region Filter */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="ค้นหาชื่อหรือรหัส..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
          />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">ทุกภาค</option>
            <option value="north">เหนือ</option>
            <option value="central">กลาง</option>
            <option value="isan">อีสาน</option>
            <option value="south">ใต้</option>
            <option value="east">ตะวันออก</option>
            <option value="west">ตะวันตก</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-lg max-h-80 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-200 font-semibold">
            <tr>
              <th className="py-2.5 px-3">รหัส</th>
              <th className="py-2.5 px-3">ชื่อไทย</th>
              <th className="py-2.5 px-3">ชื่ออังกฤษ (Slug)</th>
              <th className="py-2.5 px-3">ภาค</th>
              <th className="py-2.5 px-3">SVG Status</th>
              <th className="py-2.5 px-3">บริการ (Yok API)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredProvinces.map((prov) => {
              const isSelected = prov.slug === selectedSlug;
              const isCustomerView = !isAdmin || adminCustomerPreview;
              const hasAcc = accommodations.some((a) =>
                matchProvince(a.location, prov) &&
                (!isCustomerView || isItemVisible('accommodations', a, [a.id, a._id, a.slug]))
              );
              const hasCar = cars.some((c) =>
                matchCarProvince(c, prov) &&
                (!isCustomerView || isItemVisible('cars', c, [c._id, c.slug, c.id]))
              );
              const hasGuide = guides.some((g) =>
                matchProvince(g.province, prov) &&
                (!isCustomerView || isItemVisible('guides', g, [g._id, g.slug, g.id]))
              );

              return (
                <tr
                  key={prov.slug}
                  onClick={() => onSelectProvince?.(prov.slug)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50/80 font-bold text-blue-900"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="py-2 px-3 font-mono">
                    {prov.provinceId || (prov.code ? `TH-${prov.code}` : (prov.id ? `TH-${prov.id}` : "-"))}
                  </td>
                  <td className="py-2 px-3">{prov.nameTh || prov.name_th}</td>
                  <td className="py-2 px-3 font-mono text-slate-500">
                    {prov.nameEn || prov.name_en} ({prov.slug})
                  </td>
                  <td className="py-2 px-3 capitalize">{prov.region_th || prov.region}</td>
                  <td className="py-2 px-3">
                    {prov.d || prov.vectorData?.d ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        มี SVG ({((prov.d || prov.vectorData?.d) || "").length.toLocaleString()} ch)
                      </span>
                    ) : (
                      <span className="text-slate-400">ไม่มีข้อมูล</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {hasAcc || hasCar || hasGuide ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {hasAcc && (
                          <span
                            className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            title="มีที่พักในระบบ Yok API"
                          >
                            🏨 ที่พัก
                          </span>
                        )}
                        {hasCar && (
                          <span
                            className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            title="มีรถเช่าในระบบ Yok API"
                          >
                            🚗 รถเช่า
                          </span>
                        )}
                        {hasGuide && (
                          <span
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            title="มีไกด์นำเที่ยวในระบบ Yok API"
                          >
                            🧭 ไกด์
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
