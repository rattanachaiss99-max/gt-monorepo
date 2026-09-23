/**
 * ProvinceMapPage.jsx
 * -------------------------------------------------------------
 * หน้าจัดการข้อมูลจังหวัด (Route: /provinces)
 * ทำหน้าที่เป็น "Page Component" ที่ดึงฟีเจอร์จัดการข้อมูลจังหวัดมาแสดงผล
 * เพื่อให้โค้ดเป็นระเบียบและอธิบายการทำงานแบบแยกส่วนได้ง่าย
 */
import ProvinceMapDemo from "../components/ProvinceMapDemo";

export default function ProvinceMapPage() {
  return (
    <section>
      {/* เรนเดอร์ฟีเจอร์จัดการข้อมูลจังหวัด */}
      <ProvinceMapDemo />
    </section>
  );
}

