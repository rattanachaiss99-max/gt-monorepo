import { useState, useEffect } from "react";
import Header from "./Header";
import DatabaseStatus from "./DatabaseStatus";
import ProvinceSvgViewer from "./ProvinceSvgViewer";
import ProvinceTable from "./ProvinceTable";
import Footer from "./Footer";
import { fetchYokServices } from "../../services/yokService";

// API ส่ง SVG path มาซ้อนอยู่ใน province.vectorData.d ไม่ใช่ province.d ตรงๆ
// ทั้ง ProvinceSvgViewer และ ProvinceTable คาดหวัง field แบบ flat จึงต้องแปลงตรงนี้ที่เดียว
function normalizeProvinces(rawProvinces) {
  return rawProvinces.map((p) => ({
    ...p,
    d: p.vectorData?.d || p.d,
    viewBox: p.vectorData?.viewBox || p.viewBox,
  }));
}

export default function ProvinceMapDemo() {
  const [count, setCount] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ข้อมูลบริการจาก Yok API (Render)
  const [yokData, setYokData] = useState({
    accommodations: [],
    guides: [],
    cars: [],
    users: [],
    isOnline: false,
  });

  // VITE_API_URL (ตั้งไว้ใน .env) มี "/api" ต่อท้ายอยู่แล้ว เหมือนกับที่ api.js ใช้
  const API_URL = import.meta.env.VITE_API_URL || "https://gothailand-api.onrender.com/api";

  // ฟังก์ชันรีเฟรชข้อมูลทั้งสองฝั่งพร้อมกัน
  const handleRefreshAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [provRes, yokRes] = await Promise.allSettled([
        fetch(`${API_URL}/provinces`).then(async (res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return res.json();
        }),
        fetchYokServices(),
      ]);

      if (provRes.status === "fulfilled" && provRes.value?.success && provRes.value?.provinces) {
        setProvinces(normalizeProvinces(provRes.value.provinces));
      } else if (provRes.status === "rejected") {
        setError(provRes.reason?.message || "ไม่สามารถเชื่อมต่อ Backend ได้");
      }

      if (yokRes.status === "fulfilled") {
        setYokData(yokRes.value);
      }
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    let ignore = false;

    const loadInitialData = async () => {
      try {
        const [provRes, yokRes] = await Promise.allSettled([
          fetch(`${API_URL}/provinces`).then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            return res.json();
          }),
          fetchYokServices(),
        ]);

        if (ignore) return;

        if (provRes.status === "fulfilled" && provRes.value?.success && provRes.value?.provinces) {
          const normalized = normalizeProvinces(provRes.value.provinces);
          setProvinces(normalized);
          const defaultItem =
            normalized.find((p) => p.slug === "chiang-mai") || normalized[0];
          if (defaultItem) setSelectedSlug(defaultItem.slug);
          setError(null);
        } else if (provRes.status === "rejected") {
          setError(provRes.reason?.message || "ไม่สามารถเชื่อมต่อ Backend ได้");
        }

        if (yokRes.status === "fulfilled") {
          setYokData(yokRes.value);
        }
      } catch (err) {
        if (!ignore) setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, [API_URL]);

  // หาจังหวัดที่กำลังเลือกดูอยู่
  const currentProvince =
    provinces.find((p) => p.slug === selectedSlug) || provinces[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 1. Header (โลโก้ Vite + ปุ่มตัวนับ + ปุ่มรีเฟรช) */}
        <Header
          count={count}
          onIncrement={() => setCount((c) => c + 1)}
          onRefresh={handleRefreshAll}
          loading={loading}
        />

        {/* 2. สถานะการเชื่อมต่อ Database (MongoDB Atlas + Yok API) */}
        <DatabaseStatus
          provincesCount={provinces.length}
          apiUrl={API_URL}
          error={error}
          yokStatus={{
            isOnline: yokData.isOnline,
            accommodationsCount: yokData.accommodations.length,
            guidesCount: yokData.guides.length,
            carsCount: yokData.cars.length,
          }}
        />

        {/* 3. กล่องวาดแผนที่ SVG สดจากฟิลด์ vectorData.d ของ MongoDB พร้อมข้อมูลเสริมของ Yok */}
        {currentProvince && (
          <ProvinceSvgViewer
            province={currentProvince}
            provinces={provinces}
            selectedSlug={selectedSlug}
            onSelectProvince={setSelectedSlug}
            accommodations={yokData.accommodations}
            guides={yokData.guides}
          />
        )}

        {/* 4. ตารางแสดงรายการ 77 จังหวัด พร้อมค้นหาและกรองภาค */}
        <ProvinceTable
          provinces={provinces}
          selectedSlug={selectedSlug}
          onSelectProvince={setSelectedSlug}
          accommodations={yokData.accommodations}
          guides={yokData.guides}
        />

        {/* 5. ส่วนท้าย */}
        <Footer />
      </div>
    </div>
  );
}
