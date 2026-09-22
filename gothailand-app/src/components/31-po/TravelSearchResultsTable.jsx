import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { matchProvince, matchCarProvince } from "../../services/yokService";
import { useAuth } from "../../context/AuthContext";
import { useItemVisibility } from "../../context/ItemVisibilityContext";
import ItemVisibilityBadge from "../common/ItemVisibilityBadge";

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
  const { isAdmin } = useAuth();
  const { isItemVisible, adminCustomerPreview, toggleCustomerPreview } =
    useItemVisibility();

  // ตัวกรองภายในตาราง
  const [tableSearch, setTableSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all"); // 'all' | 'accommodations' | 'cars' | 'guides'
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended' | 'price-asc' | 'price-desc' | 'name'
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // 'all' | 'visible' | 'hidden'

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

      const candidateIds = [acc.id, acc._id, acc.slug].filter(Boolean);
      items.push({
        id: acc._id || acc.id || acc.slug,
        candidateIds,
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
        candidateIds,
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
      const candidateIds = [guide.id, guide._id, guide.slug].filter(Boolean);

      const langs = Array.isArray(guide.languages)
        ? guide.languages.join(", ")
        : guide.language || "ไทย";

      items.push({
        id: guide._id || guide.id || guide.slug,
        candidateIds,
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

    // 8. กรองตามการควบคุมการแสดงผลของ Admin (Item Visibility / รูปตา 👁️)
    if (!isAdmin || adminCustomerPreview) {
      // โหมดลูกค้า: ซ่อนรายการที่ Admin ปิดไว้เสมอ
      result = result.filter((item) =>
        isItemVisible(item.serviceType, item.id, item.candidateIds),
      );
    } else {
      // โหมด Admin: กรองตามแท็บสถานะที่เลือก
      if (visibilityFilter === "visible") {
        result = result.filter((item) =>
          isItemVisible(item.serviceType, item.id, item.candidateIds),
        );
      } else if (visibilityFilter === "hidden") {
        result = result.filter(
          (item) =>
            !isItemVisible(item.serviceType, item.id, item.candidateIds),
        );
      }
    }

    return result;
  }, [
    allUnifiedItems,
    searchQuery,
    targetSlug,
    serviceFilter,
    tableSearch,
    sortBy,
    isAdmin,
    adminCustomerPreview,
    visibilityFilter,
    isItemVisible,
  ]);

  // สรุปจำนวนการแสดงผล (สำหรับ Admin)
  const visibilityStats = useMemo(() => {
    let visible = 0;
    let hidden = 0;
    allUnifiedItems.forEach((item) => {
      if (isItemVisible(item.serviceType, item.id, item.candidateIds)) {
        visible += 1;
      } else {
        hidden += 1;
      }
    });
    return { visible, hidden, total: allUnifiedItems.length };
  }, [allUnifiedItems, isItemVisible]);

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
    <section className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5 font-sans">
      {/* แผงควบคุมพิเศษสำหรับ Admin (Admin Visibility Control Console) */}
      {isAdmin && (
        <div className="bg-[#0a192f] text-slate-100 rounded-2xl p-4 sm:p-5 shadow-xs border border-amber-400/30 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-base shadow-xs shrink-0">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                    <span>
                      แผงควบคุมการแสดงผลข้อมูล (Admin Visibility Console)
                    </span>
                  </h4>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md font-bold">
                    สิทธิ์ Admin
                  </span>
                  {adminCustomerPreview && (
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/40 px-2 py-0.5 rounded-md font-bold animate-pulse">
                      จำลองมุมมองลูกค้า (Customer Preview)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  คลิกที่ปุ่มรูปตา (👁️ เปิดแสดง / 🙈 ซ่อนอยู่) ในแต่ละแถว
                  เพื่อกำหนดการแสดงผลบริการต่อลูกค้า
                </p>
              </div>
            </div>

            {/* สวิตช์สลับโหมดมุมมอง */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={toggleCustomerPreview}
                className={`w-full sm:w-auto justify-center px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                  adminCustomerPreview
                    ? "bg-sky-400 hover:bg-sky-300 text-slate-950 border-sky-400 font-extrabold"
                    : "bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-400 font-extrabold"
                }`}
              >
                <span>
                  {adminCustomerPreview
                    ? "👥 กลับสู่โหมดผู้ดูแล"
                    : "👁️ ดูตัวอย่างมุมมองลูกค้า"}
                </span>
              </button>
            </div>
          </div>

          {/* สถิติการแสดงผล & แท็บกรองสถานะ */}
          {!adminCustomerPreview && (
            <div className="pt-2.5 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-slate-400 text-xs font-medium">
                  กรองตามสถานะ:
                </span>
                <div className="grid grid-cols-3 sm:inline-flex bg-slate-950/70 p-1 rounded-xl border border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => setVisibilityFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                      visibilityFilter === "all"
                        ? "bg-white text-slate-950 shadow-2xs font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ทั้งหมด ({visibilityStats.total})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibilityFilter("visible")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      visibilityFilter === "visible"
                        ? "bg-emerald-500 text-white shadow-2xs font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>👁️ แสดง ({visibilityStats.visible})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibilityFilter("hidden")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      visibilityFilter === "hidden"
                        ? "bg-rose-500 text-white shadow-2xs font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>🙈 ซ่อน ({visibilityStats.hidden})</span>
                  </button>
                </div>
              </div>

              {visibilityStats.hidden > 0 && (
                <span className="text-[11px] text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 inline-flex items-center gap-1">
                  <span>
                    ⚠️ มีบริการถูกซ่อนอยู่ {visibilityStats.hidden} รายการ
                    (ลูกค้าจะไม่เห็นในระบบ)
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 1. Header & Controls (สไตล์คล้าย ProvinceTable.jsx) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
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

        {/* ช่องค้นหา & ตัวกรองเรียงลำดับ (Responsive บนมือถือ) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            placeholder="ค้นหาชื่อบริการ, จุดเด่น..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a192f] focus:bg-white transition-all w-full sm:w-56"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0a192f] cursor-pointer"
          >
            <option value="recommended">เรียง: แนะนำ</option>
            <option value="price-asc">ราคา: ต่ำ ➜ สูง</option>
            <option value="price-desc">ราคา: สูง ➜ ต่ำ</option>
            <option value="name">ชื่อ ก-ฮ</option>
          </select>
        </div>
      </div>

      {/* 2. แท็บกรองประเภทบริการ (Pill Tabs) */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setServiceFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
            serviceFilter === "all"
              ? "bg-[#0a192f] text-amber-400 border-[#0a192f] shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80"
          }`}
        >
          ทั้งหมด ({filteredItems.length})
        </button>

        <button
          type="button"
          onClick={() => setServiceFilter("accommodations")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
            serviceFilter === "accommodations"
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-blue-50/80 text-blue-700 hover:bg-blue-100 border-blue-200/80"
          }`}
        >
          <span>🏨 ที่พัก ({countStats.accommodations})</span>
        </button>

        <button
          type="button"
          onClick={() => setServiceFilter("cars")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
            serviceFilter === "cars"
              ? "bg-amber-400 text-slate-950 border-amber-400 shadow-xs font-extrabold"
              : "bg-amber-50/80 text-amber-800 hover:bg-amber-100 border-amber-200/80"
          }`}
        >
          <span>🚗 รถเช่า ({countStats.cars})</span>
        </button>

        <button
          type="button"
          onClick={() => setServiceFilter("guides")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
            serviceFilter === "guides"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 border-emerald-200/80"
          }`}
        >
          <span>🧭 ไกด์นำเที่ยว ({countStats.guides})</span>
        </button>

        {tableSearch && (
          <button
            type="button"
            onClick={() => setTableSearch("")}
            className="text-xs text-slate-400 hover:text-slate-700 ml-auto cursor-pointer font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕ ล้างคำค้นหา
          </button>
        )}
      </div>

      {/* 3. รายการผลลัพธ์การค้นหา: รองรับ Responsive ทั้ง Mobile Card View และ Desktop Table */}

      {/* 3.1 มุมมองบนหน้าจอมือถือ (Mobile Cards View: แสดงเฉพาะจอเล็ก < 640px) */}
      <div className="block sm:hidden space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isCurrentProvince =
              item.provinceSlug && item.provinceSlug === selectedSlug;
            const isVisible = isItemVisible(
              item.serviceType,
              item.id,
              item.candidateIds,
            );
            const isHiddenByAdmin = !isVisible;

            return (
              <div
                key={`mobile-${item.serviceType}-${item.id}`}
                onClick={() => handleRowClick(item)}
                className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3 transition-all ${
                  isCurrentProvince
                    ? "border-blue-400 bg-blue-50/40 ring-1 ring-blue-400"
                    : isHiddenByAdmin
                      ? "border-rose-300 bg-rose-50/30 opacity-80"
                      : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* Header: ป้ายบริการ & ราคา */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border shadow-2xs ${
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

                  <div className="text-right">
                    <span className="font-black text-emerald-600 font-mono text-sm">
                      ฿{item.price ? item.price.toLocaleString() : "ตามตกลง"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                      {item.priceUnit}
                    </span>
                  </div>
                </div>

                {/* ชื่อ & รายละเอียดบริการ */}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                    <span
                      className={
                        isHiddenByAdmin ? "line-through text-slate-500" : ""
                      }
                    >
                      {item.name}
                    </span>
                    {isHiddenByAdmin && (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 text-[10px] rounded-md font-bold shrink-0">
                        🙈 ซ่อนอยู่
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.subTitle}
                  </p>
                </div>

                {/* จุดหมาย & ไฮไลท์ */}
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                  <span className="text-slate-400">📍</span>
                  <span>{item.provinceNameTh}</span>
                  {item.provinceNameEn && (
                    <span className="text-[10px] text-slate-400 font-mono font-normal">
                      ({item.provinceNameEn})
                    </span>
                  )}
                </div>

                {item.highlight && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {item.highlight}
                  </p>
                )}

                {/* ควบคุมการเปิด/ปิดแสดงผลสำหรับ Admin บนมือถือ */}
                {isAdmin && !adminCustomerPreview && (
                  <div className="pt-1">
                    <ItemVisibilityBadge
                      serviceType={item.serviceType}
                      itemId={item.id}
                      fallbackIds={item.candidateIds}
                      variant="mobile-card"
                    />
                  </div>
                )}

                {/* ปุ่มดูรายละเอียด & จอง */}
                <button
                  type="button"
                  onClick={(e) => handleNavigate(e, item.link)}
                  className="w-full py-2.5 px-4 bg-[#0a192f] hover:bg-amber-400 hover:text-slate-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>จอง / ดูข้อมูลรายละเอียด</span>
                  <span>↗</span>
                </button>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <span className="text-3xl block">🔍</span>
            <p className="text-xs font-semibold text-slate-700">
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
                className="mt-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer border border-slate-200 transition-colors shadow-2xs"
              >
                แสดงบริการทั่วประเทศ
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3.2 มุมมองบนแท็บเล็ตและจอคอม (Desktop / Tablet Table View: ซ่อนบนจอเล็ก < 640px) */}
      <div className="hidden sm:block overflow-x-auto border border-slate-200/80 rounded-2xl max-h-[32rem] overflow-y-auto shadow-2xs">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className="bg-slate-50/95 backdrop-blur-xs text-slate-700 sticky top-0 border-b border-slate-200/80 font-bold tracking-wide z-10">
            <tr>
              <th className="py-3 px-3.5 whitespace-nowrap">บริการ</th>
              <th className="py-3 px-3.5 min-w-[200px]">ชื่อบริการ / รายการ</th>
              <th className="py-3 px-3.5 whitespace-nowrap">
                จังหวัด / พื้นที่
              </th>
              <th className="py-3 px-3.5 min-w-[180px]">รายละเอียด & ไฮไลท์</th>
              <th className="py-3 px-3.5 text-right whitespace-nowrap">
                ราคาเริ่มต้น
              </th>
              {isAdmin && !adminCustomerPreview && (
                <th className="py-3 px-3.5 text-center whitespace-nowrap bg-amber-50/70 text-amber-900 border-x border-amber-200/80">
                  <span className="flex items-center justify-center gap-1.5">
                    <span>👁️</span>
                    <span>แสดงผลลูกค้า (Admin)</span>
                  </span>
                </th>
              )}
              <th className="py-3 px-3.5 text-center whitespace-nowrap">
                ดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isCurrentProvince =
                  item.provinceSlug && item.provinceSlug === selectedSlug;
                const isVisible = isItemVisible(
                  item.serviceType,
                  item.id,
                  item.candidateIds,
                );
                const isHiddenByAdmin = !isVisible;

                return (
                  <tr
                    key={`${item.serviceType}-${item.id}`}
                    onClick={() => handleRowClick(item)}
                    className={`cursor-pointer transition-colors ${
                      isCurrentProvince
                        ? "bg-blue-50/60 font-medium text-slate-900"
                        : isHiddenByAdmin
                          ? "bg-rose-50/40 text-slate-500 opacity-80 hover:bg-rose-50/70 border-l-4 border-l-rose-500"
                          : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* คอลัมน์ 1: ประเภทบริการ */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border shadow-2xs ${
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
                    <td className="py-3 px-3.5">
                      <div
                        className="font-bold text-slate-800 truncate max-w-xs flex items-center gap-1.5"
                        title={item.name}
                      >
                        <span
                          className={
                            isHiddenByAdmin ? "line-through text-slate-500" : ""
                          }
                        >
                          {item.name}
                        </span>
                        {isHiddenByAdmin && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 text-[10px] rounded-md font-bold shrink-0">
                            🙈 ซ่อนอยู่
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                        {item.subTitle}
                      </div>
                    </td>

                    {/* คอลัมน์ 3: จังหวัด / พื้นที่ */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <span className="text-slate-400">📍</span>
                        <span>{item.provinceNameTh}</span>
                      </div>
                      {item.provinceNameEn && (
                        <div className="text-[10px] text-slate-400 font-mono ml-5">
                          {item.provinceNameEn}
                        </div>
                      )}
                    </td>

                    {/* คอลัมน์ 4: จุดเด่น */}
                    <td className="py-3 px-3.5">
                      <div
                        className="text-[11px] text-slate-600 line-clamp-2"
                        title={item.highlight}
                      >
                        {item.highlight}
                      </div>
                    </td>

                    {/* คอลัมน์ 5: ราคา */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <span className="font-black text-emerald-600 font-mono text-sm">
                        ฿{item.price ? item.price.toLocaleString() : "ตามตกลง"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                        {item.priceUnit}
                      </span>
                    </td>

                    {/* คอลัมน์พิเศษสำหรับ Admin: ควบคุมการแสดงผลรูปตา 👁️ */}
                    {isAdmin && !adminCustomerPreview && (
                      <td className="py-3 px-3.5 text-center whitespace-nowrap bg-amber-50/30 border-x border-slate-100">
                        <ItemVisibilityBadge
                          serviceType={item.serviceType}
                          itemId={item.id}
                          fallbackIds={item.candidateIds}
                          variant="table"
                        />
                      </td>
                    )}

                    {/* คอลัมน์ Action ดูข้อมูล / จอง */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => handleNavigate(e, item.link)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#0a192f] hover:bg-amber-400 hover:text-slate-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
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
                <td
                  colSpan={isAdmin && !adminCustomerPreview ? 7 : 6}
                  className="py-10 text-center text-slate-400"
                >
                  <div className="space-y-2">
                    <span className="text-3xl block">🔍</span>
                    <p className="text-xs font-semibold text-slate-700">
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
                        className="mt-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs"
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

      {/* ข้อความช่วยเหลือบนอุปกรณ์มือถือ & สถิติล่างตาราง */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-1.5 px-1 pt-0.5">
        <span className="hidden sm:inline-block text-slate-400">
          💡 คลิกที่แถวของบริการเพื่อซิงก์ตำแหน่งไปยังแผนที่ SVG ด้านบน
        </span>
        <span className="ml-auto font-mono text-slate-500">
          แสดงผล {filteredItems.length} รายการ
        </span>
      </div>
    </section>
  );
}
