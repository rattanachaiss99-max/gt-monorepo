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
 * ดึงข้อมูลที่พักตาม ID
 */
export const getAccommodationById = async (id) => {
  const response = await api.get(`/accommodations/${id}`);
  return response.data;
};
