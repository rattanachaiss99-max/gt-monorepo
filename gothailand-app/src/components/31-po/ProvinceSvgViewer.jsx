import { useState } from "react";
import { matchProvince, matchCarProvince } from "../../services/yokService";
import {
  deleteProvince,
  getProvinceSvgUrl,
} from "../../features/provinces/services/provinceService";
import ProvinceEditModal from "./ProvinceEditModal";
import { useAuth } from "../../context/AuthContext";
import { useItemVisibility } from "../../context/ItemVisibilityContext";
import ItemVisibilityBadge from "../common/ItemVisibilityBadge";

export default function ProvinceSvgViewer({
  province,
  provinces = [],
  selectedSlug = "",
  onSelectProvince,
  onUpdateProvince,
  accommodations = [],
  guides = [],
  cars = [],
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);

  const { isAdmin } = useAuth();
  const { isItemVisible, adminCustomerPreview } = useItemVisibility();

  const handleTestDelete = async () => {
    if (!province?.slug) return;
    setIsDeleting(true);
    try {
      const res = await deleteProvince(province.slug);
      setDeleteResult(res);
    } catch (err) {
      setDeleteResult({
        status: err.status || 403,
        message: err.message || "เกิดข้อผิดพลาดในการทดสอบลบข้อมูล",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!province) return null;

  // กรองที่พัก รถเช่า และไกด์ของคุณ Yok ที่ตรงกับจังหวัดที่เลือก
  const localAccommodations = accommodations.filter((a) =>
    matchProvince(a.location, province),
  );
  const localCars = cars.filter((c) => matchCarProvince(c, province));
  const localGuides = guides.filter((g) => matchProvince(g.province, province));

  // กรองการแสดงผลตามสิทธิ์ Admin / Customer Preview
  const displayedAccommodations = localAccommodations.filter((acc) =>
    !isAdmin || adminCustomerPreview
      ? isItemVisible("accommodations", acc, [acc.id, acc._id, acc.slug])
      : true,
  );
  const displayedCars = localCars.filter((car) =>
    !isAdmin || adminCustomerPreview
      ? isItemVisible("cars", car, [car._id, car.slug, car.id])
      : true,
  );
  const displayedGuides = localGuides.filter((guide) =>
    !isAdmin || adminCustomerPreview
      ? isItemVisible("guides", guide, [guide._id, guide.slug, guide.id])
      : true,
  );

  // Fallbacks รองรับโครงสร้างข้อมูลทั้งจาก Po API และ Yok Backend
  const svgPath = province.d || province.vectorData?.d || "";
  const svgViewBox =
    province.viewBox || province.vectorData?.viewBox || "0 0 800 600";
  const pId =
    province.provinceId ||
    (province.code
      ? `TH-${province.code}`
      : province.id
        ? `TH-${province.id}`
        : "-");
  const displayNameTh =
    province.nameTh || province.name_th || province.name || "";
  const displayNameEn =
    province.nameEn || province.name_en || province.slug || "";
  const pathLength = svgPath ? svgPath.length : 0;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* หัวข้อ & Dropdown */}
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

        {/* ฟิลด์ข้อมูลที่ดึงมาจาก MongoDB & Yok API */}
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

          {/* คำขวัญประจำจังหวัด */}
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
                  <span className="font-bold text-slate-700 flex items-center gap-1 text-xs">
                    🏨 ที่พักในพื้นที่ (Yok API)
                  </span>
                  <span className="font-semibold text-blue-600 font-mono text-xs">
                    {displayedAccommodations.length} แห่ง
                  </span>
                </div>
                {displayedAccommodations.length > 0 ? (
                  <ul className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
                    {displayedAccommodations.map((acc) => {
                      const isVisible = isItemVisible("accommodations", acc, [
                        acc.id,
                        acc._id,
                        acc.slug,
                      ]);
                      return (
                        <li
                          key={acc._id || acc.id || acc.slug}
                          className={`flex items-center justify-between text-[11px] px-2 py-1 rounded border transition-all ${
                            !isVisible
                              ? "bg-rose-50/50 text-slate-400 border-rose-200"
                              : "bg-white text-slate-600 border-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-1 truncate max-w-[130px]">
                            <span
                              className={
                                !isVisible
                                  ? "line-through text-slate-400 truncate"
                                  : "truncate"
                              }
                              title={acc.name}
                            >
                              {acc.name}
                            </span>
                            {!isVisible && (
                              <span className="text-[9px] bg-rose-100 text-rose-700 px-1 rounded font-bold shrink-0">
                                🙈
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <span className="font-medium text-emerald-600 font-mono whitespace-nowrap text-[10px]">
                              ฿
                              {(
                                acc.price ??
                                acc.base_price_per_night ??
                                acc.basePrice
                              )?.toLocaleString()}
                            </span>
                            {isAdmin && !adminCustomerPreview && (
                              <ItemVisibilityBadge
                                serviceType="accommodations"
                                item={acc}
                                itemId={acc._id || acc.id}
                                fallbackIds={[acc.id, acc._id, acc.slug]}
                                variant="mini"
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
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
                  <span className="font-bold text-slate-700 flex items-center gap-1 text-xs">
                    🚗 รถเช่าในพื้นที่ (Yok API)
                  </span>
                  <span className="font-semibold text-blue-600 font-mono text-xs">
                    {displayedCars.length} คัน
                  </span>
                </div>
                {displayedCars.length > 0 ? (
                  <ul className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
                    {displayedCars.map((car) => {
                      const isVisible = isItemVisible("cars", car, [
                        car._id,
                        car.slug,
                        car.id,
                      ]);
                      return (
                        <li
                          key={car._id || car.slug || car.id}
                          className={`flex items-center justify-between text-[11px] px-2 py-1 rounded border transition-all ${
                            !isVisible
                              ? "bg-rose-50/50 text-slate-400 border-rose-200"
                              : "bg-white text-slate-600 border-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-1 truncate max-w-[130px]">
                            <span
                              className={
                                !isVisible
                                  ? "line-through text-slate-400 truncate"
                                  : "truncate"
                              }
                              title={car.name}
                            >
                              {car.name}
                            </span>
                            {!isVisible && (
                              <span className="text-[9px] bg-rose-100 text-rose-700 px-1 rounded font-bold shrink-0">
                                🙈
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <span className="font-medium text-emerald-600 font-mono whitespace-nowrap text-[10px]">
                              ฿
                              {(car.pricePerDay ?? car.price)?.toLocaleString()}
                            </span>
                            {isAdmin && !adminCustomerPreview && (
                              <ItemVisibilityBadge
                                serviceType="cars"
                                item={car}
                                itemId={car._id || car.id || car.slug}
                                fallbackIds={[car._id, car.slug, car.id]}
                                variant="mini"
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
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
                  <span className="font-bold text-slate-700 flex items-center gap-1 text-xs">
                    🧭 ไกด์นำเที่ยว (Yok API)
                  </span>
                  <span className="font-semibold text-blue-600 font-mono text-xs">
                    {displayedGuides.length} คน
                  </span>
                </div>
                {displayedGuides.length > 0 ? (
                  <ul className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
                    {displayedGuides.map((g) => {
                      const isVisible = isItemVisible("guides", g, [
                        g._id,
                        g.slug,
                        g.id,
                      ]);
                      return (
                        <li
                          key={g._id || g.slug || g.id}
                          className={`flex items-center justify-between text-[11px] px-2 py-1 rounded border transition-all ${
                            !isVisible
                              ? "bg-rose-50/50 text-slate-400 border-rose-200"
                              : "bg-white text-slate-600 border-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-1 truncate max-w-[130px]">
                            <span
                              className={
                                !isVisible
                                  ? "line-through text-slate-400 truncate"
                                  : "truncate"
                              }
                              title={g.name}
                            >
                              {g.name}
                            </span>
                            {!isVisible && (
                              <span className="text-[9px] bg-rose-100 text-rose-700 px-1 rounded font-bold shrink-0">
                                🙈
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <span className="font-medium text-emerald-600 font-mono whitespace-nowrap text-[10px]">
                              ฿{g.price?.toLocaleString()}
                            </span>
                            {isAdmin && !adminCustomerPreview && (
                              <ItemVisibilityBadge
                                serviceType="guides"
                                item={g}
                                itemId={g._id || g.id || g.slug}
                                fallbackIds={[g._id, g.slug, g.id]}
                                variant="mini"
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    ยังไม่มีไกด์ในระบบของจังหวัดนี้
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ตัวอย่าง SVG Path ดิบ & RESTful Action Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 block">
                ตัวอย่าง SVG Path Snippet (จาก MongoDB):
              </span>
              <a
                href={getProvinceSvgUrl(province.slug)}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                title="เปิดดูรูปภาพ SVG แบบ Raw Image Stream จาก Backend (:slug/svg)"
              >
                🖼️ ดูรูป SVG ตรง (:slug/svg) ↗
              </a>
            </div>
            <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap line-clamp-2">
              {svgPath?.slice(0, 120)}...
            </pre>
          </div>

          {/* แผงควบคุมทดสอบ RESTful Methods (Sprint 3 Toolbar) */}
          <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">
                🛠️ RESTful Methods (Sprint 3):
              </span>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                /api/provinces/{province.slug}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                ✏️ แก้ไขข้อมูล (PATCH / PUT)
              </button>

              <button
                type="button"
                onClick={handleTestDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="ทดสอบส่ง HTTP DELETE เพื่อตรวจสอบระบบ Master Data Protection"
              >
                {isDeleting ? "⏳ กำลังทดสอบ..." : "🛡️ ทดสอบการลบ (DELETE Guard)"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal จัดการข้อมูล (PATCH/PUT) */}
      <ProvinceEditModal
        isOpen={isEditOpen}
        province={province}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => {
          onUpdateProvince?.(updated);
        }}
      />

      {/* Dialog ผลการทดสอบ DELETE Guard */}
      {deleteResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
                🛡️
              </span>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  ผลการทดสอบ HTTP DELETE Method
                </h4>
                <p className="text-[11px] text-slate-500">
                  ระบบ Master Data Protection ทำงานตามข้อกำหนด
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center justify-between">
                <span>สถานะ HTTP ตอบกลับ:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-rose-600">
                  HTTP {deleteResult.status || 403} Forbidden
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {deleteResult.message || "Backend ปฏิเสธการลบข้อมูลหลัก 77 จังหวัดสำเร็จ"}
              </p>
              {deleteResult.notice && (
                <p className="text-[10px] text-amber-700 italic border-t border-amber-200/60 pt-1.5">
                  💡 {deleteResult.notice}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDeleteResult(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
