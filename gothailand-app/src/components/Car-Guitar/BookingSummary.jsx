import Button from "./Button";

export default function BookingSummary({ onConfirm, onBack }) {
  return <aside className="md:col-span-1 md:sticky md:top-24"><div className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="font-serif text-lg font-bold text-gray-900">Booking Summary</h2>
    <div className="flex items-center gap-4"><img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=240" alt="Toyota Fortuner" className="h-14 w-20 rounded object-cover" /><div><h3 className="text-sm font-semibold text-gray-900">Toyota Fortuner</h3><p className="text-[11px] text-gray-500">SUV · 7 Seats · Diesel</p><p className="mt-0.5 text-xs font-medium text-[#C69B59]">★ 4.9</p></div></div>
    <hr className="border-gray-100" /><div className="space-y-4 text-xs"><SummaryDetail label="PICK-UP & RETURN" value="Suvarnabhumi Airport (BKK), Bangkok" icon="⌖" /><SummaryDetail label="DATES" value="Oct 15, 10:00 AM - Oct 18, 10:00 AM (3 Days)" icon="◷" /></div>
    <hr className="border-gray-100" /><div className="space-y-2 text-xs"><PriceRow label="Rental (฿2,500 x 3 days)" value="฿7,500" /><PriceRow label="Service Fee" value="฿0" /></div>
    <div className="flex items-baseline justify-between border-t border-gray-100 pt-4"><span className="font-serif text-base font-bold text-gray-900">Total</span><span className="font-serif text-2xl font-bold text-gray-900">฿7,500</span></div>
    <div className="space-y-2.5 pt-2"><Button type="submit" variant="gold" onClick={onConfirm} className="flex w-full items-center justify-center gap-2 rounded py-3 text-xs font-semibold">Confirm &amp; Pay <span aria-hidden="true">→</span></Button><Button variant="outline" onClick={onBack} className="w-full rounded py-2.5 text-xs font-medium">Back to Booking Details</Button></div>
    <div className="space-y-2.5 border-t border-gray-100 pt-4 text-[11px] leading-tight text-gray-500"><p>🔒 Secure Payment</p><p>🛡 256-bit Encryption</p><p>✓ Free Cancellation up to 48 hours before pick-up</p></div>
  </div></aside>;
}

function SummaryDetail({ label, value, icon }) { return <div className="flex items-start gap-3"><span className="mt-0.5 text-base text-gray-600" aria-hidden="true">{icon}</span><div><p className="text-[9px] font-bold tracking-wider text-gray-400">{label}</p><p className="mt-0.5 font-medium text-gray-800">{value}</p></div></div>; }
function PriceRow({ label, value }) { return <div className="flex justify-between text-gray-600"><span>{label}</span><span className="font-medium text-gray-900">{value}</span></div>; }