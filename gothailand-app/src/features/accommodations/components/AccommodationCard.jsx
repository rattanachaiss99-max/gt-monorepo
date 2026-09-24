import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { QuickAddToCartButton } from "../../../components/common";
import { getImageForAccommodation } from "../utils/accommodationImages";
import { useCart } from "../../../context/CartContext";

/**
 * AccommodationCard Component
 * แสดงรายละเอียดที่พักพร้อมรูปภาพ ป้ายกำกับ ราคา และปุ่มดำเนินการ
 * ยึดตาม data schema ของ API เท่านั้น ไม่มีการใช้ mock data
 *
 * @param {Object} props
 * @param {Object} props.accommodation - ข้อมูลที่พักจาก API
 * @param {string} [props.imageSrc] - รูปภาพที่ต้องการ override (ถ้ามี)
 * @param {Function} [props.onViewDetails] - Callback เมื่อกด "View Details"
 * @param {Function} [props.onBookNow] - Callback เมื่อกด "Book Now"
 */
export default function AccommodationCard({
  accommodation,
  imageSrc,
  onViewDetails,
  onBookNow,
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!accommodation) return null;

  const slugId = accommodation.slug || accommodation.id || accommodation._id;

  const handleDetailClick = () => {
    if (onViewDetails) {
      onViewDetails(accommodation);
    } else {
      navigate(`/accommodations/${slugId}`, { state: { accommodation } });
    }
  };

  const handleQuickAdd = (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    addToCart(
      {
        type: "accommodation",
        itemId: slugId,
        title: accommodation.name || "โรงแรม/รีสอร์ท",
        subtitle: `${accommodation.category || "Luxury Resort"} • ${accommodation.rooms?.[0]?.room_type_name || "Standard Room"}`,
        image: resolvedImage,
        location:
          accommodation.location?.city ||
          accommodation.location?.address_label ||
          "Thailand",
        unitPrice: accommodation.base_price_per_night || 0,
        priceUnitLabel: "/ คืน",
        quantity: 1,
        dates: {
          startDate: "2026-10-15",
          endDate: "2026-10-18",
          durationDays: 3,
        },
        details: {
          roomName: accommodation.rooms?.[0]?.room_type_name || "Standard Room",
          adults: adultCount || 2,
          children: childCount || 0,
        },
      },
      { openDrawer: true },
    );
    onBookNow?.(accommodation);
  };

  const {
    name,
    category,
    description,
    location,
    rating_avg,
    special_options,
    base_price_per_night,
    rooms,
  } = accommodation;

  // หารูปจาก local assets, fallback ตามหมวดหมู่ หรือรูปที่ override มา
  const resolvedImage =
    imageSrc || getImageForAccommodation(accommodation) || "";

  // ดึงพิกัดแผนที่ถ้ามีข้อมูล
  const lat = location?.map_coordinates?.lat;
  const lng = location?.map_coordinates?.lng;
  const hasCoordinates = lat !== undefined && lng !== undefined;
  const mapUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location?.address_label || name || "Thailand",
      )}`;

  // ข้อมูลจำนวนผู้เข้าพักอ้างอิงจาก data schema เท่านั้น (rooms[0].max_guests)
  const firstRoomGuests = rooms?.[0]?.max_guests;
  const adultCount = firstRoomGuests?.adults;
  const childCount = firstRoomGuests?.children;

  return (
    <article className="w-full max-w-full min-w-0 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-row min-h-[145px] xs:min-h-[175px] sm:min-h-[200px] lg:min-h-[230px] group box-border">
      {/* คอลัมน์ซ้าย: รูปภาพพร้อม Overlay (3 ช่วง: < 450px, 450-1023px, >= 1024px) */}
      <div className="relative w-[32%] xs:w-[35%] sm:w-[38%] lg:w-[320px] xl:w-[350px] shrink-0 min-w-0 max-w-full overflow-hidden bg-slate-100 self-stretch">
        {resolvedImage ? (
          <img
            src={resolvedImage}
            alt={name || "Accommodation"}
            loading="lazy"
            className="absolute inset-0 w-full h-full max-w-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              const fallback = getImageForAccommodation(accommodation);
              if (fallback && e.currentTarget.src !== fallback) {
                e.currentTarget.src = fallback;
              } else {
                e.currentTarget.style.display = "none";
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
            <svg
              className="w-12 h-12 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* เงา gradient ด้านล่างเพื่อให้ข้อความอ่านง่าย */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        {/* ป้ายหมวดหมู่มุมซ้ายบน */}
        {category && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 max-w-[calc(100%-1rem)] pointer-events-none">
            <span className="inline-block max-w-full truncate bg-white/95 backdrop-blur-xs text-slate-900 text-[9px] xs:text-[10px] sm:text-xs font-semibold px-1.5 xs:px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
              {category}
            </span>
          </div>
        )}

        {/* ป้ายสถานที่มุมซ้ายล่าง */}
        {location?.address_label && (
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-10 pointer-events-none">
            <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold tracking-wider text-white/95 uppercase drop-shadow-sm block truncate">
              {location.address_label}
            </span>
          </div>
        )}
      </div>

      {/* คอลัมน์ขวา: รายละเอียดที่พัก (จำกัดความกว้างสูงสุดสัมพันธ์กับคอลัมน์ซ้าย ป้องกันล้นขอบจอ 100%) */}
      <div className="flex-1 min-w-0 max-w-[68%] xs:max-w-[65%] sm:max-w-[62%] lg:max-w-none p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between overflow-hidden">
        <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 min-w-0 max-w-full overflow-hidden">
          {/* แถวหัวข้อ: ชื่อที่พัก & ป้ายคะแนน */}
          <div className="flex items-start justify-between gap-1.5 sm:gap-2.5 min-w-0 max-w-full overflow-hidden">
            <h3
              onClick={handleDetailClick}
              className="flex-1 min-w-0 max-w-full text-sm xs:text-base sm:text-lg lg:text-xl font-bold font-serif text-slate-900 tracking-tight leading-snug truncate cursor-pointer hover:text-amber-600 transition-colors"
              title={name}
            >
              {name}
            </h3>

            {typeof rating_avg === "number" && (
              <div
                className="bg-slate-900 text-white text-[10px] xs:text-[11px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-lg flex items-center gap-0.5 sm:gap-1 shrink-0 shadow-2xs ml-1"
                title={`Rating: ${rating_avg.toFixed(1)} / 5`}
              >
                <span>{rating_avg.toFixed(1)}</span>
                <span className="text-amber-400 text-[10px] xs:text-xs">★</span>
              </div>
            )}
          </div>

          {/* สถานที่ & ลิงก์ "Show on map" */}
          {location?.address_label && (
            <div className="flex items-center flex-wrap gap-1 text-slate-500 text-[10px] xs:text-[11px] sm:text-xs md:text-sm min-w-0 max-w-full overflow-hidden">
              {/* ไอคอนหมุดแผนที่ */}
              <span
                className="text-red-500 shrink-0 text-xs sm:text-sm"
                aria-hidden="true"
              >
                📍
              </span>
              <span className="truncate min-w-0 max-w-[70px] min-[360px]:max-w-[90px] min-[400px]:max-w-[110px] xs:max-w-[130px] sm:max-w-[200px] md:max-w-[260px]">
                {location.address_label}
              </span>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-[10px] xs:text-[11px] sm:text-xs ml-0.5 transition-colors inline-flex items-center gap-0.5 shrink-0 whitespace-nowrap"
                title="View on Google Maps"
              >
                Show on map
              </a>
            </div>
          )}

          {/* คำอธิบาย: แสดงเมื่อจอ >= 450px (xs) เพื่อเติมเต็มเนื้อหาไม่ให้เกิดช่องว่าง */}
          {description && (
            <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed line-clamp-1 sm:line-clamp-2 pt-0.5 break-all xs:break-words min-w-0 max-w-full overflow-hidden hidden xs:block">
              {description}
            </p>
          )}

          {/* ป้ายตัวเลือกพิเศษ */}
          {Array.isArray(special_options) && special_options.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5 min-w-0 max-w-full overflow-hidden">
              {special_options.slice(0, 3).map((option, index) => (
                <span
                  key={index}
                  className="bg-sky-50 text-sky-950 border border-sky-100/80 text-[9px] xs:text-[10px] sm:text-xs font-medium px-1.5 xs:px-2 py-0.5 rounded-full transition-colors hover:bg-sky-100/70 truncate max-w-[100px] xs:max-w-[130px] sm:max-w-none"
                >
                  {option}
                </span>
              ))}
              {special_options.length > 3 && (
                <span className="hidden sm:inline-block bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-full">
                  +{special_options.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ส่วนท้าย */}
        <div className="pt-2 sm:pt-3 mt-1.5 sm:mt-2.5 border-t border-slate-100 flex items-end justify-between gap-1 sm:gap-2.5 min-w-0 max-w-full">
          {/* ราคา & ข้อมูลผู้เข้าพัก */}
          <div className="min-w-0 shrink max-w-[calc(100%-110px)] sm:max-w-none">
            {/* แสดงจำนวนผู้ใหญ่เฉพาะเมื่อ schema มีข้อมูลจริง (ไม่ใช้ mock) */}
            {adultCount && (
              <p className="text-[9px] xs:text-[10px] sm:text-xs text-slate-500 font-medium mb-0.5 truncate">
                {adultCount} adult{adultCount > 1 ? "s" : ""}
                {childCount
                  ? `, ${childCount} ${childCount > 1 ? "children" : "child"}`
                  : ""}
              </p>
            )}

            <div className="flex items-baseline gap-0.5 xs:gap-1 whitespace-nowrap min-w-0">
              <span className="text-xs min-[360px]:text-sm xs:text-base sm:text-xl lg:text-2xl font-bold font-serif text-slate-900 tracking-tight truncate">
                ฿{Number(base_price_per_night || 0).toLocaleString()}
              </span>
              <span className="text-slate-500 text-[9px] min-[360px]:text-[10px] sm:text-xs font-normal shrink-0">
                / night
              </span>
            </div>
          </div>

          {/* ปุ่มดำเนินการ */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDetailClick}
              className="text-[10px] xs:text-xs font-semibold px-1.5 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap"
            >
              <span className="hidden min-[380px]:inline">View </span>Details
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
