import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/**
 * BookingSummaryPanel
 * Panel สรุปรายการจองด้านขวา — ใช้ร่วมกันใน BookingDetailsPage และ CheckoutPage
 * รองรับ cart items ทุกประเภท: car, accommodation, guide
 */
export default function BookingSummaryPanel({ onContinue, continueLabel = 'Continue →', loading = false }) {
  const { items, grandTotal, subtotal } = useCart();

  const getTypeIcon = (type) => {
    if (type === 'car') return '🚗';
    if (type === 'accommodation') return '🏨';
    if (type === 'guide') return '🧭';
    return '🌟';
  };

  const getDurationLabel = (item) => {
    const days = item.dates?.durationDays || 1;
    if (item.type === 'accommodation') return `${days} คืน`;
    if (item.type === 'guide') return item.details?.duration || `${days} วัน`;
    return `${days} วัน`;
  };

  return (
    <div className="bg-[#0a192f] text-white p-6 rounded-2xl shadow-xl space-y-4 sticky top-6">
      <h3 className="font-serif text-lg font-bold border-b border-slate-700 pb-3 text-white">
        สรุปการจอง
      </h3>

      {/* รายการในตะกร้า */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-4">ไม่มีรายการในตะกร้า</p>
        ) : (
          items.map((item) => (
            <div key={item.cartItemId} className="flex items-start gap-3">
              {/* รูปหรือ icon */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-700 shrink-0 flex items-center justify-center text-2xl">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  getTypeIcon(item.type)
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white line-clamp-1">{item.title}</p>
                {item.subtitle && (
                  <p className="text-[11px] text-slate-400 line-clamp-1">{item.subtitle}</p>
                )}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] bg-slate-700 text-amber-300 px-2 py-0.5 rounded-md font-medium">
                    ⏱ {getDurationLabel(item)}
                  </span>
                  {item.dates?.startDate && (
                    <span className="text-[10px] text-slate-400">
                      📅 {item.dates.startDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-amber-400">
                  ฿{(item.itemTotal || 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">
                  ฿{item.unitPrice?.toLocaleString()} {item.priceUnitLabel}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* สรุปราคา */}
      <div className="border-t border-slate-700 pt-3 space-y-2 text-xs text-slate-300">
        <div className="flex justify-between">
          <span>ราคารวมย่อย</span>
          <span className="text-white font-medium">฿{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>ค่าบริการ</span>
          <span className="text-white">฿0</span>
        </div>
        <div className="flex justify-between">
          <span>ภาษีมูลค่าเพิ่ม 7%</span>
          <span className="text-emerald-400 font-medium">รวมอยู่ในราคาแล้ว</span>
        </div>
      </div>

      {/* ยอดรวม */}
      <div className="flex items-baseline justify-between pt-3 border-t border-slate-700">
        <span className="text-[11px] uppercase tracking-wider text-slate-400">ยอดชำระทั้งสิ้น</span>
        <span className="font-serif text-2xl font-bold text-amber-400">
          ฿{grandTotal.toLocaleString()}
        </span>
      </div>

      {/* ปุ่ม Continue */}
      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          disabled={loading || items.length === 0}
          className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              กำลังดำเนินการ...
            </span>
          ) : (
            continueLabel
          )}
        </button>
      )}

      {/* ความน่าเชื่อถือ */}
      <div className="pt-1 space-y-1.5">
        {['🔒 การชำระเงินปลอดภัย (SSL 256-bit)', '✅ ยกเลิกฟรีก่อน 48 ชั่วโมง', '📧 ได้รับ Voucher ยืนยันทาง Email'].map((txt) => (
          <p key={txt} className="text-[10px] text-slate-400 flex items-center gap-1.5">{txt}</p>
        ))}
      </div>
    </div>
  );
}
