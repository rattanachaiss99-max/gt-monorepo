import GuidesGallery from "../components/landing/GuidesGallery";

export default function LandingPage() {
  return (
    <div className="py-6 sm:py-10">
      {/* Hero Welcome Section */}
      <div className="text-center px-4 max-w-4xl mx-auto mb-8 sm:mb-12">
        <div className="inline-block px-4 py-1.5 mb-5 text-sm font-semibold tracking-wide text-amber-900 bg-amber-100 rounded-full shadow-xs">
          🇹🇭 ยินดีต้อนรับสู่ Go Thailand
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
          เว็บแอปพลิเคชันท่องเที่ยวไทยครบวงจร
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-600 leading-relaxed mb-8">
          ศูนย์รวมข้อมูลการท่องเที่ยวไทย ทั้งแผนที่เชิงลึก 77 จังหวัด
          แนะนำที่พัก บริการไกด์นำเที่ยว และรถเช่า พร้อมระบบ AI
          ช่วยวางแผนการเดินทางอัจฉริยะ
        </p>
      </div>

      <GuidesGallery />
    </div>
  );
}
