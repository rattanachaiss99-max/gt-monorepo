/**
 * AppRoutes.jsx
 * -------------------------------------------------------------
 * จุดศูนย์กลางควบคุมระบบเส้นทาง (Routing) ทั้งหมดของโปรเจกต์
 * แบ่งสถาปัตยกรรม Layout 3 กลุ่มตามบทบาทการทำงาน:
 * 1. MainLayout: หน้าบริการท่องเที่ยวสาธารณะ พร้อม Responsive Header, Mobile Bottom Nav และ Rich Footer
 * 2. AuthLayout: หน้าสำหรับเข้าสู่ระบบและสมัครสมาชิก แบบ Clean & Minimal Focus
 * 3. AdminLayout: แผงควบคุมระบบหลังบ้านสำหรับผู้ดูแลระบบ (Admin Console) พร้อม Sidebar และ Route Guard
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import { MainLayout, AuthLayout, AdminLayout } from "../layouts";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { ItemVisibilityProvider } from "../context/ItemVisibilityContext";
import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
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
      <AuthProvider>
        <CartProvider>
          <ItemVisibilityProvider>
            <Routes>
            {/* 1. Public Portal Layout: หน้าสำหรับนักท่องเที่ยวและบริการทั่วไป */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/accommodations" element={<AccommodationPage />} />
              <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
              <Route path="/cars" element={<CarPage />} />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/guides" element={<GuidePage />} />
              <Route path="/guides/:id" element={<GuideDetailPage />} />
            </Route>

            {/* 2. Authentication Layout: หน้าเข้าสู่ระบบและสมัครสมาชิก */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* 3. Admin Backoffice Layout: ระบบจัดการหลังบ้าน (ป้องกันด้วย ProtectedRoute) */}
            <Route
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/provinces" element={<ProvinceMapPage />} />
              <Route path="/province" element={<Navigate to="/provinces" replace />} />
            </Route>
          </Routes>
          </ItemVisibilityProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
