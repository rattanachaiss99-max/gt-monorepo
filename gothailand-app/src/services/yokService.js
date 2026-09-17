// Service สำหรับดึงข้อมูลจาก API ของคุณ Yok (gothailand-api.onrender.com)

const getBaseUrl = () => {
  if (import.meta.env.VITE_YOK_API_URL) {
    const raw = import.meta.env.VITE_YOK_API_URL.replace(/\/+$/, "");
    return raw.endsWith("/api") ? raw : `${raw}/api`;
  }
  // ถ้าเป็น Vercel Production ใช้ Rewrite Proxy /api/yok
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
    return "/api/yok";
  }
  return "https://gothailand-api.onrender.com/api";
};

const YOK_API_ROOT = getBaseUrl();

/**
 * ดึงข้อมูลบริการทั้งหมด (ที่พัก, ไกด์, รถเช่า, ผู้ใช้) จาก Yok API พร้อมกัน
 */
export async function fetchYokServices() {
  const result = {
    accommodations: [],
    guides: [],
    cars: [],
    users: [],
    isOnline: false,
    error: null,
  };

  try {
    const endpoints = [
      `${YOK_API_ROOT}/accommodations`,
      `${YOK_API_ROOT}/guides`,
      `${YOK_API_ROOT}/cars`,
      `${YOK_API_ROOT}/users`,
    ];

    const responses = await Promise.allSettled(
      endpoints.map((url) =>
        fetch(url, { signal: AbortSignal.timeout(10000) }).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
      )
    );

    if (responses[0].status === "fulfilled" && Array.isArray(responses[0].value)) {
      result.accommodations = responses[0].value;
      result.isOnline = true;
    }
    if (responses[1].status === "fulfilled" && Array.isArray(responses[1].value)) {
      result.guides = responses[1].value;
      result.isOnline = true;
    }
    if (responses[2].status === "fulfilled" && Array.isArray(responses[2].value)) {
      result.cars = responses[2].value;
      result.isOnline = true;
    }
    if (responses[3].status === "fulfilled" && Array.isArray(responses[3].value)) {
      result.users = responses[3].value;
    }

    return result;
  } catch (err) {
    console.warn("⚠️ [Yok API] ไม่สามารถดึงข้อมูลได้:", err.message);
    result.error = err.message;
    return result;
  }
}

/**
 * ฟังก์ชันตรวจสอบว่าชื่อ location/province ของ Yok ตรงกับจังหวัดที่เลือกหรือไม่
 * เช่น "Chiang Mai", "chiangmai", "เชียงใหม่"
 */
export function matchProvince(locationStr, province) {
  if (!locationStr || !province) return false;

  const normalize = (s) => (s || "").toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, "");

  const cleanLoc = normalize(locationStr);
  const cleanNameEn = normalize(province.nameEn);
  const cleanNameTh = normalize(province.nameTh);
  const cleanSlug = normalize(province.slug);

  return (
    cleanLoc === cleanNameEn ||
    cleanLoc === cleanNameTh ||
    cleanLoc === cleanSlug ||
    cleanLoc.includes(cleanNameEn) ||
    (cleanNameEn && cleanNameEn.includes(cleanLoc))
  );
}
