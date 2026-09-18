export default function FormField({ label, id, children, className = "" }) {
  return <div className={className}><label htmlFor={id} className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</label>{children}</div>;
}

export const inputClassName = "w-full border-b border-gray-300 bg-transparent pb-2 text-sm focus:border-black focus:outline-none";