/**
 * api.js
 * -------------------------------------------------------------
 * Centralized API Client (Axios Instances ส่วนกลาง)
 *
 * สถาปัตยกรรมแบ่งแยก Backend 2 ระบบอย่างชัดเจน:
 * 1. Yok Core API (yokApi / default export `api`):
 *    - ให้บริการโมดูลหลัก: /cars (รถเช่า), /accommodations (ที่พัก), /guides (ไกด์), /bookings (การจอง), /users (ผู้ใช้)
 *    - Development: ถ้ามี VITE_YOK_API_URL ใน .env (เช่น http://localhost:5001) ให้ใช้ค่านั้น
 *      หากไม่มีจะเชื่อมตรงเข้า Render Cloud (https://gothailand-api.onrender.com/api) อัตโนมัติ
 *    - Production (Vercel): ใช้ Rewrite Proxy "/api/yok" เพื่อเลี่ยง CORS และลด Latency
 *
 * 2. Po Province API (provinceApi):
 *    - ให้บริการโมดูล: /provinces (จัดการข้อมูล 77 จังหวัด, Interactive SVG Map)
 *    - Development: VITE_PROVINCE_API_URL หรือ VITE_API_URL (เช่น http://localhost:5000/api)
 *    - Production: https://gothailand-31-po.onrender.com/api
 */
import axios from "axios";

// -------------------------------------------------------------
// 1. Helper คำนวณ Base URL ของแต่ละ Backend Service
// -------------------------------------------------------------
export const getYokApiUrl = () => {
  if (import.meta.env.VITE_YOK_API_URL) {
    const raw = import.meta.env.VITE_YOK_API_URL.replace(/\/+$/, "");
    return raw.endsWith("/api") ? raw : `${raw}/api`;
  }
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
    return raw.endsWith("/api") ? raw : `${raw}/api`;
  }
  // บน Vercel Production ให้วิ่งผ่าน Proxy /api/yok ตามที่กำหนดใน vercel.json
  if (
    typeof window !== "undefined" &&
    !window.location.hostname.includes("localhost")
  ) {
    return "/api/yok";
  }
  return "https://gothailand-api.onrender.com/api";
};

export const getProvinceApiUrl = () => {
  const raw =
    import.meta.env.VITE_PROVINCE_API_URL ||
    import.meta.env.VITE_API_URL ||
    "https://gothailand-api.onrender.com/api";
  const clean = raw.replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

// -------------------------------------------------------------
// 2. ฟังก์ชันแนบ Interceptors (Auth Token & Error Logging)
// -------------------------------------------------------------
const attachInterceptors = (instance, serviceName = "API") => {
  instance.interceptors.request.use(
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

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn(`🔒 [${serviceName}] Unauthorized (401): Token หมดอายุหรือไม่ถูกต้อง`);
        const isAuthEndpoint =
          error.config?.url?.includes('/auth/login') ||
          error.config?.url?.includes('/auth/register');
        if (!isAuthEndpoint) {
          // แจ้งเตือน session expired event
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
      } else {
        console.error(
          `❌ [${serviceName}] Error:`,
          error.response?.status,
          error.message,
        );
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

// -------------------------------------------------------------
// 3. สร้าง Axios Instances แยก Backend
// -------------------------------------------------------------

// Core Travel Services (Yok Backend): รถเช่า, ที่พัก, ไกด์, บุ๊กกิ้ง, ผู้ใช้
export const yokApi = attachInterceptors(
  axios.create({
    baseURL: getYokApiUrl(),
    timeout: 12000,
    headers: {
      "Content-Type": "application/json",
    },
  }),
  "YokCoreAPI",
);

// Province & Map Services (Po Backend): 77 จังหวัด, SVG Map
export const provinceApi = attachInterceptors(
  axios.create({
    baseURL: getProvinceApiUrl(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  }),
  "ProvinceAPI",
);

// Default export: ใช้ yokApi เพื่อให้ service ส่วนใหญ่ (cars, accommodations) เรียกใช้งานได้ทันที
export default yokApi;
