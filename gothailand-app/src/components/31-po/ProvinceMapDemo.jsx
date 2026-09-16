import { useState, useEffect } from "react";
import Header from "./Header";
import DatabaseStatus from "./DatabaseStatus";
import ProvinceSvgViewer from "./ProvinceSvgViewer";
import ProvinceTable from "./ProvinceTable";
import Footer from "./Footer";

export default function ProvinceMapDemo() {
  const [count, setCount] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ฟังก์ชันยิงดึงข้อมูลจาก Express Backend ที่เชื่อมกับ MongoDB Atlas
  const loadProvincesFromMongo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/provinces`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (data.success && data.provinces) {
        setProvinces(data.provinces);
        // ตั้งค่าจังหวัดเริ่มต้น เช่น เชียงใหม่ หรือจังหวัดแรกในรายการ
        const defaultItem =
          data.provinces.find((p) => p.slug === "chiang-mai") ||
          data.provinces[0];
        if (defaultItem) setSelectedSlug(defaultItem.slug);
      } else {
        throw new Error(data.error || "ไม่พบข้อมูลจังหวัด");
      }
    } catch (err) {
      setError(err.message || "ไม่สามารถเชื่อมต่อ Backend ได้");
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    loadProvincesFromMongo();
  }, []);

  // หาจังหวัดที่กำลังเลือกดูอยู่
  const currentProvince =
    provinces.find((p) => p.slug === selectedSlug) || provinces[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 1. Header (Vite logo + Counter button + Refresh button) */}
        <Header
          count={count}
          onIncrement={() => setCount((c) => c + 1)}
          onRefresh={loadProvincesFromMongo}
          loading={loading}
        />

        {/* 2. สถานะการเชื่อมต่อ Database (MongoDB Atlas) */}
        <DatabaseStatus
          provincesCount={provinces.length}
          apiUrl={API_URL}
          error={error}
        />

        {/* 3. กล่องวาดแผนที่ SVG สดจากฟิลด์ vectorData.d ของ MongoDB */}
        {currentProvince && (
          <ProvinceSvgViewer
            province={currentProvince}
            provinces={provinces}
            selectedSlug={selectedSlug}
            onSelectProvince={setSelectedSlug}
          />
        )}

        {/* 4. ตารางแสดงรายการ 77 จังหวัด พร้อมค้นหาและกรองภาค */}
        <ProvinceTable
          provinces={provinces}
          selectedSlug={selectedSlug}
          onSelectProvince={setSelectedSlug}
        />

        {/* 5. Footer */}
        <Footer />
      </div>
    </div>
  );
}
