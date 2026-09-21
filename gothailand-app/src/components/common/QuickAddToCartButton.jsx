import Button from "./Button";

/**
 * QuickAddToCartButton
 * -------------------------------------------------------------
 * Shared Component: ปุ่มไอคอนตะกร้าสำหรับเพิ่มสินค้าลงตะกร้าทันที (Quick Add to Cart)
 * สำหรับใช้งานบนการ์ดรายการบริการ (GuideCard, CarCard, AccommodationCard)
 * - แสดงเฉพาะไอคอน 🛒 พอดีกับพื้นหลังแบบทรงจัตุรัส (Square Icon Button)
 * - รองรับขนาด size: 'sm' (32x32px), 'md' (38x38px), 'lg' (44x44px)
 * - รองรับ Variant เดียวกับ Button (default: 'primary' สี amber-400)
 */
export default function QuickAddToCartButton({
  onClick,
  size = "sm",
  variant = "primary",
  title = "เพิ่มลงตะกร้า",
  className = "",
  disabled = false,
  ...props
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-[38px] h-[38px] text-sm",
    lg: "w-11 h-11 text-base",
  };

  const selectedSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <Button
      type="button"
      variant={variant}
      size="none"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center shrink-0 rounded-xl transition-all duration-150 active:scale-95 shadow-2xs hover:shadow-xs cursor-pointer ${selectedSize} ${className}`.trim()}
      {...props}
    >
      <span className="leading-none text-center select-none" aria-hidden="true">
        🛒
      </span>
    </Button>
  );
}
