import { useState, useEffect } from "react";
import Header from "./Header";
import DatabaseStatus from "./DatabaseStatus";
import ProvinceSvgViewer from "./ProvinceSvgViewer";
import ProvinceTable from "./ProvinceTable";
import Footer from "./Footer";
import { TravelSearchBox, TravelSearchResultsTable } from "../../../components/common";
import { fetchYokServices } from "../../../services/yokService";
import { getProvinceApiUrl } from "../../../services/api";

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
  const [searchQuery, setSearchQuery] = useState(null);

  // ข้อมูลบริการจาก Yok API (Render)
  const [yokData, setYokData] = useState({
    accommodations: [],
    guides: [],
    cars: [],
    users: [],
    isOnline: false,
  });

  const API_URL = getProvinceApiUrl();

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

      if (
        provRes.status === "fulfilled" &&
        provRes.value?.success &&
        provRes.value?.provinces
      ) {
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
            if (!res.ok)
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            return res.json();
          }),
          fetchYokServices(),
        ]);

        if (ignore) return;

        if (
          provRes.status === "fulfilled" &&
          provRes.value?.success &&
          provRes.value?.provinces
        ) {
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

  // Callback เมื่อมีการอัปเดตข้อมูลจังหวัดผ่าน HTTP PATCH หรือ PUT
  const handleProvinceUpdated = (updatedDoc) => {
    if (!updatedDoc) return;
    setProvinces((prev) =>
      prev.map((p) =>
        p.slug === updatedDoc.slug ? { ...p, ...updatedDoc } : p,
      ),
    );
  };

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

        {/* สรุปสถานะภาพรวม 4 การ์ด (Status Overview Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              จังหวัดในระบบ
            </span>
            <div className="text-2xl font-black text-slate-800 mt-1">
              {provinces.length}{" "}
              <span className="text-xs font-normal text-slate-400">/ 77</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              ความพร้อม SVG
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {provinces.filter((p) => p.d || p.vectorData?.d).length}
              <span className="text-xs font-normal text-slate-400 ml-1">
                จังหวัด
              </span>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              มีคำขวัญ / ข้อมูลท่องเที่ยว
            </span>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {provinces.filter((p) => p.slogan || p.summary).length}
              <span className="text-xs font-normal text-slate-400 ml-1">
                จังหวัด
              </span>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              สถานะ BACKEND
            </span>
            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {error ? "ขัดข้อง" : "Online พร้อมใช้งาน"}
            </div>
          </div>
        </div>

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

        {/* 3. กล่องค้นหาบริการท่องเที่ยวส่วนกลาง (Universal Travel Search Box) */}
        <TravelSearchBox
          selectedProvince={selectedSlug}
          onProvinceChange={(slug) => {
            setSelectedSlug(slug);
            setSearchQuery((prev) =>
              prev ? { ...prev, provinceSlug: slug } : { provinceSlug: slug },
            );
          }}
          provinces={provinces}
          onSearchSubmit={(payload) => {
            setSearchQuery(payload);
            if (payload.provinceSlug) {
              setSelectedSlug(payload.provinceSlug);
            }
          }}
        />

        {/* 5. ตารางผลลัพธ์การค้นหาบริการท่องเที่ยว (Travel Search Results Table สไตล์ ProvinceTable) */}
        <TravelSearchResultsTable
          searchQuery={searchQuery}
          provinces={provinces}
          accommodations={yokData.accommodations}
          cars={yokData.cars}
          guides={yokData.guides}
          selectedSlug={selectedSlug}
          onSelectProvince={setSelectedSlug}
        />

        {/* 4. กล่องวาดแผนที่ SVG สดจากฟิลด์ vectorData.d ของ MongoDB พร้อมข้อมูลเสริมของ Yok */}
        {currentProvince && (
          <ProvinceSvgViewer
            province={currentProvince}
            provinces={provinces}
            selectedSlug={selectedSlug}
            onSelectProvince={setSelectedSlug}
            onUpdateProvince={handleProvinceUpdated}
            accommodations={yokData.accommodations}
            cars={yokData.cars}
            guides={yokData.guides}
          />
        )}

        {/* 6. ตารางแสดงรายการ 77 จังหวัด พร้อมค้นหาและกรองภาค */}
        <ProvinceTable
          provinces={provinces}
          selectedSlug={selectedSlug}
          onSelectProvince={setSelectedSlug}
          accommodations={yokData.accommodations}
          cars={yokData.cars}
          guides={yokData.guides}
        />

        {/* 5. ส่วนท้าย */}
        <Footer />
      </div>
    </div>
  );
}
