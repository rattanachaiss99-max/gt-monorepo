/**
 * api.js
 * -------------------------------------------------------------
 * Centralized API Client (Axios Instance ส่วนกลาง)
 *
 * หลักการสำคัญตาม Architecture (หัวข้อที่ 7):
 * 1. รวมการตั้งค่า Base URL, Timeout และ Header ไว้ที่เดียว
 * 2. ป้องกันไม่ให้ Component หรือ Page ยิง URL แบบ Hardcode กระจัดกระจาย
 * 3. รองรับการใส่ Interceptors เพื่อจัดการ Token และ Error ส่วนกลางในอนาคต
 */
import axios from "axios";

// กำหนด Base URL (ตัด trailing slash และเติม /api ให้อัตโนมัติหากยังไม่มี)
const rawUrl =
  import.meta.env.VITE_API_URL || "https://gothailand-api.onrender.com/api";
const cleanUrl = rawUrl.replace(/\/+$/, "");
const BASE_URL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor ขาเข้า (Request): ตรวจสอบและแนบ Token จากระบบสมาชิก (S2/S3) อัตโนมัติ
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("gt_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//จัดการ Error ภาพรวม (เช่น 401 Unauthorized, Server Down)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export default api;
