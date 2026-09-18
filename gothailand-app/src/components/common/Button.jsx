/**
 * Button.jsx
 * -------------------------------------------------------------
 * Shared Component: ปุ่มกดมาตรฐานส่วนกลางของโปรเจกต์
 */

export default function Button({
  children,
  variant = "primary", // primary | secondary | outline | danger
  size = "md", // sm | md | lg
  type = "button",
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  // สไตล์พื้นฐานที่ทุกปุ่มต้องมี
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  // ชุดสีและสไตล์ตามประเภท (Variants)
  const variants = {
    primary: "bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-xs",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800",
    outline:
      "border border-slate-300 hover:bg-slate-100 text-slate-700 bg-transparent",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-xs",
  };

  // ขนาดของปุ่ม (Sizes)
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };

  const selectedVariant = variants[variant] || variants.primary;
  const selectedSize = sizes[size] || sizes.md;

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
