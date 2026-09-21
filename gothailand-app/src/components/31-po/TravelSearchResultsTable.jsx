import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { matchProvince, matchCarProvince } from "../../services/yokService";

/**
 * TravelSearchResultsTable Component
 * -------------------------------------------------------------
 * แสดงผลลัพธ์การค้นหาบริการท่องเที่ยว (ที่พัก, รถเช่า, ไกด์)
 * รูปแบบ Table คล้ายคลึงกับ ProvinceTable.jsx เพื่อความสอดคล้องใน UI
 * รองรับ:
 * - ตัวกรองประเภทบริการ (ทั้งหมด, ที่พัก, รถเช่า, ไกด์)
 * - ช่องค้นหาข้อความแบบเรียลไทม์
 * - เรียงลำดับตามราคา / ชื่อ
 * - คลิกแถวเพื่อซิงก์เลือกจังหวัดไปยังแผนที่ SVG ด้านบน (Two-Way Binding)
 * - ปุ่มนำทางตรงไปยังหน้ารายละเอียดหรือการจองของบริการนั้นๆ
 */
export default function TravelSearchResultsTable({
  searchQuery,
  provinces = [],
  accommodations = [],
  cars = [],
  guides = [],
  selectedSlug = "",
  onSelectProvince,
}) {
  const navigate = useNavigate();

  // ตัวกรองภายในตาราง
  const [tableSearch, setTableSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all"); // 'all' | 'accommodations' | 'cars' | 'guides'
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended' | 'price-asc' | 'price-desc' | 'name'

  // จังหวัดที่อ้างอิงจากการค้นหา หรือจาก selectedSlug
  const targetSlug =
    searchQuery?.provinceSlug !== undefined
      ? searchQuery.provinceSlug
      : selectedSlug;
  const currentProvinceObj = provinces.find(
    (p) =>
      p.slug === targetSlug ||
      p.nameTh === targetSlug ||
      p.nameEn === targetSlug,
  );

  // แปลงรายการทั้งหมดจาก Yok API ให้อยู่ในโครงสร้าง Unified Search Item
  const allUnifiedItems = useMemo(() => {
    const items = [];

    // 1. ที่พัก (Accommodations)
    accommodations.forEach((acc) => {
      const matchedProv = provinces.find((p) => matchProvince(acc.location, p));
      const provNameTh =
        matchedProv?.nameTh ||
        (typeof acc.location === "object"
          ? acc.location?.city
          : acc.location) ||
        "ไม่ระบุ";
      const provNameEn = matchedProv?.nameEn || "";
      const provSlug = matchedProv?.slug || "";
      const price = acc.price ?? acc.base_price_per_night ?? acc.basePrice ?? 0;

      items.push({
        id: acc._id || acc.id || acc.slug,
        raw: acc,
        serviceType: "accommodations",
        serviceIcon: "🏨",
        serviceLabel: "ที่พัก",
        name: acc.name || "ที่พักไม่มีชื่อ",
        subTitle:
          acc.category || (acc.rating ? `⭐ ${acc.rating}` : "ที่พักคัดสรร"),
        provinceNameTh: provNameTh,
        provinceNameEn: provNameEn,
        provinceSlug: provSlug,
        matchedProv,
        price,
        priceUnit: "/คืน",
        highlight:
          acc.facilities?.slice(0, 3).join(", ") ||
          acc.special_options?.slice(0, 2).join(", ") ||
          "สิ่งอำนวยความสะดวกครบครัน",
        link: `/accommodations/${acc.slug || acc.id || acc._id}`,
      });
    });

    // 2. รถเช่า (Cars)
    cars.forEach((car) => {
      const matchedProv = provinces.find((p) => matchCarProvince(car, p));
      const provNameTh =
        matchedProv?.nameTh ||
        car.location ||
        (Array.isArray(car.availableLocations)
          ? car.availableLocations[0]
          : "") ||
        "ครอบคลุมหลายจังหวัด";
      const provNameEn = matchedProv?.nameEn || "";
      const provSlug = matchedProv?.slug || "";
      const price = car.pricePerDay ?? car.price ?? 0;
      const carTitle =
        car.name ||
        `${car.brand || ""} ${car.model || ""}`.trim() ||
        "รถเช่าขับเอง";

      items.push({
        id: car._id || car.id || car.slug,
        raw: car,
        serviceType: "cars",
        serviceIcon: "🚗",
        serviceLabel: "รถเช่า",
        name: carTitle,
        subTitle: car.category ? `ประเภท ${car.category}` : "รถเช่าขับเอง",
        provinceNameTh: provNameTh,
        provinceNameEn: provNameEn,
        provinceSlug: provSlug,
        matchedProv,
        price,
        priceUnit: "/วัน",
        highlight:
          [
            car.transmission ? `เกียร์ ${car.transmission}` : "",
            car.seats ? `${car.seats} ที่นั่ง` : "",
            car.fuelType ? `เชื้อเพลิง ${car.fuelType}` : "",
          ]
            .filter(Boolean)
            .join(" • ") || "ประกันภัยชั้น 1",
        link: `/cars/${car.slug || car.id || car._id}`,
      });
    });

    // 3. ไกด์นำเที่ยว (Guides)
    guides.forEach((guide) => {
      const matchedProv = provinces.find((p) =>
        matchProvince(guide.province, p),
      );
      const provNameTh = matchedProv?.nameTh || guide.province || "ทั่วประเทศ";
      const provNameEn = matchedProv?.nameEn || "";
      const provSlug = matchedProv?.slug || "";
      const price = guide.price ?? guide.dailyRate ?? 0;

      const langs = Array.isArray(guide.languages)
        ? guide.languages.join(", ")
        : guide.language || "ไทย";

      items.push({
        id: guide._id || guide.id || guide.slug,
        raw: guide,
        serviceType: "guides",
        serviceIcon: "🧭",
        serviceLabel: "ไกด์",
        name: guide.name || "มัคคุเทศก์ท้องถิ่น",
        subTitle: guide.licenseCategory
          ? `ใบอนุญาต: ${guide.licenseCategory}`
          : guide.verified
            ? "✓ ยืนยันตัวตนแล้ว"
            : "มัคคุเทศก์มีใบอนุญาต",
        provinceNameTh: provNameTh,
        provinceNameEn: provNameEn,
        provinceSlug: provSlug,
        matchedProv,
        price,
        priceUnit: "/วัน",
        highlight: `🗣️ พูดภาษา: ${langs}`,
        link: `/guides/${guide.slug || guide.id || guide._id}`,
      });
    });

    return items;
  }, [accommodations, cars, guides, provinces]);

  // กรองตามเงื่อนไขการค้นหาหลัก (searchQuery) และตัวกรองภายในตาราง (tableSearch, serviceFilter)
  const filteredItems = useMemo(() => {
    let result = [...allUnifiedItems];

    // 1. กรองตามจังหวัดจาก SearchQuery (ถ้ามีระบุจังหวัด)
    if (searchQuery?.provinceSlug) {
      result = result.filter((item) => {
        if (!item.matchedProv && !item.provinceSlug) return false;
        return (
          item.provinceSlug === searchQuery.provinceSlug ||
          (item.matchedProv &&
            matchProvince(item.raw.location || item.raw.province, {
              slug: searchQuery.provinceSlug,
            }))
        );
      });
    } else if (targetSlug) {
      // ถ้าไม่ได้กดค้นหาจังหวัดเฉพาะ แต่มีการเลือกจังหวัดใน SVG หรือ Dropdown ให้แสดงเฉพาะจังหวัดนั้น
      // หรือหากไม่มีข้อมูลในจังหวัดนั้น สามารถสลับดูได้
      const matched = result.filter((item) => item.provinceSlug === targetSlug);
      // ถ้าจังหวัดนี้มีบริการ ให้กรองเฉพาะจังหวัดนี้เป็นค่าตั้งต้น
      if (matched.length > 0) {
        result = matched;
      }
    }

    // 2. กรองตาม Service Type จาก SearchQuery (เช่น กดค้นหาจากแท็บที่พัก/รถเช่า/ไกด์)
    if (searchQuery?.serviceType && searchQuery.serviceType !== "all") {
      result = result.filter(
        (item) => item.serviceType === searchQuery.serviceType,
      );
    } else if (searchQuery?.selectedServices) {
      // โหมด All-in-One: กรองตาม checkboxes ที่เลือก
      result = result.filter(
        (item) => searchQuery.selectedServices[item.serviceType],
      );
    }

    // 3. กรองตาม Car Category จาก SearchQuery
    if (searchQuery?.carCategory && searchQuery.carCategory !== "all") {
      result = result.filter((item) => {
        if (item.serviceType !== "cars") return true;
        const cat = item.raw?.category?.toLowerCase() || "";
        return cat.includes(searchQuery.carCategory.toLowerCase());
      });
    }

    // 4. กรองตาม Guide Language จาก SearchQuery
    if (searchQuery?.guideLanguage && searchQuery.guideLanguage !== "all") {
      result = result.filter((item) => {
        if (item.serviceType !== "guides") return true;
        const qLang = searchQuery.guideLanguage.toLowerCase();
        const itemLangs = (
          Array.isArray(item.raw?.languages)
            ? item.raw.languages
            : [item.raw?.language || ""]
        ).map((l) => String(l).toLowerCase());
        return itemLangs.some((l) => l.includes(qLang));
      });
    }

    // 5. กรองตามตัวกรองประเภทบริการภายในตาราง (Pill Filter)
    if (serviceFilter !== "all") {
      result = result.filter((item) => item.serviceType === serviceFilter);
    }

    // 6. กรองตามช่องค้นหาข้อความภายในตาราง (tableSearch)
    if (tableSearch.trim()) {
      const q = tableSearch.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.provinceNameTh.includes(q) ||
          item.provinceNameEn.toLowerCase().includes(q) ||
          item.serviceLabel.includes(q) ||
          item.highlight.toLowerCase().includes(q) ||
          item.subTitle.toLowerCase().includes(q),
      );
    }

    // 7. เรียงลำดับ (Sorting)
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name, "th"));
    }

    return result;
  }, [
    allUnifiedItems,
    searchQuery,
    targetSlug,
    serviceFilter,
    tableSearch,
    sortBy,
  ]);

  // สรุปจำนวนแยกตามประเภท
  const countStats = useMemo(() => {
    return {
      all: filteredItems.length,
      accommodations: allUnifiedItems.filter(
        (i) => i.serviceType === "accommodations",
      ).length,
      cars: allUnifiedItems.filter((i) => i.serviceType === "cars").length,
      guides: allUnifiedItems.filter((i) => i.serviceType === "guides").length,
    };
  }, [filteredItems, allUnifiedItems]);

  // เมื่อคลิกที่แถวในตาราง
  const handleRowClick = (item) => {
    if (item.provinceSlug && onSelectProvince) {
      onSelectProvince(item.provinceSlug);
    }
  };

  // นำทางไปยังหน้ารายละเอียดหรือระบบจอง
  const handleNavigate = (e, link) => {
    e.stopPropagation();
    navigate(link);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* 1. Header & Controls (สไตล์คล้าย ProvinceTable.jsx) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>📋</span>
              <span>ผลลัพธ์การค้นหาบริการท่องเที่ยว</span>
            </h3>
            <span className="bg-amber-100 text-amber-900 border border-amber-300/70 text-xs font-bold px-2.5 py-0.5 rounded-full">
              พบ {filteredItems.length} รายการ
            </span>
            {currentProvinceObj && (
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                📍 {currentProvinceObj.nameTh} ({currentProvinceObj.nameEn})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ผลการค้นหาจาก Yok API ที่เชื่อมโยงกับฐานข้อมูล 77 จังหวัด •
            คลิกที่แถวเพื่อสลับดูแผนที่ SVG ด้านบน
          </p>
        </div>

        {/* ช่องค้นหา & ตัวกรองเรียงลำดับ */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="ค้นหาชื่อบริการ, จุดเด่น..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 w-44 sm:w-56"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="recommended">เรียง: แนะนำ</option>
            <option value="price-asc">ราคา: ต่ำ ➜ สูง</option>
            <option value="price-desc">ราคา: สูง ➜ ต่ำ</option>
            <option value="name">ชื่อ ก-ฮ</option>
          </select>
        </div>
      </div>

      {/* 2. แท็บกรองประเภทบริการ (Pill Tabs) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setServiceFilter("all")}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            serviceFilter === "all"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          ทั้งหมด ({filteredItems.length})
        </button>

        <button
          type="button"
          onClick={() => setServiceFilter("accommodations")}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            serviceFilter === "accommodations"
              ? "bg-blue-600 text-white shadow-2xs"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
          }`}
        >
          <span>🏨 ที่พัก ({countStats.accommodations})</span>
        </button>

        <button
          type="button"
          onClick={() => setServiceFilter("cars")}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            serviceFilter === "cars"
              ? "bg-amber-500 text-slate-950 shadow-2xs"
              : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
          }`}
        >
          <span>🚗 รถเช่า ({countStats.cars})</span>
        </button>

        <button
          type="button"
          onClick={() => setServiceFilter("guides")}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            serviceFilter === "guides"
              ? "bg-emerald-600 text-white shadow-2xs"
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
          }`}
        >
          <span>🧭 ไกด์นำเที่ยว ({countStats.guides})</span>
        </button>

        {tableSearch && (
          <button
            type="button"
            onClick={() => setTableSearch("")}
            className="text-[11px] text-slate-400 hover:text-slate-600 ml-auto cursor-pointer"
          >
            ✕ ล้างคำค้นหา
          </button>
        )}
      </div>

      {/* 3. ตารางผลลัพธ์การค้นหา (Table Layout คล้าย ProvinceTable) */}
      <div className="overflow-x-auto border border-slate-100 rounded-lg max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold z-10">
            <tr>
              <th className="py-2.5 px-3 whitespace-nowrap">บริการ</th>
              <th className="py-2.5 px-3 min-w-[200px]">ชื่อบริการ / รายการ</th>
              <th className="py-2.5 px-3 whitespace-nowrap">
                จังหวัด / พื้นที่
              </th>
              <th className="py-2.5 px-3 min-w-[180px]">รายละเอียด & ไฮไลท์</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">
                ราคาเริ่มต้น
              </th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap">
                ดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isCurrentProvince =
                  item.provinceSlug && item.provinceSlug === selectedSlug;

                return (
                  <tr
                    key={`${item.serviceType}-${item.id}`}
                    onClick={() => handleRowClick(item)}
                    className={`cursor-pointer transition-colors ${
                      isCurrentProvince
                        ? "bg-blue-50/60 font-medium text-slate-900"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* คอลัมน์ 1: ประเภทบริการ */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                          item.serviceType === "accommodations"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : item.serviceType === "cars"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        <span>{item.serviceIcon}</span>
                        <span>{item.serviceLabel}</span>
                      </span>
                    </td>

                    {/* คอลัมน์ 2: ชื่อบริการ */}
                    <td className="py-2.5 px-3">
                      <div
                        className="font-bold text-slate-800 truncate max-w-xs"
                        title={item.name}
                      >
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal truncate">
                        {item.subTitle}
                      </div>
                    </td>

                    {/* คอลัมน์ 3: จังหวัด / พื้นที่ */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-700 font-semibold">
                        <span className="text-slate-400">📍</span>
                        <span>{item.provinceNameTh}</span>
                      </div>
                      {item.provinceNameEn && (
                        <div className="text-[10px] text-slate-400 font-mono ml-4">
                          {item.provinceNameEn}
                        </div>
                      )}
                    </td>

                    {/* คอลัมน์ 4: จุดเด่น */}
                    <td className="py-2.5 px-3">
                      <div
                        className="text-[11px] text-slate-600 line-clamp-2"
                        title={item.highlight}
                      >
                        {item.highlight}
                      </div>
                    </td>

                    {/* คอลัมน์ 5: ราคา */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span className="font-black text-emerald-600 font-mono text-sm">
                        ฿{item.price ? item.price.toLocaleString() : "ตามตกลง"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                        {item.priceUnit}
                      </span>
                    </td>

                    {/* คอลัมน์ 6: ปุ่ม Action ดูข้อมูล / จอง */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => handleNavigate(e, item.link)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                        title="ดูรายละเอียดและขั้นตอนการจอง"
                      >
                        <span>จอง / ดูข้อมูล</span>
                        <span>↗</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <div className="space-y-2">
                    <span className="text-3xl block">🔍</span>
                    <p className="text-xs font-semibold text-slate-600">
                      ไม่พบบริการที่ตรงกับเงื่อนไขการค้นหา
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ลองเปลี่ยนคำค้นหา หรือเลือกดูบริการในจังหวัดอื่น
                    </p>
                    {targetSlug && (
                      <button
                        type="button"
                        onClick={() => {
                          setTableSearch("");
                          setServiceFilter("all");
                          if (onSelectProvince) onSelectProvince("");
                        }}
                        className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        แสดงบริการทั่วประเทศ
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
