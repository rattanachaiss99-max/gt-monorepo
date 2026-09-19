export default function DatabaseStatus({
  provincesCount = 0,
  apiUrl = "",
  error = null,
  yokStatus = null,
}) {
  const isConnected = provincesCount > 0;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* แถบหัวข้อ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-3 h-3 rounded-full ${
              isConnected
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                : "bg-amber-500 animate-pulse"
            }`}
          ></span>
          <h2 className="text-base font-bold text-slate-900">
            สถานะการเชื่อมต่อ Database
          </h2>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700">
          API: {apiUrl}/provinces
        </span>
      </div>

      {/* กริดข้อมูลการเชื่อมต่อ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
        <div>
          <span className="text-slate-400 block">Cluster</span>
          <span className="font-semibold text-slate-700">
            MongoDB Atlas (Sprint 2 DB)
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Database</span>
          <span className="font-semibold text-emerald-600 font-mono">
            gothailand_user
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Collection</span>
          <span className="font-semibold text-slate-700 font-mono">
            provinceknowledges
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">จำนวนจังหวัดที่โหลดได้</span>
          <span className="font-bold text-blue-600 text-sm">
            {provincesCount} / 77 จังหวัด
          </span>
        </div>
      </div>

      {/* สถานะบริการพาร์ทเนอร์ (Yok API บน Render) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              yokStatus?.isOnline ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
            }`}
          ></span>
          <span className="text-slate-500">
            Partner API (Render - Yok):
          </span>
          <span className="font-semibold text-slate-700">
            {yokStatus?.isOnline ? "เชื่อมต่อสำเร็จ" : "กำลังปลุก Server / รอเชื่อมต่อ"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span>🏨 ที่พัก: <b className="text-slate-800">{yokStatus?.accommodationsCount ?? 0}</b></span>
          <span>🧭 ไกด์: <b className="text-slate-800">{yokStatus?.guidesCount ?? 0}</b></span>
          <span>🚗 รถเช่า: <b className="text-slate-800">{yokStatus?.carsCount ?? 0}</b></span>
        </div>
      </div>

      {/* แจ้งเตือนข้อผิดพลาด (ถ้ามี) */}
      {error && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
          ⚠️ ข้อผิดพลาด: {error} (กรุณาเปิดรัน Backend: <code>npm run dev</code>{" "}
          ที่พอร์ต 5000)
        </div>
      )}
    </section>
  );
}
