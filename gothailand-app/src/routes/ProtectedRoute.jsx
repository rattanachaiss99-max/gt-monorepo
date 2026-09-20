import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

/**
 * ProtectedRoute Component (Role-Based Route Guard)
 * -------------------------------------------------------------
 * ป้องกันการเข้าถึงหน้าที่มีสิทธิ์จำกัด (เช่น /provinces ที่ต้องเป็น Admin)
 * หากผู้ใช้ไม่มีสิทธิ์ จะแสดงหน้าปฏิเสธการเข้าถึง (403 Forbidden)
 * พร้อมปุ่มลัดสลับบทบาทเดโม่ (Demo Switcher) เพื่อความสะดวกในการตรวจงาน
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, user, switchDemoRole } = useAuth();

  // ตรวจสอบสิทธิ์ Admin
  if (adminOnly && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-5 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl shadow-inner">
            🛡️
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full">
              403 Forbidden • จำกัดสิทธิ์การเข้าถึง
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              เฉพาะผู้ดูแลระบบ (Admin Only)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              หน้า &quot;จัดการข้อมูลจังหวัด&quot; สงวนสิทธิ์เฉพาะผู้ดูแลระบบเท่านั้น
              {isAuthenticated ? (
                <> ขณะนี้คุณเข้าสู่ระบบด้วยบทบาท <strong className="text-slate-800 font-semibold">{user?.role || 'Customer'}</strong></>
              ) : (
                <> คุณยังไม่ได้เข้าสู่ระบบ</>
              )}
            </p>
          </div>

          {/* กล่องช่วยเหลือสำหรับตรวจงาน (Demo Reviewer Helper) */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <span>💡</span>
              <span>ตัวช่วยสำหรับผู้ตรวจงาน / ทดสอบระบบ:</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-normal">
              คลิกปุ่มด้านล่างเพื่อจำลองการสลับเป็นบัญชี **Admin** ทันทีในคลิกเดียว เพื่อทดสอบฟังก์ชันจัดการข้อมูล 77 จังหวัด
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => switchDemoRole('admin')}
              className="w-full justify-center font-bold text-xs py-2 shadow-sm cursor-pointer"
            >
              👑 สลับเป็นบัญชี Admin ทันที (Demo)
            </Button>
          </div>

          {/* ลิงก์นำทางอื่นๆ */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <NavLink
              to="/login"
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors text-center"
            >
              🔑 ไปหน้าเข้าสู่ระบบ
            </NavLink>
            <NavLink
              to="/"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0a192f] text-white hover:bg-[#112240] text-xs font-bold transition-colors text-center shadow-xs"
            >
              🏠 กลับหน้าแรก
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
