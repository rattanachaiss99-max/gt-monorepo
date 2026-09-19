/**
 * provinceService.js
 * -------------------------------------------------------------
 * Service สำหรับจัดการข้อมูล 77 จังหวัด และข้อมูลแผนที่ (Feature-based Service)
 * 
 * ดึงข้อมูลผ่าน Central API Client (`api.js`)
 */
import api from "../../../services/api";

/**
 * ดึงข้อมูล 77 จังหวัดทั้งหมด (รองรับการส่ง params เช่น { region, search })
 */
export const getProvinces = async (params = {}) => {
  const response = await api.get("/provinces", { params });
  return response.data;
};

/**
 * ดึงข้อมูลจังหวัดรายตัวตาม Slug หรือ ID (เช่น "chiang-mai", 50, "TH-50")
 */
export const getProvinceBySlug = async (slug) => {
  const response = await api.get(`/provinces/${slug}`);
  return response.data;
};

/**
 * อัปเดตข้อมูลจังหวัดสำหรับ Admin (เช่น อัปเดตคำขวัญ, ไฮไลท์ หรือข้อมูลการเดินทาง)
 */
export const updateProvince = async (id, updateData) => {
  const response = await api.patch(`/provinces/${id}`, updateData);
  return response.data;
};
