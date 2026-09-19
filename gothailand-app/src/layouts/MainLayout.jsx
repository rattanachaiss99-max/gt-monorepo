import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-amber-400 text-slate-900 shadow-sm"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation Bar ส่วนกลาง */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Project Title */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
              🇹🇭
            </span>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Go Thailand
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                JSD13 Team 8
              </span>
            </div>
          </NavLink>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/" className={navLinkClass} end>
              🏠 หน้าแรก
            </NavLink>
            <NavLink to="/provinces" className={navLinkClass}>
              🗺️ จัดการข้อมูลจังหวัด
            </NavLink>
            <NavLink to="/accommodations" className={navLinkClass}>
              🏨 ที่พักท่องเที่ยว
            </NavLink>
            <NavLink to="/cars" className={navLinkClass}>
              🚗 รถเช่าท่องเที่ยว
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content Area (แต่ละ Page จะถูกนำมาเรนเดอร์ผ่าน Outlet) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer ส่วนกลาง */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Go Thailand — JSD13 Team 8. All rights reserved.</p>
      </footer>
    </div>
  );
}
