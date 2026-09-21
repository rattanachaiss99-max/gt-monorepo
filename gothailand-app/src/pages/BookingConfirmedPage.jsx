import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

/**
 * BookingConfirmedPage — /booking/confirmed
 * หน้ายืนยันการจองสำเร็จ แสดง Booking Reference ID
 * รองรับทุก service type: car / accommodation / guide
 */

const SERVICE_CONFIG = {
  car: {
    icon: '🚗',
    title: 'การเช่ารถของคุณได้รับการยืนยันแล้ว!',
    steps: [
      { icon: '📧', num: '01', title: 'ตรวจสอบ Email', desc: 'ใบยืนยันและ Voucher ส่งไปยัง Email ของคุณแล้ว' },
      { icon: '📄', num: '02', title: 'เตรียมเอกสาร', desc: 'เตรียมใบขับขี่ พาสปอร์ต และบัตรประชาชน' },
      { icon: '🗝️', num: '03', title: 'รับรถ', desc: 'ไปที่จุดรับรถตามเวลาที่นัดหมาย' },
    ],
  },
  accommodation: {
    icon: '🏨',
    title: 'การจองที่พักของคุณได้รับการยืนยันแล้ว!',
    steps: [
      { icon: '📧', num: '01', title: 'ตรวจสอบ Email', desc: 'ใบยืนยันการจองส่งไปยัง Email ของคุณแล้ว' },
      { icon: '📄', num: '02', title: 'เตรียมเอกสาร', desc: 'เตรียมบัตรประชาชนหรือพาสปอร์ตสำหรับ Check-in' },
      { icon: '🛎️', num: '03', title: 'Check-in', desc: 'แจ้งรหัสการจองที่ฟรอนท์เดสก์ของโรงแรม' },
    ],
  },
  guide: {
    icon: '🧭',
    title: 'การจองไกด์ของคุณได้รับการยืนยันแล้ว!',
    steps: [
      { icon: '📧', num: '01', title: 'ตรวจสอบ Email', desc: 'ข้อมูลไกด์และรายละเอียดทริปส่งไปยัง Email แล้ว' },
      { icon: '📱', num: '02', title: 'ติดต่อไกด์', desc: 'ไกด์จะติดต่อกลับภายใน 24 ชั่วโมง' },
      { icon: '🌟', num: '03', title: 'เริ่มทริป', desc: 'นัดพบไกด์ตามวันเวลาที่ตกลง และเริ่มการเดินทาง' },
    ],
  },
};

export default function BookingConfirmedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const {
    bookingRef = 'GT-XX-2026-00001',
    serviceType = 'car',
    traveler,
    grandTotal = 0,
    items = [],
  } = state;

  const config = SERVICE_CONFIG[serviceType] || SERVICE_CONFIG.car;

  useEffect(() => {
    window.scrollTo(0, 0);
    // ถ้าไม่มี bookingRef แสดงว่าเข้าหน้านี้ตรง redirect กลับ
    if (!location.state?.bookingRef) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  if (!location.state?.bookingRef) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf9] flex flex-col items-center justify-center text-slate-800 px-4 py-16">
      {/* Success Card */}
      <div className="w-full max-w-2xl">

        {/* Icon + Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-400 text-4xl mb-5 shadow-lg">
            ✓
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {config.title}
          </h1>
          {items.length > 0 && (
            <p className="text-slate-500 text-sm">
              {items.map(i => i.title).join(', ')} ได้รับการจองเรียบร้อยแล้ว
            </p>
          )}
        </div>

        {/* Booking Reference */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center mb-6 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Booking Reference ID</p>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-[#0a192f] tracking-wider">{bookingRef}</p>
          {traveler?.email && (
            <p className="text-xs text-slate-500 mt-3">
              📧 ใบยืนยันถูกส่งไปที่{' '}
              <span className="font-semibold text-slate-700">{traveler.email}</span>
            </p>
          )}
          {grandTotal > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">ยอดชำระทั้งสิ้น</p>
              <p className="font-serif text-2xl font-bold text-amber-600">฿{grandTotal.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {config.steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm"
            >
              <div className="text-2xl mb-2 text-amber-500">{step.icon}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{step.num}</p>
              <p className="font-serif font-semibold text-slate-900 text-sm mb-1">{step.title}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/my-bookings')}
            className="w-full sm:w-auto px-7 py-3 bg-[#0a192f] hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📋</span>
            <span>ดูประวัติการจองของฉัน</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-7 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow cursor-pointer"
          >
            🏠 กลับหน้าหลัก
          </button>
          <button
            type="button"
            onClick={() => {
              if (serviceType === 'car') navigate('/cars');
              else if (serviceType === 'accommodation') navigate('/accommodations');
              else navigate('/guides');
            }}
            className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm uppercase tracking-wider transition-all border border-slate-200 shadow-sm cursor-pointer"
          >
            {config.icon} ดูบริการอื่น
          </button>
        </div>

        {/* Support Note */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          มีคำถาม? ติดต่อ{' '}
          <span className="text-amber-600 font-semibold underline cursor-pointer">support@gothailand.com</span>
          {' '}หรือโทร{' '}
          <span className="font-semibold text-slate-600">+66 2-xxx-xxxx</span>
        </p>
      </div>
    </div>
  );
}
