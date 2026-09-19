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
import ScrollToTop from "../components/common/ScrollToTop";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage";
import ProvinceMapPage from "../features/provinces/pages/ProvinceMapPage";
import AccommodationPage from "../features/accommodations/pages/AccommodationPage";
import AccommodationDetailPage from "../features/accommodations/pages/AccommodationDetailPage";
import CarPage from "../features/cars/pages/CarPage";
import CarDetailPage from "../features/cars/pages/CarDetailPage";
import GuidePage from "../features/guides/pages/GuidePage";
import GuideDetailPage from "../features/guides/pages/GuideDetailPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ครอบทุกหน้าด้วย MainLayout เพื่อให้มี Header/Footer ร่วมกัน */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/provinces" element={<ProvinceMapPage />} />
          <Route path="/accommodations" element={<AccommodationPage />} />
          <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
          <Route path="/cars" element={<CarPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/guides" element={<GuidePage />} />
          <Route path="/guides/:id" element={<GuideDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
