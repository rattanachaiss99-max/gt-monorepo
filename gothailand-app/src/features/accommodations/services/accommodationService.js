/**
 * accommodationService.js
 * -------------------------------------------------------------
 * Service สำหรับจัดการข้อมูลที่พักท่องเที่ยว (Feature-based Service)
 * 
 * ใช้ Central API Client (`api.js`) แทนการ Hardcode URL
 * เพื่อให้อธิบายทีมและดูแลรักษาโค้ด (Maintain) ได้ง่าย
 */
import api from "../../../services/api";

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
  try {
    const response = await api.get(`/accommodations/${idOrSlug}`);
    if (response.data && (response.data.name || response.data._id)) {
      return response.data;
    }
  } catch {
    // หาก backend ไม่ได้เปิด route /accommodations/:id ให้ทำการค้นหาจาก list รวม
  }

  const all = await getAccommodations();
  const normalizedSearch = String(idOrSlug).toLowerCase().trim();
  const found = (all || []).find(
    (item) =>
      (item.slug && String(item.slug).toLowerCase() === normalizedSearch) ||
      (item.id && String(item.id).toLowerCase() === normalizedSearch) ||
      String(item._id) === normalizedSearch
  );

  if (found) return found;
  throw new Error(`ไม่พบข้อมูลที่พักรหัส "${idOrSlug}"`);
};

export default {
  getAccommodations,
  getAccommodationById,
};
