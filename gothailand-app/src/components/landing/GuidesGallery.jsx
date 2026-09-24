import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

// ==========================================
// 1. นำเข้ารูปภาพ CHIANG RAI (6 ภาพ)
// ==========================================
import imgSinghaPark from "../../assets/guidesPicture/Screenshot 2026-09-23 115230.png";
import imgWatPhraKaew from "../../assets/guidesPicture/Screenshot 2026-09-23 115313.png";
import imgLannaCostume from "../../assets/guidesPicture/Screenshot 2026-09-23 115344.png";
import imgHillTribe from "../../assets/guidesPicture/Screenshot 2026-09-23 115405.png";
import imgHorseMonk from "../../assets/guidesPicture/Screenshot 2026-09-23 115418.png";
import imgBaanDam from "../../assets/guidesPicture/Screenshot 2026-09-23 115435.png";

// ==========================================
// 2. นำเข้ารูปภาพ CHIANG MAI (6 ภาพ)
// ==========================================
import imgDoiSuthep from "../../assets/guidesPicture/chiang-mai/Screenshot 2026-09-24 183953.png";
import imgRajapruek from "../../assets/guidesPicture/chiang-mai/Screenshot 2026-09-24 184031.png";
import imgCityArtsCenter from "../../assets/guidesPicture/chiang-mai/Screenshot 2026-09-24 184052.png";
import imgWatPhraSingh from "../../assets/guidesPicture/chiang-mai/Screenshot 2026-09-24 184112.png";
import imgWatChediLuang from "../../assets/guidesPicture/chiang-mai/Screenshot 2026-09-24 184136.png";
import imgWatUmong from "../../assets/guidesPicture/chiang-mai/Screenshot 2026-09-24 184212.png";

// ==========================================
// 3. ข้อมูลคลังภาพและทริปท่องเที่ยว (12 รายการ)
// ==========================================
const GALLERY_ITEMS = [
  // --- CHIANG MAI (เชียงใหม่ 6 รายการ) ---
  {
    id: 1,
    provinceId: "chiang-mai",
    provinceName: "เชียงใหม่",
    provinceIcon: "🌲",
    title: "วัดพระธาตุดอยสุเทพราชวรวิหาร",
    subtitle: "พระธาตุเจดีย์ทองอร่าม บันไดนาค 300 ขั้น ปูชนียสถานคู่บ้านคู่เมืองเชียงใหม่",
    category: "culture",
    categoryLabel: "ศิลปวัฒนธรรม & วัด",
    location: "ดอยสุเทพ อ.เมือง, เชียงใหม่",
    description:
      "สักการะองค์พระธาตุดอยสุเทพสีทองสุกปลั่ง พระธาตุประจำปีมะแม บูชาด้วยดอกบัวคู่ลานประทักษิณ พร้อมจุดชมวิวมุมสูงที่มองเห็นตัวเมืองเชียงใหม่และทิวเขาพาโนรามาสุดสายตา",
    tags: ["ดอยสุเทพ", "พระธาตุปีมะแม", "วัดคู่เมือง", "จุดชมวิวเมือง"],
    moods: ["art", "romantic", "slow", "heal", "adventure"],
    image: imgDoiSuthep,
    alt: "วัดพระธาตุดอยสุเทพราชวรวิหาร พระธาตุเจดีย์ทองคำ เชียงใหม่",
    guideRoute: "/guides?province=Chiang%20Mai",
  },
  {
    id: 2,
    provinceId: "chiang-mai",
    provinceName: "เชียงใหม่",
    provinceIcon: "🌲",
    title: "หอคำหลวง อุทยานหลวงราชพฤกษ์",
    subtitle: "มหาราชวังล้านนาไม้สักทอง สะท้อนเงาสระบัวและทุ่งดอกไม้นานาพรรณ",
    category: "nature",
    categoryLabel: "ธรรมชาติ & สถาปัตยกรรม",
    location: "ต.แม่เหียะ อ.เมือง, เชียงใหม่",
    description:
      "ชมมหาพุทธศิลป์สถาปัตยกรรมล้านนาโบราณทรงคุณค่า สร้างด้วยไม้สักทองแกะสลักอ่อนช้อยปิดทองคำแท้ ตระการตาท่ามกลางสวนไม้ดอกเมืองหนาว สระบัวหลวงสะท้อนเงาอาคารยามแดดร่มลมตก",
    tags: ["หอคำหลวง", "อุทยานหลวงราชพฤกษ์", "สถาปัตยกรรมล้านนา", "สวนดอกไม้"],
    moods: ["heal", "romantic", "art", "slow"],
    image: imgRajapruek,
    alt: "หอคำหลวง อุทยานหลวงราชพฤกษ์ เชียงใหม่",
    guideRoute: "/guides?province=Chiang%20Mai",
  },
  {
    id: 3,
    provinceId: "chiang-mai",
    provinceName: "เชียงใหม่",
    provinceIcon: "🌲",
    title: "หอศิลปวัฒนธรรมเมืองเชียงใหม่",
    subtitle: "อาคารคลาสสิกโคโลเนียล มิวเซียมรวบรวมรากเหง้า 700 ปีแห่งนครพิงค์",
    category: "heritage",
    categoryLabel: "ประวัติศาสตร์ & พิพิธภัณฑ์",
    location: "กลางเวียง (หลังอนุสาวรีย์สามกษัตริย์), เชียงใหม่",
    description:
      "ศาลากลางหลังเดิมสไตล์โคโลเนียลที่ได้รับการอนุรักษ์อย่างทรงคุณค่า จัดแสดงนิทรรศการมัลติมีเดียมีชีวิต ถ่ายทอดประวัติศาสตร์การสร้างเมืองเชียงใหม่ กฎหมายมังรายศาสตร์ และจิตวิญญาณแห่งล้านนา",
    tags: ["หอศิลปวัฒนธรรม", "อนุสาวรีย์สามกษัตริย์", "ประวัติศาสตร์ล้านนา", "พิพิธภัณฑ์"],
    moods: ["art", "slow", "heal"],
    image: imgCityArtsCenter,
    alt: "หอศิลปวัฒนธรรมเมืองเชียงใหม่ สถาปัตยกรรมโคโลเนียล",
    guideRoute: "/guides?province=Chiang%20Mai",
  },
  {
    id: 4,
    provinceId: "chiang-mai",
    provinceName: "เชียงใหม่",
    provinceIcon: "🌲",
    title: "วิหารลายคำ วัดพระสิงห์วรมหาวิหาร",
    subtitle: "ประดิษฐานพระพุทธสิหิงค์ & ภาพจิตรกรรมฝาผนังล้านนาชั้นเอก",
    category: "culture",
    categoryLabel: "ศิลปวัฒนธรรม & วัด",
    location: "ถนนสามล้าน คูเมือง, เชียงใหม่",
    description:
      "พระอารามหลวงชั้นเอกใจกลางคูเมือง โดดเด่นด้วยวิหารลายคำไม้สักทองแกะสลักอ่อนช้อย จิตรกรรมฝาผนังลายคำชาดทองคำแท้เล่าเรื่องสุวรรณหงส์ และพระธาตุเจดีย์หลวงทองคำประจำปีมะโรง",
    tags: ["วัดพระสิงห์", "พระพุทธสิหิงค์", "วิหารลายคำ", "จิตรกรรมล้านนา"],
    moods: ["art", "slow", "heal"],
    image: imgWatPhraSingh,
    alt: "วิหารลายคำและพระธาตุเจดีย์ วัดพระสิงห์วรมหาวิหาร เชียงใหม่",
    guideRoute: "/guides?province=Chiang%20Mai",
  },
  {
    id: 5,
    provinceId: "chiang-mai",
    provinceName: "เชียงใหม่",
    provinceIcon: "🌲",
    title: "วิหารหลวง วัดเจดีย์หลวงวรวิหาร",
    subtitle: "เสาอินทขิลหลักเมืองเชียงใหม่ & เจดีย์หลวงโบราณที่ยิ่งใหญ่ที่สุด",
    category: "culture",
    categoryLabel: "ศิลปวัฒนธรรม & มรดก",
    location: "ถนนพระปกเกล้า กลางเวียง, เชียงใหม่",
    description:
      "กราบพระประธานปางมารวิชัยทองอร่ามภายในวิหารหลวง เสาไม้มหึมาประดับลวดลายทอง สักการะเสาอินทขิล (เสาหลักเมืองเชียงใหม่) พร้อมชมเจดีย์หลวงโบราณอายุ 600 ปีที่เคยประดิษฐานพระแก้วมรกต",
    tags: ["วัดเจดีย์หลวง", "เสาอินทขิล", "เสาหลักเมือง", "โบราณสถานกลางเวียง"],
    moods: ["art", "heal", "slow", "romantic"],
    image: imgWatChediLuang,
    alt: "วิหารหลวงและพระประธาน วัดเจดีย์หลวงวรวิหาร เชียงใหม่",
    guideRoute: "/guides?province=Chiang%20Mai",
  },
  {
    id: 6,
    provinceId: "chiang-mai",
    provinceName: "เชียงใหม่",
    provinceIcon: "🌲",
    title: "วัดอุโมงค์ สวนพุทธธรรม",
    subtitle: "อุโมงค์โบราณ 700 ปี มอสเขียวขจีกลางป่าร่มรื่น สวรรค์แห่งการฮีลใจ",
    category: "nature",
    categoryLabel: "ธรรมชาติ & พักใจฮีลพลัง",
    location: "เชิงดอยสุเทพ ต.สุเทพ, เชียงใหม่",
    description:
      "สัมผัสความสงบวิเวกท่ามกลางผืนป่าเชิงดอยสุเทพ เดินลอดอุโมงค์ดินโบราณที่มีช่องประดิษฐานพระพุทธรูป ผนังอิฐปกคลุมด้วยมอสและเฟิร์นเขียวขจี อากาศเย็นสดชื่น เหมาะแก่การนั่งสมาธิและฟื้นฟูจิตใจ",
    tags: ["วัดอุโมงค์", "สวนพุทธธรรม", "ฮีลใจ", "ป่ากลางกรุง", "ธรรมชาติ"],
    moods: ["heal", "slow", "romantic", "adventure", "art"],
    image: imgWatUmong,
    alt: "วัดอุโมงค์ สวนพุทธธรรม อุโมงค์อิฐโบราณมอสเขียว เชียงใหม่",
    guideRoute: "/guides?province=Chiang%20Mai",
  },

  // --- CHIANG RAI (เชียงราย 6 รายการ) ---
  {
    id: 7,
    provinceId: "chiang-rai",
    provinceName: "เชียงราย",
    provinceIcon: "🌸",
    title: "สิงห์ปาร์ค เชียงราย (Singha Park)",
    subtitle: "ทุ่งดอกไม้หลากสีสัน & ไร่ชากว้างสุดสายตา",
    category: "nature",
    categoryLabel: "ธรรมชาติ & วิวทิวทัศน์",
    location: "อ.เมือง, เชียงราย",
    description:
      "ชมทุ่งดอกคอสมอสและพรรณไม้นานาพันธุ์บานสะพรั่งรายล้อมด้วยทิวเขา พร้อมกิจกรรมนั่งรถรางชมไร่ชาอู่หลง สัมผัสบรรยากาศอันสดชื่นและจุดเช็คอินถ่ายรูปยอดนิยมระดับสากล",
    tags: ["ทุ่งดอกไม้", "ไร่ชา", "เชียงราย", "จุดถ่ายรูปสวย"],
    moods: ["heal", "romantic", "slow", "adventure"],
    image: imgSinghaPark,
    alt: "สิงห์ปาร์ค เชียงราย ทุ่งดอกไม้และทิวทัศน์ภูเขา",
    guideRoute: "/guides?province=Chiang%20Rai",
  },
  {
    id: 8,
    provinceId: "chiang-rai",
    provinceName: "เชียงราย",
    provinceIcon: "🌸",
    title: "พระพุทธรตนากร นวุตติวัสสานุสรณ์มงคล",
    subtitle: "พระหยกเชียงราย วัดพระแก้ว มรดกพุทธศิลป์ล้านนา",
    category: "culture",
    categoryLabel: "ศิลปวัฒนธรรม & วัด",
    location: "วัดพระแก้ว, เชียงราย",
    description:
      "กราบสักการะ 'พระหยกเชียงราย' พระพุทธรูปหยกเขียวแท้จากแคนาดา แกะสลักด้วยพุทธศิลป์เชียงแสนอันอ่อนช้อยวิจิตร ประดิษฐาน ณ หอพระหยก วัดพระแก้วอันทรงคุณค่าทางประวัติศาสตร์",
    tags: ["วัดพระแก้ว", "พระหยก", "ศิลปะล้านนา", "ไหว้พระขอพร"],
    moods: ["art", "slow", "heal"],
    image: imgWatPhraKaew,
    alt: "พระหยกเชียงราย วัดพระแก้ว",
    guideRoute: "/guides?province=Chiang%20Rai",
  },
  {
    id: 9,
    provinceId: "chiang-rai",
    provinceName: "เชียงราย",
    provinceIcon: "🌸",
    title: "นิทรรศการเครื่องแต่งกายราชสำนักล้านนา",
    subtitle: "มรดกสิ่งทอโบราณ ผ้าทอยกดอก และราชบัลลังก์ทอง",
    category: "heritage",
    categoryLabel: "ประวัติศาสตร์ & ศิลปะ",
    location: "พิพิธภัณฑ์วัฒนธรรม, เชียงราย",
    description:
      "สัมผัสความประณีตแห่งอาณาจักรล้านนาโบราณ ชมการจัดแสดงฉลองพระองค์เจ้านายฝ่ายเหนือ ผ้าซิ่นตีนจก ลวดลายทอมือชั้นสูง และราชบัลลังก์แกะสลักปิดทองสะท้อนความรุ่งเรืองในอดีต",
    tags: ["ผ้าทอล้านนา", "ราชสำนัก", "โบราณวัตถุ", "มรดกทางวัฒนธรรม"],
    moods: ["art", "slow", "romantic"],
    image: imgLannaCostume,
    alt: "นิทรรศการเครื่องแต่งกายราชสำนักล้านนา",
    guideRoute: "/guides?province=Chiang%20Rai",
  },
  {
    id: 10,
    provinceId: "chiang-rai",
    provinceName: "เชียงราย",
    provinceIcon: "🌸",
    title: "วิถีชีวิตและภูมิปัญญาชนเผ่ากะเหรี่ยง",
    subtitle: "บันทึกจิตรกรรมและอัตลักษณ์ชุมชนชาวเขาบนดอย",
    category: "community",
    categoryLabel: "วิถีชุมชน & ชนเผ่า",
    location: "ศูนย์วัฒนธรรมชนเผ่า, เชียงราย",
    description:
      "เรียนรู้วิถีชีวิตดั้งเดิม ประเพณี การทอผ้ากี่เอว และการอยู่ร่วมกับผืนป่าของพี่น้องชาวไทยภูเขา ผ่านนิทรรศการ ภาพลายเส้นจิตรกรรม และเครื่องมือเครื่องใช้พื้นถิ่นที่หาชมได้ยาก",
    tags: ["วิถีชนเผ่า", "ชาวกะเหรี่ยง", "ภูมิปัญญาชาวบ้าน", "วัฒนธรรมพื้นถิ่น"],
    moods: ["adventure", "heal", "art", "slow"],
    image: imgHillTribe,
    alt: "ภาพวาดและนิทรรศการวิถีชีวิตชนเผ่ากะเหรี่ยง",
    guideRoute: "/guides?province=Chiang%20Rai",
  },
  {
    id: 11,
    provinceId: "chiang-rai",
    provinceName: "เชียงราย",
    provinceIcon: "🌸",
    title: "พระขี่ม้าบิณฑบาต วัดถ้ำป่าอาชาทอง",
    subtitle: "เอกลักษณ์ศรัทธาหนึ่งเดียวในสยาม ณ ดอยแม่จัน",
    category: "culture",
    categoryLabel: "ศิลปวัฒนธรรม & วิถีศรัทธา",
    location: "อ.แม่จัน, เชียงราย",
    description:
      "สัมผัสภาพความประทับใจยามเช้าอันเป็นเอกลักษณ์ เมื่อพระภิกษุสงฆ์และสามเณรขี่ม้าออกรับบิณฑบาตจากชาวบ้านและชาวไทยภูเขา ท่ามกลางหุบเขาและม่านหมอก เป็นภาพสะท้อนแห่งศรัทธาที่ทั่วโลกจับตามอง",
    tags: ["วัดถ้ำป่าอาชาทอง", "พระขี่ม้า", "แม่จัน", "ประเพณีท้องถิ่น"],
    moods: ["slow", "heal", "adventure"],
    image: imgHorseMonk,
    alt: "พระขี่ม้าบิณฑบาต วัดถ้ำป่าอาชาทอง เชียงราย",
    guideRoute: "/guides?province=Chiang%20Rai",
  },
  {
    id: 12,
    provinceId: "chiang-rai",
    provinceName: "เชียงราย",
    provinceIcon: "🌸",
    title: "พิพิธภัณฑ์บ้านดำ (Baan Dam Museum)",
    subtitle: "มหากาพย์ผลงานจิตรกรรมและประติมากรรม อ.ถวัลย์ ดัชนี",
    category: "heritage",
    categoryLabel: "ประวัติศาสตร์ & ศิลปะ",
    location: "อ.เมือง, เชียงราย",
    description:
      "ชมกลุ่มสถาปัตยกรรมล้านนาประยุกต์โทนสีดำสนิทกว่า 40 หลัง ผลงานสร้างสรรค์ของศิลปินแห่งชาติ อ.ถวัลย์ ดัชนี ภายในรวบรวมงานไม้แกะสลัก เขาสัตว์ และภาพวาดเชิงปรัชญาพุทธศิลป์ที่ลึกซึ้ง",
    tags: ["บ้านดำ", "ถวัลย์ ดัชนี", "ศิลปะร่วมสมัย", "สถาปัตยกรรม"],
    moods: ["art", "adventure", "romantic", "slow"],
    image: imgBaanDam,
    alt: "พิพิธภัณฑ์บ้านดำ เชียงราย",
    guideRoute: "/guides?province=Chiang%20Rai",
  },
];

const MOOD_META = {
  heal: {
    icon: "🌿",
    title: "พักใจ ปล่อยจอย ฮีลพลังงาน",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
  },
  slow: {
    icon: "☕",
    title: "สโลว์ไลฟ์ สบายๆ",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  adventure: {
    icon: "⚡",
    title: "สายลุย แอดเวนเจอร์",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
  },
  romantic: {
    icon: "🌅",
    title: "โรแมนติก ซันเซ็ท",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
  },
  art: {
    icon: "🎨",
    title: "เสพศิลป์ ถ่ายรูปเก๋",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export default function GuidesGallery({
  activeMood = "heal",
}) {
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const currentMoodInfo = MOOD_META[activeMood] || MOOD_META.heal;

  // กรองรายการตาม activeMood และจัดคละสถานที่ทั้งเชียงใหม่และเชียงรายให้สมดุล
  const filteredItems = useMemo(() => {
    const items = GALLERY_ITEMS.filter((item) => item.moods.includes(activeMood));
    const cmItems = items.filter((item) => item.provinceId === "chiang-mai");
    const crItems = items.filter((item) => item.provinceId === "chiang-rai");
    const mixed = [];
    const maxLen = Math.max(cmItems.length, crItems.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < cmItems.length) mixed.push(cmItems[i]);
      if (i < crItems.length) mixed.push(crItems[i]);
    }
    return mixed;
  }, [activeMood]);

  const activeItem =
    activeItemIndex !== null ? filteredItems[activeItemIndex] : null;

  const totalFiltered = filteredItems.length;

  // ควบคุมการเปลี่ยนภาพใน Lightbox (ถัดไป)
  const handleNext = () => {
    setActiveItemIndex((prev) =>
      prev !== null ? (prev + 1) % totalFiltered : null,
    );
  };

  // ควบคุมการเปลี่ยนภาพใน Lightbox (ย้อนกลับ)
  const handlePrev = () => {
    setActiveItemIndex((prev) =>
      prev !== null ? (prev - 1 + totalFiltered) % totalFiltered : null,
    );
  };

  // จัดการคีย์ลัด Escape, ArrowRight, ArrowLeft
  useEffect(() => {
    if (activeItemIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveItemIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveItemIndex((prev) =>
          prev !== null ? (prev + 1) % totalFiltered : null,
        );
      } else if (e.key === "ArrowLeft") {
        setActiveItemIndex((prev) =>
          prev !== null ? (prev - 1 + totalFiltered) % totalFiltered : null,
        );
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeItemIndex, totalFiltered]);

  return (
    <section
      aria-label="คลังภาพความประทับใจการท่องเที่ยวไทย"
      className="mt-12 sm:mt-16 pt-10 sm:pt-14 border-t border-slate-200/80 max-w-6xl mx-auto px-4"
    >
      {/* ========================================================
           1. SECTION HEADER & DYNAMIC MOOD BADGE
           ======================================================== */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 mb-3 text-xs sm:text-sm font-extrabold tracking-wide text-amber-800 bg-amber-50 border border-amber-200/80 rounded-full shadow-xs">
          <span>📸</span> รวมภาพและทริปแนะนำท่องเที่ยวไทย (Travel Guides & Inspiring Gallery)
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          ภาพบันทึกความประทับใจแห่งล้านนา
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          สัมผัสภาพจริงของสถานที่ท่องเที่ยวระดับมาสเตอร์พีซ ทั้งเชียงใหม่และเชียงราย
          คัดสรรให้สอดคล้องกับความรู้สึกและ MOOD การเดินทางของคุณ
        </p>

        {/* Dynamic Mood Status Pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 rounded-2xl text-xs sm:text-sm shadow-xs">
          <span className="text-base">{currentMoodInfo.icon}</span>
          <span className="font-semibold text-slate-700">
            คัดสรรสถานที่ตาม MOOD:
          </span>
          <strong className="font-extrabold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-lg">
            {currentMoodInfo.title}
          </strong>
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full ml-1">
            {filteredItems.length} สถานที่
          </span>
        </div>
      </div>

      {/* ========================================================
           2. RESPONSIVE IMAGE GALLERY GRID
           ======================================================== */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
          <span className="text-3xl mb-2 block">🔍</span>
          <p className="font-bold text-slate-700 text-sm">
            ไม่พบสถานที่ท่องเที่ยวสำหรับ MOOD นี้
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {filteredItems.map((item, index) => {
            return (
              <article
                key={item.id}
                onClick={() => setActiveItemIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveItemIndex(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`เปิดดูภาพ ${item.title}`}
                className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300/80 transition-all duration-300 cursor-pointer focus:outline-hidden focus:ring-3 focus:ring-amber-400"
              >
                {/* Image Container with Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

                  {/* Top Badge: Province */}
                  <div className="absolute top-3.5 left-3.5 pointer-events-none">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-black/50 backdrop-blur-md text-white border border-white/10 shadow-xs">
                      <span>{item.provinceIcon}</span>
                      <span>{item.provinceName}</span>
                    </span>
                  </div>

                  {/* Hover Zoom Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-black/60 backdrop-blur-md shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                      <span>คลิกเพื่อดูภาพเต็ม</span>
                    </span>
                  </div>

                  {/* Bottom Card Title & Subtitle */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
                      <span>📍</span>
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold leading-snug tracking-tight text-white group-hover:text-amber-300 transition-colors duration-200 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-200/90 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Footer Details */}
                <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-0.5">
                    ดูรายละเอียด
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ========================================================
           4. LIGHTBOX MODAL OVERLAY (ป๊อปอัปภาพใหญ่)
           ======================================================== */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setActiveItemIndex(null)}
        >
          {/* Modal Card */}
          <div
            className="relative max-w-5xl w-full bg-slate-900 text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col lg:flex-row max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setActiveItemIndex(null)}
              aria-label="ปิดหน้าต่างรูปภาพ"
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/70 hover:bg-slate-800 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Lightbox Main Image Frame */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[280px] sm:min-h-[380px] lg:min-h-[500px] overflow-hidden select-none">
              <img
                src={activeItem.image}
                alt={activeItem.alt}
                className="w-full h-full max-h-[55vh] lg:max-h-[85vh] object-contain transition-all duration-300"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="ดูภาพก่อนหน้า"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="ดูภาพถัดไป"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Image Counter Badge */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-slate-200 border border-white/10">
                {activeItemIndex + 1} / {filteredItems.length}
              </div>
            </div>

            {/* Lightbox Information Sidebar */}
            <div className="w-full lg:w-88 sm:p-6 p-5 flex flex-col justify-between bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto">
              <div>
                {/* Category & Location */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span>{activeItem.provinceIcon}</span>
                    <span>{activeItem.provinceName}</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <span>📍</span>
                    <span>{activeItem.location}</span>
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {activeItem.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-amber-400/90 font-medium">
                  {activeItem.subtitle}
                </p>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeItem.description}
                </p>

                {/* Tag Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {activeItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5">
                <Link
                  to={activeItem.guideRoute}
                  onClick={() => setActiveItemIndex(null)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-all duration-200"
                >
                  <span>🧭 ค้นหาไกด์นำเที่ยวเส้นทางนี้</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveItemIndex(null)}
                  className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  ปิดหน้าต่างนี้ (กด ESC)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
           5. CALL TO ACTION BANNER ด้านล่าง GALLERY
           ======================================================== */}
      <div className="mt-10 sm:mt-14 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🌟 บริการมัคคุเทศก์มืออาชีพ
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            อยากออกเดินทางสัมผัสสถานที่เหล่านี้แบบเอ็กซ์คลูซีฟ?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            ให้ไกด์ท้องถิ่นที่ได้รับใบอนุญาตพาคุณเดินทางอย่างปลอดภัย ลึกซึ้ง
            และได้เรื่องราวเบื้องหลังประวัติศาสตร์ที่ไม่มีในคู่มือทั่วไป
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <Link
            to="/guides"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-all duration-200 text-center"
          >
            <span>🧭 ค้นหาไกด์นำเที่ยว</span>
          </Link>
          <Link
            to="/accommodations"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200 text-center"
          >
            <span>🏨 ค้นหาที่พัก</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
