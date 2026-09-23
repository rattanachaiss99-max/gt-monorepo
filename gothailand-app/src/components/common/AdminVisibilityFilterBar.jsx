import { useAuth } from '../../context/AuthContext';
import { useItemVisibility } from '../../context/ItemVisibilityContext';

/**
 * AdminVisibilityFilterBar Component (Yok Design Pattern)
 * -------------------------------------------------------------
 * แถบควบคุมสถานะการแสดงผลสำหรับผู้ดูแลระบบ (Admin)
 * ออกแบบด้วย "Style แบบเดิม" ของระบบ: การ์ดสีขาว คลีน หรูหรา เส้นขอบมน
 * เข้ากับดีไซน์ของการ์ดผลลัพธ์และแถบ Filter ด้านข้างอย่างไร้รอยต่อ
 */
export default function AdminVisibilityFilterBar({
  visibilityFilter = 'all',
  onVisibilityFilterChange,
  stats = { total: 0, visible: 0, hidden: 0 },
  className = '',
}) {
  const { isAdmin } = useAuth();
  const { adminCustomerPreview, toggleCustomerPreview } = useItemVisibility();

  if (!isAdmin) return null;

  return (
    <div
      className={`rounded-2xl border transition-all ${
        adminCustomerPreview
          ? 'bg-amber-50/90 border-amber-200/90 p-3.5 sm:p-4 shadow-2xs'
          : 'bg-white border-slate-200/80 p-4 sm:p-5 shadow-2xs'
      } ${className}`}
    >
      {/* โหมดจำลองมุมมองลูกค้า: แสดง Banner คลีนโทนสีอำพัน/ฟ้า พร้อมปุ่มสลับกลับ */}
      {adminCustomerPreview ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-amber-950">
                  👁️ กำลังจำลองมุมมองลูกค้า (Customer Preview)
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                  ซ่อน {stats.hidden} รายการ
                </span>
              </div>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                ระบบกำลังกรองแสดงเฉพาะบริการที่เปิดอยู่ เหมือนที่ผู้ใช้งานทั่วไปมองเห็นจริง
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleCustomerPreview}
            className="w-full sm:w-auto shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0a192f] hover:bg-slate-800 text-amber-400 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span>👥 กลับสู่โหมดผู้ดูแล</span>
          </button>
        </div>
      ) : (
        /* โหมดแอดมินปกติ: สไตล์การ์ดสีขาว คลีน เข้ากับ UI ทั้งระบบ */
        <div className="space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                <span className="text-xs">⚙️</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900">
                    แผงควบคุมการแสดงผล (Admin Visibility)
                  </h4>
                  <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                    👑 สิทธิ์ Admin
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  คลิกรูปตา (👁️ / 🙈) บนการ์ดแต่ละใบเพื่อซ่อนหรือแสดงต่อลูกค้า หรือกรองดูรายการตามสถานะด้านล่าง
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleCustomerPreview}
              className="w-full sm:w-auto shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
            >
              <span>👁️ ดูตัวอย่างมุมมองลูกค้า</span>
            </button>
          </div>

          {/* แถบปุ่มแท็บกรองสถานะ: สไตล์ Segmented Controls คลีนโทน Slate/Navy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-medium">กรองตามสถานะ:</span>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => onVisibilityFilterChange?.('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    visibilityFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ทั้งหมด ({stats.total})
                </button>
                <button
                  type="button"
                  onClick={() => onVisibilityFilterChange?.('visible')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    visibilityFilter === 'visible'
                      ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>👁️</span> กำลังแสดง ({stats.visible})
                </button>
                <button
                  type="button"
                  onClick={() => onVisibilityFilterChange?.('hidden')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    visibilityFilter === 'hidden'
                      ? 'bg-rose-600 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🙈</span> ซ่อนอยู่ ({stats.hidden})
                </button>
              </div>
            </div>

            {visibilityFilter !== 'all' && (
              <button
                type="button"
                onClick={() => onVisibilityFilterChange?.('all')}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                ล้างตัวกรองสถานะ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
