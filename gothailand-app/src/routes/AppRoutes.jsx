/**
 * AppRoutes.jsx
 * -------------------------------------------------------------
 * จุดศูนย์กลางควบคุมระบบเส้นทาง (Routing) ทั้งหมดของโปรเจกต์
 * จัดการให้หน้าทั้งหมดแสดงผลภายใต้ MainLayout เดียวกัน
 * 
 * จุดเด่นสำหรับการอธิบายทีม:
 * 1. ควบคุม Navigation ทั้งหมดจากจุดเดียว (Single Source of Truth)
 * 2. แต่ละหน้าใช้ Layout ร่วมกันอัตโนมัติผ่าน <Outlet />
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage";
import ProvinceMapPage from "../features/provinces/pages/ProvinceMapPage";
import AccommodationPage from "../features/accommodations/pages/AccommodationPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ครอบทุกหน้าด้วย MainLayout เพื่อให้มี Header/Footer ร่วมกัน */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/provinces" element={<ProvinceMapPage />} />
          <Route path="/accommodations" element={<AccommodationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
