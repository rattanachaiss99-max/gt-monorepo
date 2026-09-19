// Service สำหรับดึงข้อมูลจาก API ของคุณ Yok (gothailand-api.onrender.com)
import { getYokApiUrl } from "./api";

const YOK_API_ROOT = getYokApiUrl();


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

// แผนที่จับคู่ชื่อเมืองท่องเที่ยวพิเศษให้ตรงกับชื่อจังหวัดมาตรฐาน
const PROVINCE_ALIASES = {
  pattaya: ["chon-buri", "ชลบุรี", "chonburi"],
  huahin: ["prachuap-khiri-khan", "ประจวบคีรีขันธ์", "prachuapkhirikhan"],
  "hua hin": ["prachuap-khiri-khan", "ประจวบคีรีขันธ์", "prachuapkhirikhan"],
  samui: ["surat-thani", "สุราษฎร์ธานี", "suratthani"],
  "koh samui": ["surat-thani", "สุราษฎร์ธานี", "suratthani"],
  khaoyai: ["nakhon-ratchasima", "นครราชสีมา", "nakhonratchasima"],
  "khao yai": ["nakhon-ratchasima", "นครราชสีมา", "nakhonratchasima"],
  kohchang: ["trat", "ตราด"],
  "koh chang": ["trat", "ตราด"],
  ayutthaya: ["phra-nakhon-si-ayutthaya", "พระนครศรีอยุธยา", "phranakhonsiayutthaya"],
  betong: ["yala", "ยะลา"],
  hatyai: ["songkhla", "สงขลา"],
  "hat yai": ["songkhla", "สงขลา"],
};

/**
 * ฟังก์ชันตรวจสอบว่าชื่อ location/province ของ Yok ตรงกับจังหวัดที่เลือกหรือไม่
 * เช่น "Chiang Mai", "chiangmai", "เชียงใหม่", "Pattaya" -> "Chon Buri"
 */
export function matchProvince(locationStr, province) {
  if (!locationStr || !province) return false;

  const normalize = (s) => {
    if (typeof s === "object" && s !== null) {
      s = s.city || s.district || s.province || s.address_label || "";
    }
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\u0E00-\u0E7F]/g, "");
  };

  const cleanLoc = normalize(locationStr);
  const cleanNameEn = normalize(province.nameEn || province.name_en);
  const cleanNameTh = normalize(province.nameTh || province.name_th);
  const cleanSlug = normalize(province.slug);

  // ตรวจสอบชื่อตรงกันหรือมีส่วนประกอบของชื่อ
  if (
    cleanLoc === cleanNameEn ||
    cleanLoc === cleanNameTh ||
    cleanLoc === cleanSlug ||
    (cleanLoc && cleanNameEn && cleanLoc.includes(cleanNameEn)) ||
    (cleanLoc && cleanNameEn && cleanNameEn.includes(cleanLoc)) ||
    (cleanLoc && cleanNameTh && cleanLoc.includes(cleanNameTh)) ||
    (cleanLoc && cleanNameTh && cleanNameTh.includes(cleanLoc))
  ) {
    return true;
  }

  // ตรวจสอบกับชื่อเมืองท่องเที่ยวพิเศษ (Aliases)
  for (const [alias, provKeys] of Object.entries(PROVINCE_ALIASES)) {
    const cleanAlias = normalize(alias);
    if (cleanLoc.includes(cleanAlias)) {
      if (
        provKeys.some(
          (k) =>
            normalize(k) === cleanNameEn ||
            normalize(k) === cleanNameTh ||
            normalize(k) === cleanSlug
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * ฟังก์ชันตรวจสอบว่ารถเช่า (Car) ของ Yok ให้บริการในจังหวัดที่เลือกหรือไม่
 * รองรับทั้ง car.availableLocations, car.province, car.location
 */
export function matchCarProvince(car, province) {
  if (!car || !province) return false;
  if (car.province && matchProvince(car.province, province)) return true;
  if (car.location && matchProvince(car.location, province)) return true;
  if (Array.isArray(car.availableLocations)) {
    return car.availableLocations.some((loc) => matchProvince(loc, province));
  }
  return false;
}

