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

// กำหนดจาก .env
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://gothailand-api.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor ขาเข้า (Request): สำหรับแนบ Auth Token ในอนาคต
api.interceptors.request.use(
  (config) => {
    // เช่น const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor ขาออก (Response): จัดการ Error ภาพรวม (เช่น 401 Unauthorized, Server Down)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export default api;
