import { Outlet, NavLink } from "react-router-dom";

/**
 * AuthLayout
 * -------------------------------------------------------------
 * Layout แบบ Clean & Focus สำหรับหน้าเข้าสู่ระบบ (/login) และสมัครสมาชิก (/register)
 * - ตัดแถบนำทางบริการท่องเที่ยวและตะกร้าสินค้าออก เพื่อโฟกัสที่การยืนยันตัวตน
 * - มีปุ่ม "← กลับสู่หน้าหลัก" ที่ชัดเจน
 * - ดีไซน์โทนสี Navy (#0a192f) และ Amber ตามระบบ Tailwind CSS เดิม
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 font-sans">
      {/* ส่วนหัว Minimal Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* โลโก้แบรนด์ */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
              🇹🇭
            </span>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                Go Thailand
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                Member Portal
              </span>
            </div>
          </NavLink>

          {/* ปุ่มกลับสู่หน้าหลัก */}
          <NavLink
            to="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-2xs cursor-pointer"
          >
            <span>←</span>
            <span>กลับสู่หน้าหลัก</span>
          </NavLink>
        </div>
      </header>

      {/* พื้นที่เนื้อหาฟอร์ม Login / Register (จัดกึ่งกลางอัตโนมัติ) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* ส่วนท้าย Minimal Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Go Thailand — JSD13 Team 8. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>เชื่อมต่อ Backend YOK</span>
            <span>•</span>
            <span>MongoDB Atlas</span>
            <span>•</span>
            <span>ระบบความปลอดภัยสิทธิ์ RBAC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
