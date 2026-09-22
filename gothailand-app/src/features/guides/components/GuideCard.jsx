import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { QuickAddToCartButton } from "../../../components/common";
import { useCart } from "../../../context/CartContext";

// รูปโปรไฟล์สำรอง กรณีรูปจริงโหลดไม่ได้หรือไม่มีข้อมูล
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80";

/**
 * GuideCard Component
 * -------------------------------------------------------------
 * พัฒนาต่อยอดจากคอมโพเนนต์ GuideCard ของ Meng:
 * - แสดงรูปภาพโปรไฟล์มัคคุเทศก์แนวตั้งพร้อม Badge ยืนยันตัวตน
 * - ชื่อ, ชื่อเล่น, จังหวัดประจำการ, เลขที่ใบอนุญาต
 * - ภาษาที่สื่อสารได้ (Language badges)
 * - คะแนนดาวรีวิว และอัตราค่าบริการรายวัน (Daily Fee)
 * - ปุ่ม "View Profile" เชื่อมต่อไปยังหน้ารายละเอียด GuideDetailPage
 */
export default function GuideCard({ guide, onViewDetail }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!guide) return null;

  const guideId = guide._id || guide.id;
  const photoUrl = guide.guide_photo || guide.image || DEFAULT_AVATAR;
  const rating = guide.rating_avg ?? guide.rating ?? 5.0;
  const reviewCount = guide.total_reviews ?? guide.reviews ?? 0;
  const fee = guide.daily_fee || guide.pricePerDay || 1500;
  const languages = Array.isArray(guide.language)
    ? guide.language
    : Array.isArray(guide.languages)
      ? guide.languages
      : ["Thai", "English"];

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail(guide);
    } else {
      navigate(`/guides/${guideId}`, { state: { guide } });
    }
  };

  const handleQuickAdd = (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    addToCart(
      {
        type: "guide",
        itemId: guideId,
        title: guide.name || "Certified Local Guide",
        subtitle: `${guide.province || "Thailand"} • ${languages.join(", ")}`,
        image: photoUrl,
        location: guide.province || "Thailand",
        unitPrice: fee,
        priceUnitLabel: "/ วัน",
        quantity: 1,
        dates: {
          startDate: "2026-10-15",
          durationDays: 1,
        },
        details: {
          duration: "Full Day (8 Hours)",
          languages,
          licenseNumber: guide.license_number,
        },
      },
      { openDrawer: true },
    );
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* ส่วนบน: รูปภาพโปรไฟล์ + ป้าย Badge */}
      <div className="relative w-full h-56 sm:h-64 bg-slate-100 overflow-hidden">
        <img
          src={photoUrl}
          alt={guide.name || "Tourist Guide"}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            if (e.currentTarget.src !== DEFAULT_AVATAR) {
              e.currentTarget.src = DEFAULT_AVATAR;
            }
          }}
        />

        {/* Gradient Overlay ด้านล่างรูปเพื่อให้อ่านชื่อชัดเจน */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* ป้ายด้านบน */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {guide.verified ? (
              <span className="inline-flex items-center gap-1 bg-[#0a192f]/90 backdrop-blur-xs text-amber-400 border border-amber-400/30 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                <span>✓</span>
                <span>Verified Guide</span>
              </span>
            ) : (
              <span className="bg-white/90 backdrop-blur-xs text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                Licensed Guide
              </span>
            )}

            {guide.province && (
              <span className="bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                📍 {guide.province}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Overlays บนรูป: ชื่อและชื่อเล่น */}
        <div className="absolute bottom-3 left-3 right-3 z-10 text-white pointer-events-none">
          <div className="flex items-baseline gap-1.5">
            <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm line-clamp-1">
              {guide.name}
            </h3>
            {guide.nickname && (
              <span className="text-xs text-amber-300 font-semibold drop-shadow-sm">
                ({guide.nickname})
              </span>
            )}
          </div>
          {guide.license_number && (
            <p className="text-[10px] text-slate-200/90 font-mono tracking-wider">
              License: {guide.license_number}
            </p>
          )}
        </div>
      </div>

      {/* ส่วนกลาง: รายละเอียด ความเชี่ยวชาญ และภาษา */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* เรตติ้งและรีวิว */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <span>★</span>
              <span>{Number(rating).toFixed(1)}</span>
              <span className="text-slate-400 font-normal">
                ({reviewCount} reviews)
              </span>
            </div>
            {guide.years_experience > 0 && (
              <span className="text-slate-500 font-medium text-[11px]">
                🏆 {guide.years_experience} Yrs Exp.
              </span>
            )}
          </div>

          {/* คำแนะนำตัวสั้นๆ */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-2.5 font-light leading-relaxed">
            {guide.description ||
              "มัคคุเทศก์มืออาชีพพร้อมพาคุณสัมผัสประสบการณ์ท่องเที่ยวไทยแบบเจาะลึก"}
          </p>

          {/* ภาษาที่สื่อสารได้ */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {languages.slice(0, 3).map((lang, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
              >
                🗣️ {lang}
              </span>
            ))}
            {languages.length > 3 && (
              <span className="text-[10px] text-slate-400 font-bold self-center">
                +{languages.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* ส่วนท้าย: ค่าบริการรายวันและปุ่มกดดูข้อมูล */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">
              Daily Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                ฿{Number(fee).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                / day
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              variant="outline"
              size="none"
              className="px-3 py-1.5 text-xs font-semibold cursor-pointer"
            >
              <span>โปรไฟล์</span>
            </Button>

            <QuickAddToCartButton
              onClick={handleQuickAdd}
              size="sm"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
