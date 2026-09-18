import ProvinceMapDemo from "../../../components/31-po/ProvinceMapDemo";

export default function ProvinceMapPage() {
  return (
    <section>
      {/* ส่วนหัวของหน้า */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          🗺️ ข้อมูลและแผนที่ 77 จังหวัด
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          ระบบแสดงผลแผนที่เชิงโต้ตอบและข้อมูลจังหวัดจากฐานข้อมูล
        </p>
      </div>

      {/* เรนเดอร์ฟีเจอร์แผนที่ */}
      <ProvinceMapDemo />
    </section>
  );
}
