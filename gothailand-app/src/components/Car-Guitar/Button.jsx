export default function Button({ children, variant = "primary", type = "button", className = "", ...props }) {
  const variants = {
    primary: "bg-[#0A192F] text-white hover:bg-[#132742]",
    gold: "bg-[#F3CB68] text-gray-900 hover:bg-[#e4be5b]",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    link: "text-gray-700 hover:text-black",
  };

  return <button type={type} className={`transition ${variants[variant]} ${className}`} {...props}>{children}</button>;
}