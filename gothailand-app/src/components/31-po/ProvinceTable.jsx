import React, { useState } from "react";

export default function ProvinceTable({
  provinces = [],
  selectedSlug = "",
  onSelectProvince,
}) {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const filteredProvinces = provinces.filter((p) => {
    const matchSearch =
      !search ||
      p.nameTh?.includes(search) ||
      p.nameEn?.toLowerCase().includes(search.toLowerCase()) ||
      p.provinceId?.toLowerCase().includes(search.toLowerCase());
    const matchRegion = selectedRegion === "all" || p.region === selectedRegion;
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredProvinces.map((prov) => {
              const isSelected = prov.slug === selectedSlug;
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
                  <td className="py-2 px-3 font-mono">{prov.provinceId}</td>
                  <td className="py-2 px-3">{prov.nameTh}</td>
                  <td className="py-2 px-3 font-mono text-slate-500">
                    {prov.nameEn} ({prov.slug})
                  </td>
                  <td className="py-2 px-3 capitalize">{prov.region}</td>
                  <td className="py-2 px-3">
                    {prov.d ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        มี SVG ({prov.d.length} ch)
                      </span>
                    ) : (
                      <span className="text-slate-400">ไม่มีข้อมูล</span>
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
