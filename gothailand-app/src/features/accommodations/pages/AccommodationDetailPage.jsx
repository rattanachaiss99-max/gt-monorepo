import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getAccommodationById } from '../services/accommodationService';
import AccommodationDetail from '../components/AccommodationDetail';

/**
 * AccommodationDetailPage (Feature Page)
 * -------------------------------------------------------------
 * หน้ารายละเอียดที่พักท่องเที่ยวหลักของระบบ:
 * - รับพารามิเตอร์ URL ผ่าน Slug (เช่น /accommodations/siam-heritage-sanctuary)
 * - ดึงข้อมูลที่พักผ่าน accommodationService
 * - แสดง Breadcrumbs นำทาง และปุ่มย้อนกลับตาม Design System ของ Yok
 * - แสดงผลคอมโพเนนต์ AccommodationDetail (แกลเลอรี สเปกห้อง และการจอง)
 */
export default function AccommodationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [accommodation, setAccommodation] = useState(location?.state?.accommodation || null);
  const [loading, setLoading] = useState(!accommodation && !!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;
    if (!accommodation && id) {
      getAccommodationById(id)
        .then((fetched) => {
          if (active && fetched) {
            setAccommodation(fetched);
            window.scrollTo(0, 0);
          }
        })
        .catch((err) => {
          if (active) {
            console.error("Failed to load accommodation details:", err);
            setError("ไม่พบข้อมูลที่พักที่คุณเลือก หรือระบบเครือข่ายขัดข้อง");
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
  }, [id, accommodation]);

  // สถานะกำลังโหลด (Loading Spinner สไตล์ Yok)
  if (loading) {
    return (
      <div className="bg-[#fcfbf9] min-h-[70vh] flex flex-col items-center justify-center text-slate-600 px-4">
        <div className="w-10 h-10 border-4 border-[#0a192f] border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <p className="font-serif text-lg font-bold text-slate-800">กำลังโหลดข้อมูลที่พัก...</p>
        <p className="text-xs text-slate-400 mt-1">กรุณารอสักครู่ ระบบกำลังดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์</p>
      </div>
    );
  }

  // สถานะไม่พบข้อมูล (Error / 404 Fallback State)
  if (error || !accommodation) {
    return (
      <div className="bg-[#fcfbf9] min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-red-100">
          ⚠️
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">ไม่พบข้อมูลที่พัก</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          {error || "ไม่พบที่พักที่คุณกำลังค้นหา อาจถูกนำออกจากระบบหรือรหัสที่พักไม่ถูกต้อง"}
        </p>
        <button
          type="button"
          onClick={() => navigate('/accommodations')}
          className="bg-[#0a192f] hover:bg-amber-400 hover:text-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
        >
          ← กลับไปหน้ารวมที่พักทั้งหมด
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* แถบ Breadcrumbs และปุ่มย้อนกลับตามสไตล์ Yok */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60">
          <nav className="text-xs tracking-wide text-slate-400 flex items-center gap-2">
            <Link to="/" className="hover:text-slate-700 transition">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <Link to="/accommodations" className="hover:text-slate-700 transition">ที่พักท่องเที่ยว</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold line-clamp-1">{accommodation.name}</span>
          </nav>

          <button
            type="button"
            onClick={() => navigate('/accommodations')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 transition cursor-pointer"
          >
            <span>←</span>
            <span>ย้อนกลับไปหน้ารวมที่พัก</span>
          </button>
        </div>

        {/* คอมโพเนนต์แสดงผลรายละเอียดที่พัก */}
        <AccommodationDetail accommodation={accommodation} />
      </div>
    </div>
  );
}
