/**
 * provinceService.js
 * -------------------------------------------------------------
 * Service สำหรับจัดการข้อมูล 77 จังหวัด และข้อมูลแผนที่ (Feature-based Service)
 * 
 * ดึงข้อมูลผ่าน Central API Client (`api.js`)
 */
import api from "../../../services/api";

/**
 * ดึงข้อมูล 77 จังหวัดทั้งหมดพร้อมพิกัด SVG
 */
export const getProvinces = async () => {
  const response = await api.get("/provinces");
  return response.data;
};

/**
 * ดึงข้อมูลจังหวัดรายตัวตาม Slug หรือ ID
 */
export const getProvinceBySlug = async (slug) => {
  const response = await api.get(`/provinces/${slug}`);
  return response.data;
};
