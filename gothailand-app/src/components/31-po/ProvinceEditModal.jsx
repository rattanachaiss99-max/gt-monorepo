import { useState } from "react";
import { updateProvince, replaceProvince } from "../../features/provinces/services/provinceService";

/**
 * ProvinceEditModal Component
 * -------------------------------------------------------------
 * Modal สำหรับสาธิตและใช้งาน HTTP Methods: PUT (Full Update) และ PATCH (Partial Update)
 * อนุญาตให้แก้ไขคำขวัญ, ข้อมูลท่องเที่ยว, อาหารเด่น และไฮไลท์ของจังหวัดที่กำลังเลือก
 */
export default function ProvinceEditModal({
  province,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [method, setMethod] = useState("PATCH"); // 'PATCH' หรือ 'PUT'
  const [slogan, setSlogan] = useState(province?.slogan || "");
  const [summary, setSummary] = useState(province?.summary || "");
  const [travelTips, setTravelTips] = useState(province?.travelTips || "");
  const [highlights, setHighlights] = useState(
    Array.isArray(province?.highlights) ? province.highlights.join(", ") : ""
  );
  const [signatureFood, setSignatureFood] = useState(
    Array.isArray(province?.signatureFood) ? province.signatureFood.join(", ") : ""
  );

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen || !province) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const highlightsArr = highlights
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const foodArr = signatureFood
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      let result;
      if (method === "PATCH") {
        // HTTP PATCH: ส่งเฉพาะฟิลด์ที่มีการเปลี่ยนแปลง
        const patchData = {
          slogan,
          summary,
          travelTips,
          highlights: highlightsArr,
          signatureFood: foodArr,
        };
        result = await updateProvince(province.slug, patchData);
      } else {
        // HTTP PUT: ส่งข้อมูลทั้งก้อนเพื่อแทนที่
        const fullData = {
          ...province,
          slogan,
          summary,
          travelTips,
          highlights: highlightsArr,
          signatureFood: foodArr,
        };
        result = await replaceProvince(province.slug, fullData);
      }

      setFeedback({
        type: "success",
        message: `✅ เรียกใช้ HTTP ${method} สำเร็จ! อัปเดตข้อมูล "${province.nameTh}" เรียบร้อย`,
      });

      // แจ้ง Parent Component ให้อัปเดต State ทันที
      if (onSuccess && result?.province) {
        onSuccess(result.province);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setFeedback({
        type: "error",
        message: `❌ เกิดข้อผิดพลาด (${method}): ${err.response?.data?.error || err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              ✏️ จัดการข้อมูลจังหวัด:
              <span className="text-blue-600 font-semibold">{province.nameTh}</span>
              <span className="text-xs text-slate-400 font-mono">({province.slug})</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              ทดสอบการส่งคำขอแบบ RESTful HTTP Methods ไปยัง Backend
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Method Selector */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-slate-700">เลือก HTTP Method:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMethod("PATCH")}
                className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                  method === "PATCH"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                PATCH (Partial)
              </button>
              <button
                type="button"
                onClick={() => setMethod("PUT")}
                className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                  method === "PUT"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                PUT (Replace)
              </button>
            </div>
          </div>

          {/* Feedback Alert */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium ${
                feedback.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Slogan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              คำขวัญประจำจังหวัด (slogan):
            </label>
            <textarea
              rows="2"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
              placeholder="กรอกคำขวัญ..."
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ข้อมูลสรุป / จุดเด่น (summary):
            </label>
            <textarea
              rows="2"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
              placeholder="กรอกข้อมูลภาพรวม..."
            />
          </div>

          {/* Travel Tips */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              คำแนะนำการท่องเที่ยว (travelTips):
            </label>
            <input
              type="text"
              value={travelTips}
              onChange={(e) => setTravelTips(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
              placeholder="เช่น เที่ยวได้ตลอดปี ช่วงฤดูหนาวอากาศดีที่สุด..."
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              สถานที่ไฮไลท์ (คั่นด้วยจุลภาค ,):
            </label>
            <input
              type="text"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
              placeholder="เช่น ดอยสุเทพ, นิมมานเหมินทร์, ม่อนแจ่ม"
            />
          </div>

          {/* Signature Food */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              อาหารเด่นประจำถิ่น (คั่นด้วยจุลภาค ,):
            </label>
            <input
              type="text"
              value={signatureFood}
              onChange={(e) => setSignatureFood(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
              placeholder="เช่น ข้าวซอยไก่, น้ำพริกหนุ่ม, ไส้อั่ว"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg font-bold text-white transition-all shadow-xs flex items-center gap-1.5 ${
                method === "PATCH"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  กำลังบันทึก ({method})...
                </>
              ) : (
                <>💾 บันทึกข้อมูลด้วย HTTP {method}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
