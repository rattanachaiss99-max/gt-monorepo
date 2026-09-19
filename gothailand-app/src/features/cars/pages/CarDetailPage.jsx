import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getCarById } from '../services/carService';
import CarDetail from '../components/CarDetail';

/**
 * CarDetailPage (Feature Page)
 * -------------------------------------------------------------
 * หน้ารายละเอียดรถเช่าท่องเที่ยวหลักของระบบ:
 * - ดึงข้อมูลรถตาม ID หรือ Slug ผ่าน carService
 * - แสดงผล Breadcrumbs นำทาง และปุ่มย้อนกลับตาม Design System
 * - รวมคอมโพเนนต์การแสดงผล CarDetail พร้อมระบบส่งต่อไปยัง CarCheckout
 */
export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [car, setCar] = useState(location?.state?.car || null);
  const [loading, setLoading] = useState(!car && !!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;
    if (!car && id) {
      getCarById(id)
        .then((fetched) => {
          if (active && fetched) {
            setCar(fetched);
            window.scrollTo(0, 0);
          }
        })
        .catch((err) => {
          if (active) {
            console.error("Failed to load car details:", err);
            setError("ไม่พบข้อมูลรถยนต์ที่เลือก หรือระบบเครือข่ายขัดข้อง");
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false);
            window.scrollTo(0, 0);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [id, car]);

  // สถานะกำลังโหลด
  if (loading) {
    return (
      <div className="bg-[#fcfbf9] min-h-[70vh] flex flex-col items-center justify-center text-slate-600 px-4">
        <div className="w-10 h-10 border-4 border-[#0a192f] border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <p className="font-serif text-lg font-bold text-slate-800">กำลังโหลดข้อมูลรถเช่า...</p>
        <p className="text-xs text-slate-400 mt-1">กรุณารอสักครู่ ระบบกำลังดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์</p>
      </div>
    );
  }

  // สถานะไม่พบข้อมูล
  if (error || !car) {
    return (
      <div className="bg-[#fcfbf9] min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-red-100">
          ⚠️
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">ไม่พบข้อมูลรถยนต์</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          {error || "ไม่พบรถยนต์ที่คุณกำลังค้นหา อาจถูกนำออกจากระบบหรือรหัสรถไม่ถูกต้อง"}
        </p>
        <button
          type="button"
          onClick={() => navigate('/cars')}
          className="bg-[#0a192f] hover:bg-amber-400 hover:text-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
        >
          ← กลับไปหน้ารายการรถทั้งหมด
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* แถบ Breadcrumbs และปุ่มย้อนกลับ */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60">
          <nav className="text-xs tracking-wide text-slate-400 flex items-center gap-2">
            <Link to="/" className="hover:text-slate-700 transition">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <Link to="/cars" className="hover:text-slate-700 transition">รถเช่าท่องเที่ยว</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold line-clamp-1">{car.name}</span>
          </nav>

          <button
            type="button"
            onClick={() => navigate('/cars')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 transition cursor-pointer"
          >
            <span>←</span>
            <span>ย้อนกลับไปหน้ารวมรถ</span>
          </button>
        </div>

        {/* คอมโพเนนต์รายละเอียดรถ */}
        <CarDetail car={car} />
      </div>
    </div>
  );
}
