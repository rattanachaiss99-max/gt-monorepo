import { useState } from "react";
import { Link } from "react-router-dom";

// นำเข้ารูปภาพ CHIANG MAI
import imgLannaRiver from "../../assets/accommodations/lanna-riverside-boutique.jpg";
import imgRajapruek from "../../assets/guidesPicture/chiang-mai/Screenshot 2026-09-24 184031.png";

// นำเข้ารูปภาพ CHIANG RAI
import imgEmerald from "../../assets/accommodations/emerald-jungle-retreat.jpg";
import imgCRWhiteTemple from "../../assets/guidesPicture/Screenshot 2026-09-23 115313.png";
import imgCRPhuChiFa from "../../assets/guidesPicture/Screenshot 2026-09-23 115230.png";

const MOOD_CHAT_DATA = {
  heal: {
    energyLevel: 32,
    modeName: "โหมดฮีลลิ่งธรรมชาติ & สโลว์ไลฟ์",
    userRole: "คุณ (เหนื่อยล้าสะสม อยากพักใจ)",
    userMessage:
      "อยากไปนอนพักผ่อนวิถีชุมชนเรียบง่าย มีลำธารไหลผ่าน อากาศเย็นสบายทั้งปี สโลว์ไลฟ์ ปล่อยจอย ฮีลพลังงาน",
    aiReply:
      "รับฟังและเข้าใจความเหนื่อยล้าเลยครับ 🌿 จากการประมวลผล Vector Search ขอแนะนำทริปฮีลใจ 'ดอยช้าง & หุบเขาแม่สรวย' สัมผัสความเงียบสงบในอ้อมกอดขุนเขา ไอหมอกเย็นสบาย และกลิ่นอายกาแฟอาราบิกาแท้ เพื่อคืนพลังบวกให้คุณอย่างแท้จริง:",
    trip: {
      id: "cr-heal",
      provinceId: "chiang-rai",
      provinceName: "เชียงราย",
      provinceIcon: "🌸",
      badgeStyle: "bg-rose-50 text-rose-700 border-rose-200",
      matchScore: "78.45%",
      image: imgEmerald,
      duration: "3 วัน 2 คืน",
      title: "Doi Chang Mist Valley & Arabica Retreat",
      price: "฿2,450 / คืน",
      zone: "ดอยช้าง • หุบเขาแม่สรวย",
      day1: "จิบกาแฟสดอาราบิกาต้นตำรับดอยช้าง • ชมวิวทิวเขาป่าสนสูงเสียดฟ้า • เช็กอินคาเฟ่สไตล์ลอฟท์เหนือเมฆ",
      day2: "ล่องเรือสัมผัสไอเย็นริมแม่น้ำกก • แวะแช่น้ำแร่ธรรมชาติโป่งพระบาท • นอนดูดาวยามค่ำคืนท่ามกลางลมหนาว",
      density: "Mountain Sanctuary (เงียบสงบเป็นส่วนตัว)",
      route: "/accommodations",
    },
  },
  slow: {
    energyLevel: 45,
    modeName: "โหมดสโลว์ไลฟ์ จิบกาแฟ & ไร่ชา",
    userRole: "คุณ (ชะลอจังหวะชีวิต จิบกาแฟ)",
    userMessage:
      "อยากไปนั่งชิลจิบกาแฟสดบนดอย เที่ยวชมไร่ชาขั้นบันได Specialty Coffee เดินเล่นคาเฟ่สโลว์ไลฟ์ และดูทะเลหมอกยามเช้า",
    aiReply:
      "จัดทริปเพื่อการชะลอจังหวะชีวิตให้แล้วครับ ☕ Vector Search จับคู่ความต้องการของคุณกับ 'ย่านนิมมานเหมินท์ & ประตูท่าแพ' เพลิดเพลินกับกาแฟ Specialty Coffee และบรรยากาศเมืองเหนือแบบไม่ต้องเร่งรีบ:",
    trip: {
      id: "cm-slow",
      provinceId: "chiang-mai",
      provinceName: "เชียงใหม่",
      provinceIcon: "🌲",
      badgeStyle: "bg-emerald-50 text-emerald-800 border-emerald-200",
      matchScore: "72.18%",
      image: imgLannaRiver,
      duration: "2 วัน 1 คืน",
      title: "Nimman Specialty Coffee & Heritage Walk",
      price: "฿2,400 / คืน",
      zone: "ย่านนิมมานเหมินท์ • คูเมืองเก่าประตูท่าแพ",
      day1: "ตระเวนชิม Specialty Coffee ย่านนิมมานฯ • วันนิมมานคอมมูนิตี้มอลล์ • ถ่ายรูปกำแพงอิฐประตูท่าแพ",
      day2: "นั่งอ่านหนังสือริมแม่น้ำปิงกาดหลวง • จิบชาสมุนไพรท้องถิ่น • ปั่นจักรยานเลียบคูเมืองเก่า",
      density: "Cafe Hopping & Walkable (เดินเล่นสบายๆ)",
      route: "/guides",
    },
  },
  adventure: {
    energyLevel: 75,
    modeName: "โหมดสายลุย พิชิตยอดดอยสูง",
    userRole: "คุณ (สายแอดเวนเจอร์ ลุยป่าเขา)",
    userMessage:
      "อยากพิชิตยอดเขาสูง เดินป่าสัมผัสอากาศหนาว ชมวิวทิวทัศน์ 360 องศาเหนือทะเลหมอก และนาขั้นบันได",
    aiReply:
      "เติมอะดรีนาลีนกับทริปลุยยอดผาสูงเสียดฟ้ากันครับ! ⚡ Vector Search พบจุดที่ตรงใจคุณคือ 'ยอดผาภูชี้ฟ้า & ดอยผาตั้ง' สัมผัสความหนาวเหน็บและวิวทะเลหมอก 360 องศาเหนือแนวชายแดนไทย-ลาว:",
    trip: {
      id: "cr-adv",
      provinceId: "chiang-rai",
      provinceName: "เชียงราย",
      provinceIcon: "🌸",
      badgeStyle: "bg-rose-50 text-rose-700 border-rose-200",
      matchScore: "84.15%",
      image: imgCRPhuChiFa,
      duration: "3 วัน 2 คืน",
      title: "Phu Chi Fa & Pha Tang 360° Border Peak",
      price: "฿2,890 / ทริป",
      zone: "ยอดผาภูชี้ฟ้า • ภูชี้ดาว • ดอยผาตั้ง",
      day1: "เดินเทรคกิ้งขึ้นสู่ยอดผาภูชี้ฟ้ายามเช้ามืด • ชมทะเลหมอก 360 องศาเหนือพรมแดนไทย-ลาว • กางเต็นท์ดูดาวระยิบระยับ",
      day2: "นั่ง 4WD ลุยขึ้นยอดภูชี้ดาว • ชมผาบ่องประตูสยามดอยผาตั้ง • ชิมขาหมูหมั่นโถวยูนนานรสเลิศ",
      density: "ท้าทายธรรมชาติ สันเขาและหน้าผาสูงชัน",
      route: "/cars",
    },
  },
  romantic: {
    energyLevel: 55,
    modeName: "โหมดโรแมนติก ซันเซ็ท & ทะเลหมอก",
    userRole: "คุณ (พาคนพิเศษไปพักผ่อน)",
    userMessage:
      "อยากพาแฟนไปชมพระอาทิตย์ตกดิน ทะเลหมอกยามเย็น โรแมนติก ดินเนอร์ริมน้ำ หรือยอดดอยบรรยากาศส่วนตัว",
    aiReply:
      "ยินดีด้วยกับช่วงเวลาพิเศษครับ 🌅 ได้คัดสรรจุดชมวิวพระอาทิตย์ตกดินสุดโรแมนติก 'ลานชมวิวดอยสุเทพยามทไวไลท์ & ม่อนแจ่ม' ดื่มด่ำแสงสีทองยามอัสดงและดินเนอร์ใต้แสงดาวสุดประทับใจ:",
    trip: {
      id: "cm-rom",
      provinceId: "chiang-mai",
      provinceName: "เชียงใหม่",
      provinceIcon: "🌲",
      badgeStyle: "bg-emerald-50 text-emerald-800 border-emerald-200",
      matchScore: "67.12%",
      image: imgRajapruek,
      duration: "2 วัน 1 คืน",
      title: "Doi Suthep Sunset & Royal Flora Twilight",
      price: "฿3,800 / คืน",
      zone: "ลานชมวิวดอยสุเทพ • ม่อนแจ่ม • ดอยอ่างขาง",
      day1: "ชมวิวเมืองเชียงใหม่มุมสูงยามพระอาทิตย์ลับขอบฟ้า ลานดอยสุเทพ • ดินเนอร์ใต้แสงดาวริมน้ำปิง",
      day2: "ถ่ายรูปคู่แปลงดอกไม้เมืองหนาวดอยอ่างขาง • ชิมสตรอว์เบอร์รีสดจากไร่ • เดินเล่นสระบัวหอคำหลวง",
      density: "บรรยากาศส่วนตัว โรแมนติกวิวขุนเขา",
      route: "/accommodations",
    },
  },
  art: {
    energyLevel: 60,
    modeName: "โหมดเสพศิลป์ ไหว้พระ & งานคราฟต์",
    userRole: "คุณ (หลงใหลในศิลปวัฒนธรรมล้านนา)",
    userMessage:
      "อยากไปชมงานศิลปะระดับโลก ไหว้พระวัดสวย สถาปัตยกรรมวิจิตร ประติมากรรมโดดเด่น และงานคราฟต์ทำมือ",
    aiReply:
      "ขอชวนสัมผัสสุดยอดมหาพุทธศิลป์และงานศิลปะระดับโลกครับ 🎨 ขอแนะนำ 'วัดร่องขุ่น & พิพิธภัณฑ์บ้านดำ' สถาปัตยกรรมวิจิตรตระการตาที่ถ่ายทอดอัตลักษณ์เชิงปรัชญาอย่างลึกซึ้ง:",
    trip: {
      id: "cr-art",
      provinceId: "chiang-rai",
      provinceName: "เชียงราย",
      provinceIcon: "🌸",
      badgeStyle: "bg-rose-50 text-rose-700 border-rose-200",
      matchScore: "85.60%",
      image: imgCRWhiteTemple,
      duration: "2 วัน 1 คืน",
      title: "White Temple & Baandam Contemporary Masterpiece",
      price: "฿2,150 / ทริป",
      zone: "วัดร่องขุ่น • วัดร่องเสือเต้น • พิพิธภัณฑ์บ้านดำ",
      day1: "ชมมหาพุทธศิลป์ปูนปั้นสีขาวบริสุทธิ์ วัดร่องขุ่น • เยี่ยมชมพระวิหารสีน้ำเงิน วัดร่องเสือเต้น",
      day2: "เสพงานศิลปะเชิงปรัชญาและสถาปัตยกรรมไม้สีดำ พิพิธภัณฑ์บ้านดำ • แวะชมงานศิลปะคราฟต์ขัวศิลปะ",
      density: "แหล่งรวมศิลปินแห่งชาติและมาสเตอร์พีซระดับโลก",
      route: "/guides",
    },
  },
};

const SUGGESTED_CHIPS = [
  {
    icon: "🌸",
    label: "ดอยช้าง กาแฟอาราบิกา ไอหมอก เชียงราย",
    moodKey: "heal",
  },
  {
    icon: "🌲",
    label: "แม่กำปอง ลำธารป่าสน สวนสิริกิติ์ เชียงใหม่",
    moodKey: "heal",
  },
  {
    icon: "🌸",
    label: "ไร่ชา 101 ดอยแม่สลอง พระตำหนักดอยตุง เชียงราย",
    moodKey: "slow",
  },
  {
    icon: "🌲",
    label: "นิมมานฯ Specialty Coffee ประตูท่าแพ เชียงใหม่",
    moodKey: "slow",
  },
  {
    icon: "🌸",
    label: "พิชิตยอดผาภูชี้ฟ้า ทะเลหมอก 360° เชียงราย",
    moodKey: "adventure",
  },
  {
    icon: "🌲",
    label: "ยอดดอยอินทนนท์ กิ่วแม่ปาน ป่าบงเปียง เชียงใหม่",
    moodKey: "adventure",
  },
  {
    icon: "🌸",
    label: "มหาพุทธศิลป์วัดร่องขุ่น พิพิธภัณฑ์บ้านดำ เชียงราย",
    moodKey: "art",
  },
  {
    icon: "🌲",
    label: "อุโบสถเงินวัดศรีสุพรรณ วัดบ้านเด่น เชียงใหม่",
    moodKey: "art",
  },
];

export default function WanderMoodChatPreview({
  activeMood = "heal",
  onMoodChange,
}) {
  const [inputText, setInputText] = useState("");
  const moodData = MOOD_CHAT_DATA[activeMood] || MOOD_CHAT_DATA.heal;
  const currentTrip = moodData.trip;

  const handleChipClick = (chip) => {
    setInputText(chip.label);
    if (onMoodChange && chip.moodKey) {
      onMoodChange(chip.moodKey);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    setInputText("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 sm:my-10 px-0 sm:px-2">
      {/* Outer macOS Window Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl sm:shadow-2xl shadow-slate-200/60 p-3.5 sm:p-6 md:p-7 text-left transition-all duration-300">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-100">
          {/* Traffic Lights */}
          <div
            className="flex items-center gap-1.5 sm:gap-2"
            aria-hidden="true"
          >
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-400"></span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></span>
          </div>

          {/* Active Mode & Destination Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-rose-600 font-semibold truncate max-w-[170px] sm:max-w-none">
              {moodData.modeName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>{currentTrip.provinceIcon}</span>
              <span>{currentTrip.provinceName}</span>
            </span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="space-y-4 sm:space-y-6 my-4 sm:my-6">
          {/* 1. User Message (Right Side) */}
          <div className="flex flex-col items-end">
            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 mb-1.5 text-[11px] sm:text-xs text-slate-500">
              <span className="font-semibold text-slate-700 text-right truncate max-w-[200px] sm:max-w-none">
                {moodData.userRole}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">
                14:28 น.
              </span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-[10px] sm:text-xs shrink-0">
                🧑‍💻
              </div>
            </div>
            <div className="max-w-[92%] sm:max-w-xl md:max-w-2xl bg-indigo-50/70 border border-indigo-100/90 text-slate-800 rounded-2xl rounded-tr-xs p-3 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs text-left break-words">
              "{moodData.userMessage}"
            </div>
          </div>

          {/* 2. AI Message (Left Side) */}
          <div className="flex items-start gap-2 sm:gap-3">
            {/* AI Avatar */}
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-xs text-xs sm:text-sm font-bold mt-0.5">
              ✦
            </div>

            {/* AI Bubble Content */}
            <div className="flex-1 min-w-0 bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-3 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
              {/* Header inside AI bubble */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-rose-600 flex items-center gap-1 text-[11px] sm:text-xs">
                  ‹ GoThailand AI Guide
                </span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px] sm:text-[11px] shrink-0">
                  แมตช์ {currentTrip.matchScore} ({currentTrip.provinceIcon}{" "}
                  {currentTrip.provinceName})
                </span>
              </div>

              {/* AI Reply Text */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words whitespace-pre-line">
                {moodData.aiReply}
              </p>

              {/* Single Featured Recommendation Card */}
              <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 to-white p-3.5 sm:p-4.5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-5 items-stretch sm:items-start">
                  {/* Trip Thumbnail */}
                  <div className="relative w-full sm:w-48 md:w-56 h-44 sm:h-40 rounded-xl overflow-hidden shrink-0 bg-slate-200 shadow-inner">
                    <img
                      src={currentTrip.image}
                      alt={currentTrip.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold">
                      {currentTrip.duration}
                    </span>
                    <span
                      className={`absolute bottom-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs shadow-xs text-slate-800`}
                    >
                      <span>{currentTrip.provinceIcon}</span>
                      <span>{currentTrip.provinceName}</span>
                    </span>
                  </div>

                  {/* Trip Info */}
                  <div className="flex-1 min-w-0 w-full space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug min-w-0">
                        {currentTrip.title}
                      </h4>
                      <span className="font-black text-rose-600 text-sm sm:text-base shrink-0">
                        {currentTrip.price}
                      </span>
                    </div>

                    {/* Travel Zone Tag */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200/60">
                      <span className="text-rose-500">📍 โซนไฮไลต์:</span>
                      <span className="truncate">{currentTrip.zone}</span>
                    </div>

                    {/* Day 1 & Day 2 Highlights */}
                    <div className="text-[11px] sm:text-xs text-slate-600 space-y-1.5 leading-snug">
                      <div className="flex items-start gap-1.5">
                        <span className="text-teal-500 font-bold shrink-0">
                          •
                        </span>
                        <span className="break-words">
                          <strong className="text-slate-800">Day 1:</strong>{" "}
                          {currentTrip.day1}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold shrink-0">
                          •
                        </span>
                        <span className="break-words">
                          <strong className="text-slate-800">Day 2:</strong>{" "}
                          {currentTrip.day2}
                        </span>
                      </div>
                    </div>

                    {/* Footer with density & button */}
                    <div className="pt-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 text-[10px] sm:text-[11px] truncate flex items-center gap-1">
                        <span>⛺</span>
                        <span className="truncate">{currentTrip.density}</span>
                      </span>
                      <Link
                        to={currentTrip.route}
                        className="font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 group shrink-0 text-xs whitespace-nowrap ml-auto"
                      >
                        <span>ดูรายละเอียดทริปนี้</span>
                        <span className="transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
