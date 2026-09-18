export default function CheckoutSection({ title, icon, children, className = "" }) {
  return <section className={`rounded-lg border border-gray-100 bg-white p-8 shadow-sm ${className}`}><h2 className="mb-6 flex items-center gap-2.5 font-serif text-base font-bold text-gray-900"><span aria-hidden="true" className="text-lg">{icon}</span>{title}</h2>{children}</section>;
}