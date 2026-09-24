import { useState } from "react";
import { Link } from "react-router-dom";

// นำเข้ารูปภาพที่พักสำหรับแสดงเป็นการ์ดทริปแนะนำ
import imgDoiMist from "../../assets/accommodations/doi-mist-mountain-lodge.jpg";
import imgLannaRiver from "../../assets/accommodations/lanna-riverside-boutique.jpg";
import imgKhaoyai from "../../assets/accommodations/khaoyai-vineyard-villas.jpg";
import imgAmanpuri from "../../assets/accommodations/amanpuri-retreat-villas.jpg";
import imgAyutthaya from "../../assets/accommodations/ayutthaya-heritage-riverside.jpg";

export const MOOD_CHAT_DATA = {
  heal: {
    energyLevel: 32,
    modeName: "โหมดฮีลลิ่งธรรมชาติ",
    userRole: "คุณ (เหนื่อยล้าสะสม)",
    userMessage:
      "ช่วงนี้ทำงานเหนื่อยมาก รู้สึก Burnout อยากได้ที่พักเงียบๆ ใกล้ชิดต้นไม้ ลมเย็นๆ มีกาแฟดริปให้จิบ งบคนละ 3,000 ต่อคืน ในไทย 3 วัน 2 คืน ครับ",
    matchScore: "98.4%",
    aiReply:
      "รับฟังและเข้าใจความเหนื่อยล้าเลยครับ 🌿 ความตึงเครียดระดับนี้ต้องการ 'ความเงียบของป่าสนและไอหมอกยามเช้า' เพื่อฟื้นฟูประสาทสัมผัส ขอแนะนำ 'หมู่บ้านแม่กำปอง & ระเบียงดาว เชียงดาว' พักใจท่ามกลางเสียงลำธาร พร้อมจัดตารางแบบไม่เร่งรีบ (Pacing Score: 10/10 ชิลสุด):",
    trip: {
      image: imgDoiMist,
      duration: "3 วัน 2 คืน",
      title: "Chiang Mai Solitude & Fog Retreat",
      price: "฿2,850 / คืน",
      day1: "จิบกาแฟดริปริมลำธารแม่กำปอง • ฟังเสียงน้ำไหล • แช่อ่างน้ำแร่ออนเซ็นธรรมชาติ",
      day2: "Forest Therapy เดินป่าบำบัด • ชมวิวดอยหลวงเชียงดาว • Stargazing ดูดาวหน้าเต็นท์แก้ว",
      density: "ความหนาแน่นผู้คน: ต่ำมาก (Hidden Retreat)",
      route: "/accommodations",
    },
  },
  slow: {
    energyLevel: 45,
    modeName: "โหมดสโลว์ไลฟ์ & หนังสือ",
    userRole: "คุณ (ต้องการพักผ่อนเงียบๆ)",
    userMessage:
      "อยากไปนั่งนิ่งๆ อ่านหนังสือเล่มโปรดริมแม่น้ำ จิบชาร้อนๆ ไม่ต้องเร่งรีบ ไม่เน้นเที่ยวเยอะ มีที่ไหนสงบๆ แนะนำไหมครับ",
    matchScore: "96.8%",
    aiReply:
      "จัดทริปเพื่อการชะลอจังหวะชีวิตให้แล้วครับ ☕ การได้นั่งมองสายน้ำไหลเอื่อยๆ จะช่วยปรับคลื่นสมองให้สงบ ขอแนะนำที่พักบูทีกล้านนาริมแม่น้ำปิง พร้อมมุมอ่านหนังสือและเซ็ตชาดอกไม้ท้องถิ่น:",
    trip: {
      image: imgLannaRiver,
      duration: "2 วัน 1 คืน",
      title: "Lanna Riverside Slow Reading Escape",
      price: "฿2,400 / คืน",
      day1: "นั่งอ่านหนังสือใต้ร่มไม้ริมน้ำ • จิบชาดอกเก๊กฮวยออร์แกนิก • ล่องเรือชมวิถีชีวิตโบราณ",
      day2: "ปั่นจักรยานชุมชนวัดเกต • แวะคาเฟ่เซรามิกทำมือ • ซื้อขนมไทยโบราณกลับบ้าน",
      density: "ความหนาแน่นผู้คน: ปานกลางค่อนข้างสงบ",
      route: "/accommodations",
    },
  },
  adventure: {
    energyLevel: 68,
    modeName: "โหมดชาร์จพลังลุย & ธรรมชาติ",
    userRole: "คุณ (อยากปลดปล่อยพลัง)",
    userMessage:
      "เบื่อชีวิตจำเจในเมือง อยากขับรถออกไปสูดอากาศ ลุยเส้นทางธรรมชาติ ขี่จักรยาน หรือเดินเทรลสนุกๆ ขอที่เที่ยวไม่ไกลมากครับ",
    matchScore: "97.5%",
    aiReply:
      "มาเติมอะดรีนาลีนกับทริปเขาใหญ่กันครับ! ⚡ ป่าเขียวขจี อากาศสดชื่น เส้นทางขับรถชมวิวไร่องุ่น พร้อมจุดเดินป่าศึกษาธรรมชาติและแคมป์ปิ้งสุดมันส์:",
    trip: {
      image: imgKhaoyai,
      duration: "2 วัน 1 คืน",
      title: "Khao Yai Explorer & Vineyard Trail",
      price: "฿3,200 / คืน",
      day1: "ขับรถชมวิวผากล้วยไม้ • ส่องสัตว์ยามค่ำคืน (Night Safari) • นอนวิลล่าวิวเทือกเขา",
      day2: "ปั่นกราเวลไบค์รอบไร่องุ่น • แวะถ่ายรูปจุดชมวิวกิโล 30 • ลิ้มลองสเต็กเนื้อท้องถิ่น",
      density: "ความหนาแน่นผู้คน: อากาศถ่ายเท กว้างขวาง",
      route: "/cars",
    },
  },
  romantic: {
    energyLevel: 55,
    modeName: "โหมดพระอาทิตย์ตก & ดินเนอร์หรู",
    userRole: "คุณ (พาคนพิเศษไปพักผ่อน)",
    userMessage:
      "อยากพาแฟนไปฉลองวันเกิด ขอที่พักติดทะเล บรรยากาศส่วนตัวสุดๆ นั่งดูพระอาทิตย์ตกดิน ดินเนอร์ริมหาด มีที่ไหนแนะนำบ้างครับ",
    matchScore: "99.1%",
    aiReply:
      "ยินดีด้วยกับโอกาสพิเศษครับ 🌅 ได้คัดสรรพูลวิลล่าริมหาดส่วนตัวในภูเก็ต ที่มองเห็นวิวแหลมและพระอาทิตย์ลับขอบฟ้าอันงดงาม พร้อมบริการจัดเทียนดินเนอร์ริมชายหาดใต้แสงดาว:",
    trip: {
      image: imgAmanpuri,
      duration: "3 วัน 2 คืน",
      title: "Phuket Sunset Private Sanctuary",
      price: "฿6,500 / คืน",
      day1: "เช็คอินพูลวิลล่าหน้าหาดส่วนตัว • จิบค็อกเทลยามเย็นชมแสงทไวไลท์ • ดินเนอร์ซีฟู้ดบาร์บีคิว",
      day2: "ล่องเรือยอชต์ส่วนตัวชมอ่าวพังงา • สปาอโรมาบำบัดคู่รัก • นั่งชมภาพยนตร์กลางแจ้งริมหาด",
      density: "ความหนาแน่นผู้คน: เอ็กซ์คลูซีฟ มีความเป็นส่วนตัวสูง",
      route: "/accommodations",
    },
  },
  art: {
    energyLevel: 60,
    modeName: "โหมดสุนทรียะศิลป์ & วัฒนธรรม",
    userRole: "คุณ (หลงใหลในศิลปะและประวัติศาสตร์)",
    userMessage:
      "อยากไปเสพงานศิลป์ เดินดูสถาปัตยกรรมเก่า ถ่ายรูปโทนฟิล์มเก๋ๆ และได้เรียนรู้วัฒนธรรมท้องถิ่นด้วย แนะนำเส้นทางไหนดีครับ",
    matchScore: "98.0%",
    aiReply:
      "ขอชวนย้อนเวลาสัมผัสมนต์เสน่ห์อยุธยาและเชียงรายครับ 🎨 สถาปัตยกรรมอิฐมอญโบราณผสมผสานกับแกลเลอรีร่วมสมัย คาเฟ่รีโนเวท และมุมแสงเงาที่ถ่ายรูปฟิล์มออกมามีมิติสวยงาม:",
    trip: {
      image: imgAyutthaya,
      duration: "2 วัน 1 คืน",
      title: "Ayutthaya Heritage & Contemporary Art Trail",
      price: "฿2,200 / คืน",
      day1: "ชมแสงเย็นวัดไชยวัฒนาราม • เยี่ยมชมหอศิลป์ร่วมสมัย • พักรีสอร์ตริมแม่น้ำเจ้าพระยา",
      day2: "ทัวร์คาเฟ่สไตล์โมเดิร์นคราฟต์ • เวิร์กช็อปทำสายไหมโบราณ • ถ่ายรูปสตรีทอาร์ตย่านเก่า",
      density: "ความหนาแน่นผู้คน: เหมาะกับการเดินเพลินๆ",
      route: "/guides",
    },
  },
};

const SUGGESTED_CHIPS = [
  { icon: "🌿", label: "อยากได้ที่เที่ยวคนไม่พลุกพล่าน", moodKey: "heal" },
  { icon: "📷", label: "ขอพิกัดถ่ายรูปฟิล์ม vibe ดีๆ", moodKey: "art" },
  { icon: "🍷", label: "พาแฟนไปฉลองครบรอบสุดโรแมนติก", moodKey: "romantic" },
  {
    icon: "⛰️",
    label: "ขอแบบไม่ต้องลางาน เสาร์-อาทิตย์",
    moodKey: "adventure",
  },
];

export default function WanderMoodChatPreview({
  activeMood = "heal",
  onMoodChange,
}) {
  const [inputText, setInputText] = useState("");
  const moodData = MOOD_CHAT_DATA[activeMood] || MOOD_CHAT_DATA.heal;

  const handleChipClick = (chip) => {
    setInputText(chip.label);
    if (onMoodChange && chip.moodKey) {
      onMoodChange(chip.moodKey);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    // เคลียร์ข้อความเพื่อจำลองการส่ง
    setInputText("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 sm:my-10 px-0 sm:px-2">
      {/* Outer macOS Window Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl sm:shadow-2xl shadow-slate-200/60 p-3.5 sm:p-6 md:p-7 text-left transition-all duration-300">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-100">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-400"></span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></span>
          </div>

          {/* Active Mode Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-rose-600 font-semibold truncate max-w-[170px] sm:max-w-none">
              {moodData.modeName}
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
              <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">14:28 น.</span>
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
                <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[10px] sm:text-[11px] shrink-0">
                  แมตช์สถานที่ {moodData.matchScore}
                </span>
              </div>

              {/* AI Reply Text */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                {moodData.aiReply}
              </p>

              {/* Embedded Recommendation Card */}
              <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/60 to-white p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start">
                  {/* Trip Thumbnail */}
                  <div className="relative w-full sm:w-44 md:w-48 h-40 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden shrink-0 bg-slate-200 shadow-inner">
                    <img
                      src={moodData.trip.image}
                      alt={moodData.trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 sm:px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold">
                      {moodData.trip.duration}
                    </span>
                  </div>

                  {/* Trip Info */}
                  <div className="flex-1 min-w-0 w-full space-y-2 sm:space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug min-w-0">
                        {moodData.trip.title}
                      </h4>
                      <span className="font-bold text-rose-600 text-xs sm:text-sm shrink-0">
                        {moodData.trip.price}
                      </span>
                    </div>

                    <div className="text-[11px] sm:text-xs text-slate-600 space-y-1.5 leading-snug">
                      <div className="flex items-start gap-1.5">
                        <span className="text-teal-500 font-bold shrink-0">•</span>
                        <span className="break-words">
                          <strong className="text-slate-800">Day 1:</strong>{" "}
                          {moodData.trip.day1}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span className="break-words">
                          <strong className="text-slate-800">Day 2:</strong>{" "}
                          {moodData.trip.day2}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-t border-slate-100 text-[11px] min-w-0">
                      <div className="flex-1 min-w-0 flex items-center gap-1 text-slate-500 text-[10px] sm:text-[11px]">
                        <span className="shrink-0">⛺</span>
                        <span className="truncate">{moodData.trip.density}</span>
                      </div>
                      <Link
                        to={moodData.trip.route}
                        className="font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 group shrink-0 text-xs sm:text-[11px] whitespace-nowrap ml-auto"
                      >
                        <span>ดูรายละเอียดทริป</span>
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

        {/* Quick Suggestion Chips (ลองกดถามต่อ:) */}
        {/* <div className="pt-2 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
              ลองกดถามต่อ:
            </span>
            {SUGGESTED_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors"
              >
                <span>{chip.icon}</span>
                <span>"{chip.label}"</span>
              </button>
            ))}
          </div>
        </div> */}

        {/* Input Bar Form */}
        {/* <form onSubmit={handleSend} className="relative flex items-center">
          <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200/90 rounded-full pl-4 pr-14 py-2 sm:py-2.5 focus-within:border-rose-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-100 transition-all">
            <span className="text-rose-500 text-sm sm:text-base mr-2">🎙️</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="อยากไปนั่งมองทะเลเฉยๆ จิบม็อกเทล ฟังเพลงแจ๊สค่ำๆ"
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            aria-label="ส่งข้อความถาม AI"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 translate-x-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form> */}
      </div>
    </div>
  );
}
