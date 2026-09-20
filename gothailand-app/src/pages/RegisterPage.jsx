import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

/**
 * RegisterPage
 * -------------------------------------------------------------
 * หน้าสมัครสมาชิกใหม่ (Sign Up / Register)
 * รองรับการสร้างบัญชีทั้งบทบาท Customer และ Admin สำหรับการทดสอบ
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' หรือ 'admin'

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const newUser = await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });

      setSuccessMsg(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ ${newUser.firstName}`);
      setTimeout(() => {
        if (newUser.role === 'admin') {
          navigate('/provinces');
        } else {
          navigate('/');
        }
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'การสมัครสมาชิกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-fade-in">
        {/* หัวข้อ */}
        <div className="text-center space-y-1.5">
          <span className="text-3xl">📝</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            สมัครสมาชิก Go Thailand
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            เริ่มต้นวางแผนทริปท่องเที่ยว ค้นหาที่พัก รถเช่า และไกด์นำเที่ยว
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

        {/* ฟอร์มสมัครสมาชิก */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ชื่อจริง
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="สมชาย"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                นามสกุล
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="ใจดี"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition"
              />
            </div>
          </div>

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
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081-234-5678"
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

          {/* เลือกบทบาท (Role) สำหรับการทดสอบ Sprint 3 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ประเภทบัญชี (Account Role)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  role === 'customer'
                    ? 'border-amber-400 bg-amber-50 text-slate-900 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                  className="text-amber-500"
                />
                <span className="text-xs">👤 ลูกค้าทั่วไป (Customer)</span>
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  role === 'admin'
                    ? 'border-amber-400 bg-amber-50 text-slate-900 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="text-amber-500"
                />
                <span className="text-xs">👑 ผู้ดูแล (Admin)</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full justify-center py-3 font-bold text-sm sm:text-base rounded-xl shadow-md cursor-pointer mt-2"
          >
            {loading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
          </Button>
        </form>

        {/* ลิงก์กลับเข้าสู่ระบบ */}
        <div className="pt-2 text-center text-xs text-slate-500">
          <span>มีบัญชีอยู่แล้ว? </span>
          <NavLink
            to="/login"
            className="text-amber-600 font-bold hover:underline"
          >
            เข้าสู่ระบบที่นี่
          </NavLink>
        </div>
      </div>
    </div>
  );
}
