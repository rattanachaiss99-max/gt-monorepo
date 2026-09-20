import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminLayout
 * -------------------------------------------------------------
 * Layout สำหรับระบบจัดการหลังบ้าน (Admin Console)
 * - ออกแบบในโทนสี Navy (#0a192f) ดูพรีเมียม สวยงาม และแยกส่วนชัดเจนจากฝั่งลูกค้า
 * - ประกอบด้วย Admin Sidebar ด้านซ้าย (รองรับ Mobile Drawer)
 * - แถบ Header แสดงสถานะการเชื่อมต่อ MongoDB Atlas (Backend YOK)
 * - มีปุ่มสลับกลับสู่หน้าร้านค้า (Public Site) และปุ่มออกจากระบบ
 */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? "bg-amber-400 text-slate-950 shadow-md font-extrabold"
        : "text-slate-300 hover:text-white hover:bg-white/10"
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full text-slate-200">
      {/* ส่วนหัว Sidebar */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="text-2xl filter drop-shadow-sm">🇹🇭</span>
          <div>
            <span className="font-serif font-bold text-base text-white tracking-tight block">
              Go Thailand
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded">
              👑 Admin Console
            </span>
          </div>
        </NavLink>

        {/* ปุ่มปิด Mobile Sidebar */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
          aria-label="ปิดเมนู"
        >
          ✕
        </button>
      </div>

      {/* เมนูนำทางของระบบจัดการ */}
      <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 mb-2">
          เมนูจัดการหลัก
        </div>

        <NavLink
          to="/provinces"
          onClick={() => setMobileSidebarOpen(false)}
          className={navItemClass}
        >
          <span className="text-base">🗺️</span>
          <span>จัดการข้อมูล 77 จังหวัด</span>
        </NavLink>

        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 pt-4 mb-2">
          ฐานข้อมูล & โมดูลระบบ
        </div>

        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 bg-white/5 border border-white/5">
          <div className="flex items-center gap-2.5">
            <span>👥</span>
            <span>ข้อมูลสมาชิก (YOK)</span>
          </div>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
            Live
          </span>
        </div>

        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 bg-white/5 border border-white/5">
          <div className="flex items-center gap-2.5">
            <span>📑</span>
            <span>รายการจองทริป</span>
          </div>
          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
            Ready
          </span>
        </div>

        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 bg-white/5 border border-white/5">
          <div className="flex items-center gap-2.5">
            <span>📡</span>
            <span>RESTful Endpoints</span>
          </div>
          <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-500/30">
            v1.0
          </span>
        </div>
      </div>

      {/* ส่วนท้าย Sidebar: ข้อมูล Admin & ปุ่มกลับหน้าร้าน */}
      <div className="p-4 border-t border-slate-800 bg-black/20 space-y-3">
        {/* การ์ดผู้ดูแลระบบ */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {user?.firstName || "ผู้ดูแลระบบ"} {user?.lastName || ""}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <NavLink
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
          >
            <span>🏠</span>
            <span>กลับสู่หน้าร้านค้า (Public)</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors cursor-pointer border border-rose-500/30"
          >
            <span>🚪</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-800">
      {/* 1. Desktop Sidebar (คงที่ด้านซ้ายบนจอขนาดใหญ่ >= 1024px) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0a192f] shrink-0 border-r border-slate-800 shadow-xl z-30">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Sidebar (สำหรับจอมือถือและ Tablet) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar Panel */}
          <div className="relative w-64 max-w-[80vw] bg-[#0a192f] h-full shadow-2xl z-10 animate-slide-left">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* 3. Main Backoffice Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* ปุ่มเปิด Mobile Sidebar */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="เปิดเมนู Admin"
            >
              ☰
            </button>

            {/* Breadcrumb Title */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>แผงควบคุมระบบ</span>
                <span>/</span>
                <span className="text-slate-800 font-bold">จัดการข้อมูลจังหวัด</span>
              </div>
            </div>
          </div>

          {/* สถานะระบบด้านขวา */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Backend YOK: MongoDB Atlas Live</span>
            </div>

            <NavLink
              to="/"
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">ดูหน้าเว็บ</span>
            </NavLink>
          </div>
        </header>

        {/* พื้นที่แสดงผลหน้าหลังบ้าน (Outlet) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
