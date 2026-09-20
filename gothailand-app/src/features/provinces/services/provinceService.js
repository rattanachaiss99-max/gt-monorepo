/**
 * provinceService.js
 * -------------------------------------------------------------
 * RESTful API Service สำหรับจัดการข้อมูล 77 จังหวัด และ SVG Map (Sprint 3)
 * ออกแบบตามมาตรฐาน HTTP Methods:
 *  - GET    → Read (อ่านข้อมูลทั้งหมด / รายจังหวัด / รูปภาพ SVG)
 *  - POST   → Create (สร้างข้อมูลจังหวัดและพิกัด SVG ใหม่)
 *  - PUT    → Full Update / Replace (แทนที่ข้อมูลทั้งก้อน)
 *  - PATCH  → Partial Update (แก้ไขเฉพาะฟิลด์ เช่น คำขวัญ, ไฮไลท์, หรือ SVG)
 *  - DELETE → Delete (พร้อม Master Data Protection ป้องกันการลบข้อมูลหลัก 77 จังหวัด)
 */
import { provinceApi, getProvinceApiUrl } from "../../../services/api";

/**
 * 1. GET - ดึงข้อมูล 77 จังหวัดทั้งหมด (รองรับ params: { region, search, q })
 */
export const getProvinces = async (params = {}) => {
  const response = await provinceApi.get("/provinces", { params });
  return response.data;
};

/**
 * 2. GET - ดึงข้อมูลจังหวัดรายตัวตาม Slug หรือ ID (เช่น "chiang-mai", "TH-50")
 */
export const getProvinceBySlug = async (slug) => {
  const response = await provinceApi.get(`/provinces/${slug}`);
  return response.data;
};

/**
 * 3. GET URL - คำนวณ URL ดึงรูปภาพ SVG ตรงๆ จาก Backend (สำหรับใส่ใน <img src="..." />)
 */
export const getProvinceSvgUrl = (slug, { fill = "#0284c7", stroke = "#0369a1", strokeWidth = 1.5 } = {}) => {
  const base = getProvinceApiUrl();
  const cleanBase = base.endsWith("/api") ? base : `${base}/api`;
  const encodedFill = encodeURIComponent(fill);
  const encodedStroke = encodeURIComponent(stroke);
  return `${cleanBase}/provinces/${slug}/svg?fill=${encodedFill}&stroke=${encodedStroke}&strokeWidth=${strokeWidth}`;
};

/**
 * 4. POST - สร้างข้อมูลจังหวัดและ SVG ใหม่ในฐานข้อมูล (Create)
 */
export const createProvince = async (provinceData) => {
  const response = await provinceApi.post("/provinces", provinceData);
  return response.data;
};

/**
 * 5. PUT - แทนที่ข้อมูลจังหวัดทั้งก้อน (Full Replacement Update)
 */
export const replaceProvince = async (slug, fullData) => {
  const response = await provinceApi.put(`/provinces/${slug}`, fullData);
  return response.data;
};

/**
 * 6. PATCH - อัปเดตเฉพาะฟิลด์ย่อย (Partial Update เช่น คำขวัญ, ข้อมูลท่องเที่ยว, หรือ SVG)
 */
export const updateProvince = async (slug, patchData) => {
  const response = await provinceApi.patch(`/provinces/${slug}`, patchData);
  return response.data;
};

/**
 * 7. DELETE - ลบข้อมูลจังหวัด (พร้อม Master Data Protection Guard)
 *    options: { soft: true } สำหรับ Soft Delete หรือ { force: true } สำหรับบังคับลบ
 */
export const deleteProvince = async (slug, options = {}) => {
  const response = await provinceApi.delete(`/provinces/${slug}`, { params: options });
  return response.data;
};

export default {
  getProvinces,
  getProvinceBySlug,
  getProvinceSvgUrl,
  createProvince,
  replaceProvince,
  updateProvince,
  deleteProvince,
};
