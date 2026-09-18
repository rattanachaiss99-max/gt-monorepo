/**
 * App.jsx
 * -------------------------------------------------------------
 * จุดเริ่มต้นหลักของแอปพลิเคชัน
 * ทำหน้าที่เรียกใช้ AppRoutes ซึ่งเป็นศูนย์กลางระบบ Routing
 * (ไฟล์เวอร์ชันเดิมสำรองไว้เรียบร้อยที่ App.old.jsx)
 */
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return <AppRoutes />;
}
