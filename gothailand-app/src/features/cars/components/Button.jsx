/**
 * Reusable Button component (Default Tailwind)
 * สไตล์เริ่มต้น เรียบง่าย คลีน อ่านง่าย รองรับการปรับ CSS กลางภายหลัง
 */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseStyle =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold shadow-xs',
    outline: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
