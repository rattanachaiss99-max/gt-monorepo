export default function LandingPage() {
  return (
    <div className="py-12 sm:py-20 text-center">
      <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-amber-900 bg-amber-100 rounded-full">
        🇹🇭 ยินดีต้อนรับสู่ Go Thailand
      </div>
      
      <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-6">
        เว็บแอปพลิเคชันท่องเที่ยวไทยครบวงจร
      </h1>
      
      <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed mb-8">
        ศูนย์รวมข้อมูลการท่องเที่ยวไทย ทั้งแผนที่เชิงลึก 77 จังหวัด แนะนำที่พัก 
        บริการไกด์นำเที่ยว และรถเช่า เพื่อการเดินทางที่สะดวกและราบรื่น
      </p>

      <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xs text-slate-500 text-sm">
        💡 <em>(พื้นที่ Landing Page นี้สามารถต่อยอดเพิ่ม Hero Banner, ข้อมูลแนะนำ หรือฟีเจอร์เด่นอื่นๆ ได้ในอนาคต)</em>
      </div>
    </div>
  );
}
