import { useState } from "react";
import GuidesGallery from "../components/landing/GuidesGallery";
import WanderMoodChatPreview from "../components/landing/WanderMoodChatPreview";

const MOOD_OPTIONS = [
  {
    id: "heal",
    icon: "🌿",
    title: "พักใจ ปล่อยจอย ฮีลพลังงาน",
    subtitle: "แม่กำปอง • ดอยช้าง • บ้านไร่กองขิง",
    route: "/accommodations",
  },
  {
    id: "slow",
    icon: "☕",
    title: "สโลว์ไลฟ์",
    subtitle: "นิมมานฯ Specialty • ไร่ชา 101 • แม่สลอง",
    route: "/guides",
  },
  {
    id: "adventure",
    icon: "⚡",
    title: "สายลุย แอดเวนเจอร์",
    subtitle: "ดอยอินทนนท์ • กิ่วแม่ปาน • ภูชี้ฟ้า 360°",
    route: "/cars",
  },
  {
    id: "romantic",
    icon: "🌅",
    title: "โรแมนติก ดินเนอร์หรู",
    subtitle: "ดอยสุเทพวิวเมือง • ม่อนแจ่ม • สิงห์ปาร์ค",
    route: "/accommodations",
  },
  {
    id: "art",
    icon: "🎨",
    title: "เสพศิลป์ ถ่ายรูปเก๋",
    subtitle: "อุโบสถเงินวัดศรีสุพรรณ • วัดร่องขุ่น • บ้านดำ",
    route: "/guides",
  },
];

export default function LandingPage() {
  const [activeMood, setActiveMood] = useState("heal");

  return (
    <div className="py-6 sm:py-10">
      <div className="text-center px-4 max-w-5xl mx-auto mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-5 text-sm font-semibold tracking-wide text-rose-800 bg-rose-50 border border-rose-200/70 rounded-full shadow-xs">
          <span>🌿</span> ให้การเดินทาง เป็นยาวิเศษฮีลใจคุณ
        </div>

        <h1 className="text-3xl sm:5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-5 leading-tight sm:leading-tight">
          เหนื่อยไหมช่วงนี้?... แค่บอกความรู้สึก{" "}
          <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-600 to-orange-500">
            แล้วออกไปชาร์จพลังกับทริปที่ใช่สำหรับคุณ
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
          ไม่ต้องเหนื่อยกับการวางแผน ปล่อยให้ AI ช่วยคัดสรรสายลม แสงแดด
          ที่พักเงียบสงบ คาเฟ่สบายใจ
          และเส้นทางท่องเที่ยวที่จะช่วยคืนพลังบวกให้คุณอีกครั้ง
        </p>

        <div className="flex items-center justify-center gap-2 mb-4 text-xs sm:text-sm font-medium text-slate-500">
          <span className="text-rose-500">✦</span>
          <span>วางแผนด้วย MOOD ที่คุณต้องการ</span>
          <span className="text-rose-500">✦</span>
        </div>

        <div className="flex items-center sm:justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto overflow-x-auto sm:overflow-visible sm:flex-wrap px-4 sm:px-0 py-2 pb-3 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MOOD_OPTIONS.map((mood) => {
            const isActive = activeMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setActiveMood(mood.id)}
                className={`group shrink-0 snap-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl sm:rounded-full transition-all duration-200 text-left border flex flex-col items-start cursor-pointer ${
                  isActive
                    ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200 scale-102 sm:scale-105 ring-2 ring-rose-300 sm:ring-0"
                    : "bg-indigo-50/70 hover:bg-indigo-100/70 border-indigo-100/80 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold whitespace-nowrap">
                  <span>{mood.icon}</span>
                  <span>{mood.title}</span>
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] tracking-tight whitespace-nowrap mt-0.5 ${
                    isActive
                      ? "text-rose-100 font-medium"
                      : "text-slate-500 group-hover:text-slate-700"
                  }`}
                >
                  {mood.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        <WanderMoodChatPreview
          activeMood={activeMood}
          onMoodChange={setActiveMood}
        />
      </div>

      <GuidesGallery activeMood={activeMood} />
    </div>
  );
}
