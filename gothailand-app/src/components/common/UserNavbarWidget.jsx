import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * UserNavbarWidget Component
 * -------------------------------------------------------------
 * วิดเจ็ตผู้ใช้บนแถบ Header:
 * - หากยังไม่ล็อกอิน: แสดงปุ่ม "เข้าสู่ระบบ / สมัครสมาชิก"
 * - หากล็อกอินแล้ว: แสดงรูปโปรไฟล์ย่อ, ชื่อ, ป้ายสถานะสิทธิ์ (👑 Admin หรือ 👤 Customer)
 *   และเมนู Dropdown สำหรับสลับบัญชีทดสอบด่วน หรือออกจากระบบ
 */
export default function UserNavbarWidget() {
  const { user, isAuthenticated, isAdmin, logout, switchDemoRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ปิดเมนูเมื่อคลิกนอกพื้นที่
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <NavLink
        to="/login"
        className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
      >
        <span>👤</span>
        <span className="hidden sm:inline-block">เข้าสู่ระบบ</span>
      </NavLink>
    );
  }

  const displayName = user.firstName || user.email?.split('@')[0] || 'ผู้ใช้';
  const roleBadge = isAdmin ? {
    icon: '👑',
    label: 'Admin',
    bg: 'bg-amber-400 text-slate-950 font-bold',
  } : {
    icon: '👤',
    label: 'Customer',
    bg: 'bg-slate-100 text-slate-700 font-semibold',
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
        aria-label="เมนูผู้ใช้งาน"
      >
        {/* รูปโปรไฟล์หรือ Avatar สำรอง */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="text-left hidden md:block">
          <div className="text-xs font-bold text-slate-800 line-clamp-1 leading-tight flex items-center gap-1">
            <span>{displayName}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${roleBadge.bg}`}>
              {roleBadge.icon} {roleBadge.label}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 line-clamp-1">
            {user.email}
          </div>
        </div>

        <span className="text-[10px] text-slate-400 hidden sm:inline">▼</span>
      </button>

      {/* เมนู Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-fade-in space-y-3">
          {/* ข้อมูลโปรไฟล์ย่อ */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">{roleBadge.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user.firstName} {user.lastName || ''}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">สถานะสิทธิ์:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${roleBadge.bg}`}>
                {roleBadge.label}
              </span>
            </div>
          </div>

          {/* เมนูลัดทดสอบสลับ Role (Demo Reviewer Helper) */}
          <div className="space-y-1 text-[11px]">
            <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider px-1">
              สลับบทบาททดสอบ (Demo Helper):
            </span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('admin');
                  setMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  isAdmin
                    ? 'bg-[#0a192f] text-amber-400 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                👑 Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  switchDemoRole('customer');
                  setMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  !isAdmin
                    ? 'bg-[#0a192f] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                👤 Customer
              </button>
            </div>
          </div>

          {/* ลิงก์เมนูเพิ่มเติม */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            {isAdmin && (
              <NavLink
                to="/provinces"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-200/80 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🗺️</span>
                  <span>จัดการข้อมูล 77 จังหวัด</span>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md font-bold">
                  Admin
                </span>
              </NavLink>
            )}

            <button
              type="button"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 text-rose-600 font-bold transition-colors cursor-pointer text-left"
            >
              <span>🚪</span>
              <span>ออกจากระบบ (Logout)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
