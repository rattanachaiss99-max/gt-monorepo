import { useAuth } from '../../context/AuthContext';
import { useItemVisibility } from '../../context/ItemVisibilityContext';

/**
 * AdminVisibilityFilterBar Component
 * -------------------------------------------------------------
 * แถบควบคุมสถานะการแสดงผลสำหรับผู้ดูแลระบบ (Admin)
 * ใช้งานได้ทุก Route บริการท่องเที่ยว (/accommodations, /cars, /guides, /provinces)
 * 
 * คุณสมบัติ:
 * 1. แสดงผลเฉพาะผู้ใช้ที่มีสิทธิ์ Admin เท่านั้น
 * 2. มีปุ่มสลับ "โหมดจำลองมุมมองลูกค้า" (Admin Customer Preview)
 * 3. มีปุ่ม Filter สถานะ: ทั้งหมด (All), กำลังแสดงผล (Visible), ถูกซ่อนไว้ (Hidden)
 * 4. แสดงตัวเลขนับจำนวน (Stats Count) แยกตามสถานะแบบเรียลไทม์
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
          ? 'bg-gradient-to-r from-sky-900 to-indigo-950 border-sky-600/60 p-3.5 sm:p-4 shadow-md'
          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-700/80 p-4 sm:p-5 shadow-lg'
      } ${className}`}
    >
      {/* โหมดจำลองมุมมองลูกค้า: แสดง Banner สั้นกระชับพร้อมปุ่มสลับกลับ */}
      {adminCustomerPreview ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-sky-200">
                  👁️ กำลังจำลองมุมมองลูกค้า (Customer Preview)
                </span>
                <span className="text-[10px] bg-sky-500/30 text-sky-200 border border-sky-400/40 px-2 py-0.5 rounded-full font-bold">
                  ซ่อน {stats.hidden} รายการ
                </span>
              </div>
              <p className="text-[11px] text-sky-300/80 mt-0.5">
                ระบบกำลังซ่อนบริการที่ Admin ปิดไว้ เหมือนที่ผู้ใช้งานทั่วไปมองเห็นจริง
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleCustomerPreview}
            className="w-full sm:w-auto shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>👥 กลับสู่โหมดผู้ดูแล</span>
          </button>
        </div>
      ) : (
        /* โหมดแอดมินปกติ: แสดงตัวเลือกและปุ่มแท็บกรองสถานะ */
        <div className="space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800 text-white">
            <div className="flex items-start gap-2.5">
              <span className="text-xl shrink-0 mt-0.5">⚙️</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-100">
                    แผงควบคุมการแสดงผล (Admin Visibility)
                  </h4>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md font-bold">
                    👑 สิทธิ์ Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  คลิกรูปตา (👁️ / 🙈) บนการ์ดแต่ละใบเพื่อซ่อนหรือแสดงต่อลูกค้า หรือกรองดูรายการตามสถานะด้านล่าง
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleCustomerPreview}
              className="w-full sm:w-auto shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>👁️ ดูตัวอย่างมุมมองลูกค้า</span>
            </button>
          </div>

          {/* แถบปุ่มแท็บกรองสถานะ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs font-medium">กรองตามสถานะ:</span>
              <div className="inline-flex bg-slate-950/80 p-1 rounded-xl border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => onVisibilityFilterChange?.('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    visibilityFilter === 'all'
                      ? 'bg-white text-slate-950 shadow-xs font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ทั้งหมด ({stats.total})
                </button>
                <button
                  type="button"
                  onClick={() => onVisibilityFilterChange?.('visible')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    visibilityFilter === 'visible'
                      ? 'bg-emerald-500 text-white shadow-xs font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👁️</span> กำลังแสดง ({stats.visible})
                </button>
                <button
                  type="button"
                  onClick={() => onVisibilityFilterChange?.('hidden')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    visibilityFilter === 'hidden'
                      ? 'bg-rose-500 text-white shadow-xs font-extrabold'
                      : 'text-slate-400 hover:text-white'
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
                className="text-xs text-slate-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer self-start sm:self-auto"
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
