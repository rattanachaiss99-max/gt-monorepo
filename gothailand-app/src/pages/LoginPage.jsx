import { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import Button from '../components/common/Button';

/**
 * LoginPage
 * -------------------------------------------------------------
 * หน้าเข้าสู่ระบบ (Sign In) รองรับทั้งการกรอกข้อมูลจริง
 * และปุ่มลัดสลับบัญชีทดสอบด่วน (Quick Demo Login) สำหรับ Admin และ Customer
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '';

  const { login, switchDemoRole } = useAuth();

  const [email, setEmail] = useState(DEMO_ACCOUNTS.admin.email);
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      setSuccessMsg(`ยินดีต้อนรับ ${loggedUser.firstName}! กำลังเข้าสู่ระบบ...`);
      setTimeout(() => {
        if (redirectTarget) {
          navigate(redirectTarget);
        } else if (loggedUser.role === 'admin') {
          navigate('/provinces');
        } else {
          navigate('/');
        }
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'การเข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    switchDemoRole(role);
    setSuccessMsg(`สลับเป็นบัญชี ${role === 'admin' ? 'Admin' : 'Customer'} สำเร็จ!`);
    setTimeout(() => {
      if (role === 'admin') {
        navigate('/provinces');
      } else {
        navigate('/');
      }
    }, 500);
  };

  const handleFillCredentials = (role) => {
    if (role === 'admin') {
      setEmail(DEMO_ACCOUNTS.admin.email);
      setPassword('Password123!');
    } else {
      setEmail(DEMO_ACCOUNTS.customer.email);
      setPassword('Password123!');
    }
  };

  return (
    <div className="py-10 sm:py-16 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-fade-in">
        {/* หัวข้อ */}
        <div className="text-center space-y-1.5">
          <span className="text-3xl">🇹🇭</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            เข้าสู่ระบบ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            ยินดีต้อนรับสู่ Go Thailand (เชื่อมต่อ Backend YOK)
          </p>
        </div>

        {/* แถบแจ้งเตือนสถานะ */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <span>✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* กล่องปุ่มลัดสำหรับตรวจงาน (Quick Demo Switcher) */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>⚡ บัญชีทดสอบด่วน (Backend YOK):</span>
            <span className="text-[10px] bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded-full font-mono">
              MongoDB Atlas
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-2.5 rounded-xl bg-[#0a192f] text-amber-400 hover:bg-[#112240] text-xs font-bold transition-all shadow-2xs text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>👑</span>
              <span>Siwat (Admin)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="py-2 px-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold transition-all shadow-2xs text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>👤</span>
              <span>John (Customer)</span>
            </button>
          </div>
          <div className="flex items-center justify-between pt-1 text-[11px] text-amber-800">
            <span>กรอกฟอร์มอัตโนมัติ:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFillCredentials('admin')}
                className="underline hover:text-amber-950 font-bold cursor-pointer"
              >
                ใส่ค่า Admin
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleFillCredentials('customer')}
                className="underline hover:text-amber-950 font-bold cursor-pointer"
              >
                ใส่ค่า Customer
              </button>
            </div>
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              อีเมล (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gothailand.com"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full justify-center py-3 font-bold text-sm sm:text-base rounded-xl shadow-md cursor-pointer"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>

        {/* ลิงก์สมัครสมาชิก */}
        <div className="pt-2 text-center text-xs text-slate-500">
          <span>ยังไม่มีบัญชีผู้ใช้? </span>
          <NavLink
            to="/register"
            className="text-amber-600 font-bold hover:underline"
          >
            สมัครสมาชิกที่นี่
          </NavLink>
        </div>

        {/* ข้อมูลการเชื่อมต่อ Backend YOK */}
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center space-y-0.5">
          <p className="font-semibold text-slate-600">📡 ฐานข้อมูลสด: MongoDB Atlas (YOK Backend)</p>
          <p>Admin: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">siwat@example.com</code> | รหัสผ่าน: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">Password123!</code></p>
        </div>
      </div>
    </div>
  );
}
