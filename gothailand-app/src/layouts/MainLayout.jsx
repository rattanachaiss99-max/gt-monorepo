import { Outlet, NavLink } from "react-router-dom";
import {
  CartNavbarButton,
  CartDrawer,
  UserNavbarWidget,
} from "../components/common";
import { useCart } from "../context/CartContext";

/**
 * MainLayout
 * -------------------------------------------------------------
 * Layout หลักสำหรับฝั่งผู้ใช้งานทั่วไปและนักท่องเที่ยว (Public Travel Portal)
 * 1. Responsive Top Navigation: ปรับข้อความให้กระชับบน Tablet และซ่อนบนจอมือถือ
 * 2. Mobile Bottom Navigation: แถบเมนูด้านล่างแบบ Native App สำหรับจอมือถือ
 * 3. Rich Travel Footer: สรุปบริการ ข้อมูลท่องเที่ยว 5 ภาค และสถานะระบบ
 * 4. Global Overlays: รองรับ CartDrawer และ UserNavbarWidget
 */
export default function MainLayout() {
  const { totalItemsCount, toggleDrawer } = useCart();

  const navLinkClass = ({ isActive }) =>
    `px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
      isActive
        ? "bg-amber-400 text-slate-950 shadow-xs"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  const mobileBottomLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
      isActive ? "text-amber-600" : "text-slate-500 hover:text-slate-800"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* 1. Top Navigation Bar ส่วนกลาง */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* โลโก้ & ตราสัญลักษณ์ Go Thailand */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group"
            title="Go Thailand"
          >
            <img
              src="/gothailand-badge.svg"
              alt="Go Thailand Logo"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <img
              src="/gothailand-logo-text.png"
              alt="Go Thailand"
              className="h-6 sm:h-7 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
            />
          </NavLink>

          {/* เมนูนำทาง Desktop + ปุ่มตะกร้า & ผู้ใช้งาน */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden min-[950px]:flex items-center gap-1 sm:gap-1.5">
              {/* ซ่อนหัวข้อ 'หน้าแรก' บน Navbar (คลิกที่โลโก้เพื่อกลับหน้าแรกได้โดยตรง) */}
              {/* <NavLink to="/" className={navLinkClass} end>
                <span>🏠</span>
                <span>หน้าแรก</span>
              </NavLink> */}

              <NavLink to="/accommodations" className={navLinkClass}>
                {/* <span>🏨</span> */}
                <span>
                  ที่พัก<span className="hidden md:inline">ท่องเที่ยว</span>
                </span>
              </NavLink>

              <NavLink to="/cars" className={navLinkClass}>
                {/* <span>🚗</span> */}
                <span>
                  รถเช่า<span className="hidden md:inline">ท่องเที่ยว</span>
                </span>
              </NavLink>

              <NavLink to="/guides" className={navLinkClass}>
                {/* <span>🧭</span> */}
                <span>
                  ไกด์<span className="hidden md:inline">นำเที่ยว</span>
                </span>
              </NavLink>
            </nav>

            <div className="h-6 w-px bg-slate-200 hidden min-[950px]:block" />

            {/* ปุ่มเปิดตะกร้าส่วนกลาง */}
            <CartNavbarButton />

            {/* วิดเจ็ตข้อมูลผู้ใช้ / เข้าสู่ระบบ */}
            <UserNavbarWidget />
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 min-[950px]:pb-8">
        <Outlet />
      </main>

      {/* 3. Mobile & Tablet Bottom Navigation Bar (แสดงเมื่อความกว้างจอ < 950px) */}
      <nav
        aria-label="เมนูนำทางบนมือถือและแท็บเล็ต"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 flex items-center justify-around min-[950px]:hidden shadow-lg"
      >
        <NavLink to="/" className={mobileBottomLinkClass} end>
          <span className="text-lg leading-none">🏠</span>
          <span className="mt-0.5">หน้าแรก</span>
        </NavLink>

        <NavLink to="/accommodations" className={mobileBottomLinkClass}>
          <span className="text-lg leading-none">🏨</span>
          <span className="mt-0.5">ที่พัก</span>
        </NavLink>

        <NavLink to="/cars" className={mobileBottomLinkClass}>
          <span className="text-lg leading-none">🚗</span>
          <span className="mt-0.5">รถเช่า</span>
        </NavLink>

        <NavLink to="/guides" className={mobileBottomLinkClass}>
          <span className="text-lg leading-none">🧭</span>
          <span className="mt-0.5">ไกด์</span>
        </NavLink>

        {/* ปุ่มเปิดตะกร้าบนแถบล่าง */}
        <button
          type="button"
          onClick={toggleDrawer}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-slate-600 hover:text-amber-600 transition-colors relative cursor-pointer"
        >
          <span className="text-lg leading-none relative">
            🛒
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount > 9 ? "9+" : totalItemsCount}
              </span>
            )}
          </span>
          <span className="mt-0.5">ตะกร้า</span>
        </button>
      </nav>

      {/* 4. Slide-over Cart Drawer กลางของระบบ */}
      <CartDrawer />

      {/* 5. Rich Travel Footer ส่วนกลาง */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* คอลัมน์ที่ 1: Brand & พันธกิจ */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="font-serif font-bold text-lg text-slate-900">
                  Go Thailand
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                แพลตฟอร์มรวมบริการท่องเที่ยวไทยครบวงจร ทั้งที่พัก รถเช่า
                และไกด์นำเที่ยวท้องถิ่น พร้อมแผนที่ข้อมูล 77 จังหวัด
                เพื่อประสบการณ์การเดินทางที่น่าประทับใจ
              </p>
            </div>

            {/* คอลัมน์ที่ 2: หมวดหมู่บริการหลัก */}
            <div className="space-y-2.5">
              <h3 className="font-serif text-sm font-bold text-slate-900">
                บริการท่องเที่ยว
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>
                  <NavLink
                    to="/accommodations"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1.5"
                  >
                    <span>🏨</span>
                    <span>ค้นหาที่พักและรีสอร์ต</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cars"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1.5"
                  >
                    <span>🚗</span>
                    <span>จองรถเช่าขับเที่ยว</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/guides"
                    className="hover:text-amber-600 transition-colors flex items-center gap-1.5"
                  >
                    <span>🧭</span>
                    <span>จัดหาไกด์นำเที่ยวท้องถิ่น</span>
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={toggleDrawer}
                    className="hover:text-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🛒</span>
                    <span>ตะกร้าทริปของฉัน ({totalItemsCount} รายการ)</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* คอลัมน์ที่ 3: จุดหมายปลายทางยอดนิยม */}
            <div className="space-y-2.5">
              <h3 className="font-serif text-sm font-bold text-slate-900">
                จุดหมายปลายทางยอดนิยม
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>เชียงใหม่ & ภาคเหนือ (Lanna Heritage)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>ภูเก็ต & ทะเลอันดามัน (Island Escapes)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>กรุงเทพมหานคร & ภาคกลาง (City Life)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>ขอนแก่น & ลุ่มน้ำโขง (Isan Culture)</span>
                </li>
              </ul>
            </div>

            {/* คอลัมน์ที่ 4: ข้อมูลระบบ & การเชื่อมต่อ */}
            {/* <div className="space-y-2.5">
              <h3 className="font-serif text-sm font-bold text-slate-900">
                สถาปัตยกรรมระบบ
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Backend YOK: Render Cloud API</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Province API: Interactive SVG Map</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>MongoDB Atlas Data Persistence</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>RESTful API HTTP Methods</span>
                </li>
              </ul>
            </div> */}
          </div>

          {/* แถบล่างสุด: ลิขสิทธิ์ & ข้อความรับรอง */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>© 2026 Go Thailand — JSD13 Team 8. All rights reserved.</p>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>React 19 + Vite</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <NavLink to="/login" className="hover:text-slate-600 underline">
                พอร์ทัลสมาชิก
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
