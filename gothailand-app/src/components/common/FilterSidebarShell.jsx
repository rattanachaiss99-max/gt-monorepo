import { useState } from 'react';

/**
 * โครงห่อหุ้มด้านนอกที่ใช้ร่วมกันของแถบตัวกรองที่พัก/รถ: ปุ่ม toggle บนมือถือ,
 * กล่องการ์ดสีขาว, header (ไอคอน/หัวข้อ/จำนวน/ปุ่ม reset) และแถวป้ายตัวกรองที่เลือกไว้
 * เดิมโค้ดส่วนนี้ซ้ำกันเป๊ะระหว่าง FilterSidebar.jsx กับ CarFilterSidebar.jsx
 * ส่วนตัวกรองจริงของแต่ละฟีเจอร์ (checkbox, ปุ่ม toggle, สไลเดอร์) ยังคงแยกอยู่ใน
 * component ของตัวเอง เพราะรูปแบบข้อมูลต่างกันจริง
 */
export default function FilterSidebarShell({
  title,
  subtitleCount,
  subtitleLabel,
  hasActiveFilters,
  onResetFilters,
  activePills,
  children,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="w-full lg:w-76 shrink-0">
      {/* ปุ่ม Toggle บนมือถือ */}
      <div className="lg:hidden mb-2 sm:mb-3">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 flex items-center justify-between shadow-2xs cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span>Filters (ตัวกรองค้นหา)</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200/60 flex items-center gap-1.5 transition-colors">
            <span>{mobileOpen ? 'Hide Filters' : 'Show Filters'}</span>
            <span className="text-[10px]">{mobileOpen ? '▲' : '▼'}</span>
          </span>
        </button>
      </div>

      {/* กล่องการ์ดตัวกรองหลัก */}
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-5 ${
          mobileOpen ? 'block' : 'hidden lg:block'
        } lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto`}
      >
        {/* Header: หัวข้อ, ป้ายจำนวน และปุ่ม Reset */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0a192f] text-amber-400 flex items-center justify-center shadow-2xs">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {title}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {subtitleCount} {subtitleLabel}
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Reset all
            </button>
          )}
        </div>

        {/* สรุปป้ายตัวกรองที่กำลังเลือกอยู่ */}
        {hasActiveFilters && activePills && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            {Array.isArray(activePills) &&
            activePills.length > 0 &&
            typeof activePills[0] === 'object' &&
            !activePills[0].$$typeof ? (
              activePills.map((pill) => (
                <span
                  key={pill.id}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                >
                  <span>{pill.label}</span>
                  {pill.onRemove && (
                    <button
                      type="button"
                      onClick={pill.onRemove}
                      className="hover:text-red-500 cursor-pointer ml-0.5 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </span>
              ))
            ) : (
              activePills
            )}
          </div>
        )}

        {children}
      </div>
    </aside>
  );
}
