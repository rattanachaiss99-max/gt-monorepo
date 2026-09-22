import { useAuth } from "../../context/AuthContext";
import { useItemVisibility } from "../../context/ItemVisibilityContext";

/**
 * ItemVisibilityBadge Component (Standardized Tailwind & Responsive Design)
 * -------------------------------------------------------------
 * ปุ่มควบคุมการเปิด/ปิดการแสดงผลสำหรับ Admin (รูปตา 👁️ / 🙈)
 * ออกแบบตาม Yok Design Pattern เพื่อความสม่ำเสมอในทุกหน้า:
 * - variant="card": แสดงเป็น Floating Badge มุมบนซ้ายของการ์ด
 * - variant="table": แสดงเป็นปุ่มขนาดกะทัดรัดในตารางผลลัพธ์
 * - variant="mobile-card": แสดงในรายการการ์ดบนมือถือ
 * -------------------------------------------------------------
 */
export default function ItemVisibilityBadge({
  serviceType,
  itemId,
  fallbackIds = [],
  item = null,
  variant = "card",
  position = "right", // 'right' | 'left' (สำหรับ variant="card")
  className = "",
}) {
  const { isAdmin } = useAuth();
  const { isItemVisible, toggleItemVisibility, adminCustomerPreview } =
    useItemVisibility();

  // หากไม่ใช่ Admin หรืออยู่ในโหมดจำลองมุมมองลูกค้า จะไม่แสดงปุ่ม
  if (!isAdmin || adminCustomerPreview) {
    return null;
  }

  const effectiveItemOrId = item || itemId;
  const effectiveFallbacks = item
    ? [
        item.id,
        item._id,
        item.slug,
        ...(Array.isArray(fallbackIds) ? fallbackIds : [fallbackIds]),
      ].filter(Boolean)
    : fallbackIds;

  const isVisible = isItemVisible(
    serviceType,
    effectiveItemOrId,
    effectiveFallbacks,
  );

  const handleClick = (e) => {
    e.stopPropagation();
    toggleItemVisibility(serviceType, effectiveItemOrId, effectiveFallbacks);
  };

  if (variant === "mini") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
          isVisible
            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
            : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
        } ${className}`}
        title={
          isVisible
            ? "คลิกรูปตาเพื่อซ่อนบริการนี้จากลูกค้า"
            : "คลิกรูปตาเพื่อเปิดแสดงบริการนี้ต่อลูกค้า"
        }
      >
        <span>{isVisible ? "👁️" : "🙈"}</span>
        <span>{isVisible ? "แสดง" : "ซ่อน"}</span>
      </button>
    );
  }

  if (variant === "table") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
          isVisible
            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
            : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300"
        } ${className}`}
        title={
          isVisible
            ? "คลิกรูปตาเพื่อปิดการแสดงผลบริการนี้สำหรับลูกค้า"
            : "คลิกรูปตาเพื่อเปิดแสดงผลบริการนี้สำหรับลูกค้า"
        }
      >
        <span className="text-sm">{isVisible ? "👁️" : "🙈"}</span>
        <span>{isVisible ? "เปิดแสดง" : "ซ่อนอยู่"}</span>
      </button>
    );
  }

  if (variant === "mobile-card") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
          isVisible
            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
            : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300"
        } ${className}`}
        title={
          isVisible
            ? "คลิกเพื่อซ่อนบริการนี้จากลูกค้า"
            : "คลิกเพื่อเปิดแสดงบริการนี้ต่อลูกค้า"
        }
      >
        <span className="flex items-center gap-1.5">
          <span>{isVisible ? "👁️" : "🙈"}</span>
          <span>สถานะการแสดงผล:</span>
        </span>
        <span className="underline font-extrabold">
          {isVisible ? "เปิดแสดงให้ลูกค้าเห็น" : "ซ่อนจากลูกค้า"}
        </span>
      </button>
    );
  }

  // ค่าปริยาย: variant="card" (Badge การ์ดบริการ ย้ายไปอยู่ฝั่งขวาบน top-3.5 right-3.5 เป็นค่าเริ่มต้น)
  const positionClasses =
    position === "left" ? "top-3.5 left-3.5" : "top-3.5 right-3.5";

  return (
    <div className={`absolute ${positionClasses} z-20 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all border backdrop-blur-md ${
          isVisible
            ? "bg-emerald-600/90 hover:bg-emerald-700 text-white border-emerald-400/80 shadow-emerald-900/20"
            : "bg-rose-600/95 hover:bg-rose-700 text-white border-rose-400/80 shadow-rose-900/20"
        }`}
        title={
          isVisible
            ? "คลิกรูปตาเพื่อซ่อนรายการนี้จากลูกค้า"
            : "คลิกรูปตาเพื่อเปิดแสดงรายการนี้ต่อลูกค้า"
        }
      >
        <span className="text-xs">{isVisible ? "👁️" : "🙈"}</span>
        <span>{isVisible ? "แสดงต่อลูกค้า" : "ซ่อนจากลูกค้า"}</span>
      </button>
    </div>
  );
}
