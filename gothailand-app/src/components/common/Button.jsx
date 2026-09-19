/**
 * Button.jsx
 * -------------------------------------------------------------
 * Shared Component: ปุ่มกดมาตรฐานส่วนกลางของโปรเจกต์
 */

export default function Button({
  children,
  variant = "primary", // ค่าที่เป็นไปได้: primary | secondary | outline | danger | navy
  size = "md", // ค่าที่เป็นไปได้: sm | md | lg | none
  type = "button",
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  // สไตล์พื้นฐานที่ทุกปุ่มต้องมี (ไม่รวม font-weight/transition/padding
  // เพื่อไม่ให้ชนกับ className ที่ผู้ใช้ปุ่มแบบ size="none" กำหนดเอง)
  const baseStyle =
    "inline-flex items-center justify-center rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  // ชุดสีและสไตล์ตามประเภท (Variants)
  const variants = {
    primary: "bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-xs",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800",
    outline:
      "border border-slate-300 hover:bg-slate-100 text-slate-700 bg-transparent",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-xs",
    navy: "bg-[#0a192f] hover:bg-amber-400 hover:text-slate-900 text-white",
  };

  // ขนาดของปุ่ม (Sizes) — รวม font-weight/transition มาตรฐานไว้ในนี้แทน
  // "none" คือปุ่ม CTA แบบกำหนดเอง ให้ className ควบคุม padding/typography ทั้งหมด
  const sizes = {
    sm: "px-3 py-1.5 text-xs font-medium transition-all duration-150",
    md: "px-4 py-2 text-sm font-medium transition-all duration-150",
    lg: "px-6 py-2.5 text-base font-medium transition-all duration-150",
    none: "",
  };

  const selectedVariant = variants[variant] || variants.primary;
  const selectedSize = size in sizes ? sizes[size] : sizes.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${selectedSize} ${selectedVariant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
