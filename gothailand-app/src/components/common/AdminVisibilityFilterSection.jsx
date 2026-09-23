import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useItemVisibility } from '../../context/ItemVisibilityContext';

/**
 * AdminVisibilityFilterSection Component (Yok Design Pattern)
 * -------------------------------------------------------------
 * Shared Filter Component สำหรับแถบ Sidebar (FilterSidebar)
 * แสดงเฉพาะเมื่อผู้ใช้เป็น Admin:
 * - ตัวเลือกสถานะ: ทั้งหมด (All), กำลังแสดงผล (Visible), ซ่อนอยู่ (Hidden)
 * - ป้ายนับจำนวน (Badge) แบบไดนามิก สไตล์เดียวกับหมวดหมู่อื่นๆ ใน Sidebar
 * - ปุ่มสลับโหมดจำลองมุมมองลูกค้า (Customer Preview)
 * - สไตล์คลีน ขาว-ทองอำพัน สอดคล้องตาม Yok Design Pattern ทุกประการ
 */
export default function AdminVisibilityFilterSection({
  visibilityFilter = 'all',
  onVisibilityFilterChange,
  stats = { total: 0, visible: 0, hidden: 0 },
}) {
  const { isAdmin } = useAuth();
  const { adminCustomerPreview, toggleCustomerPreview } = useItemVisibility();
  const [isOpen, setIsOpen] = useState(true);

  if (!isAdmin) return null;

  const options = [
    { id: 'all', label: 'ทั้งหมด', count: stats.total, icon: '🔘' },
    { id: 'visible', label: 'กำลังแสดงผล', count: stats.visible, icon: '👁️' },
    { id: 'hidden', label: 'ซ่อนอยู่', count: stats.hidden, icon: '🙈' },
  ];

  return (
    <div className="space-y-2.5 pb-4 border-b border-slate-100">
      {/* Section Header: สไตล์เดียวกับหัวข้ออื่นๆ ใน Sidebar */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 cursor-pointer py-1"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-amber-500 font-normal">👑</span>
          <span>สถานะ Admin (Visibility)</span>
        </span>
        <span className="text-slate-400 font-normal">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="space-y-1.5 pt-1">
          {/* ตัวเลือกสถานะการแสดงผล */}
          {options.map((opt) => {
            const isSelected = visibilityFilter === opt.id && !adminCustomerPreview;
            return (
              <label
                key={opt.id}
                onClick={() => {
                  if (adminCustomerPreview) toggleCustomerPreview();
                  onVisibilityFilterChange?.(opt.id);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/80 shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="admin-visibility-filter"
                    checked={isSelected}
                    onChange={() => {
                      if (adminCustomerPreview) toggleCustomerPreview();
                      onVisibilityFilterChange?.(opt.id);
                    }}
                    className="w-4 h-4 text-amber-500 border-slate-300 focus:ring-amber-400 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-amber-200 text-amber-900 font-bold'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {opt.count}
                </span>
              </label>
            );
          })}

          {/* ปุ่มสลับโหมดจำลองมุมมองลูกค้า (Customer Preview) สไตล์คลีน */}
          <button
            type="button"
            onClick={toggleCustomerPreview}
            className={`w-full mt-2.5 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
              adminCustomerPreview
                ? 'bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100'
                : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border-slate-200 hover:border-amber-200'
            }`}
          >
            <span>{adminCustomerPreview ? '👥 กลับสู่โหมดผู้ดูแล' : '👁️ ดูมุมมองลูกค้า (Preview)'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
