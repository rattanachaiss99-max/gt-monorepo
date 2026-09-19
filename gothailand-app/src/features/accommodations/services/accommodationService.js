/**
 * accommodationService.js
 * -------------------------------------------------------------
 * Service สำหรับจัดการข้อมูลที่พักท่องเที่ยว (Feature-based Service)
 * 
 * ใช้ Central API Client (`api.js`) แทนการ Hardcode URL
 * เพื่อให้อธิบายทีมและดูแลรักษาโค้ด (Maintain) ได้ง่าย
 */
import api from "../../../services/api";
import { findByIdOrSlug } from "../../../utils/findByIdOrSlug";

/**
 * ดึงรายการที่พักท่องเที่ยวทั้งหมด
 */
export const getAccommodations = async () => {
  const response = await api.get("/accommodations");
  return response.data;
};

/**
 * ดึงข้อมูลที่พักตาม ID หรือ Slug
 * รองรับทั้งการดึงตรงจาก Endpoint /accommodations/:id (หาก backend มี)
 * และการค้นหาจากรายการที่พักทั้งหมดด้วย slug, id, หรือ _id
 */
export const getAccommodationById = async (idOrSlug) => {
  let directError = null;
  try {
    const response = await api.get(`/accommodations/${idOrSlug}`);
    if (response.data && (response.data.name || response.data._id)) {
      return response.data;
    }
  } catch (err) {
    directError = err;
    // 404 แปลว่า backend ไม่ได้เปิด route /accommodations/:id ไว้ — fallback ต่อได้เลยเงียบๆ
    // ส่วน status อื่น (500, timeout, network error) คือความล้มเหลวจริงที่ควร log ไว้
    if (err?.response?.status !== 404) {
      console.error(`accommodationService: direct lookup for "${idOrSlug}" failed`, err);
    }
  }

  const all = await getAccommodations();
  const found = findByIdOrSlug(all, idOrSlug);

  if (found) return found;
  // ถ้าการค้นหาโดยตรงล้มเหลวด้วยเหตุผลอื่นที่ไม่ใช่ route หาย
  // ให้โยน error จริงออกไปแทนที่จะบอกแค่ "not found" แบบทั่วไป
  if (directError && directError?.response?.status !== 404) {
    throw directError;
  }
  throw new Error(`ไม่พบข้อมูลที่พักรหัส "${idOrSlug}"`);
};

export default {
  getAccommodations,
  getAccommodationById,
};
