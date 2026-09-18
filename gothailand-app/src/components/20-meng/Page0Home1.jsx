// นำเข้า React และ Hook ที่ชื่อว่า useState สำหรับสร้างตัวแปรที่สามารถเปลี่ยนแปลงค่าได้ในหน้านี้
import React, { useState } from 'react';

// นำเข้าไอคอนต่างๆ จากไลบรารี lucide-react เพื่อใช้ตกแต่ง UI
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck,
  Compass,
  Star,
  Sparkles,
  Car,
  Home,
  UserCheck,
  ChevronRight,
  X,
} from 'lucide-react';

/**
 * Component หลักสำหรับหน้า Home (หน้าแรกของเว็บไซต์)
 * รับ Props (ตัวแปรที่ส่งมาจากไฟล์แม่) 3 ตัว:
 * - onNavigateToGuides: ฟังก์ชันสำหรับเปลี่ยนหน้าไปยังหน้ารายการไกด์
 * - onSelectGuideFromHome: ฟังก์ชันสำหรับเลือกไกด์จากหน้าโฮม (ไม่ได้ใช้ในหน้านี้โดยตรง แต่รับเผื่อไว้)
 * - guides: ข้อมูลรายการไกด์ทั้งหมด
 */
export const Page0Home = ({
  onNavigateToGuides,
  onSelectGuideFromHome,
  guides,
}) => {
  // state สำหรับเก็บชื่อภูมิภาคที่ผู้ใช้คลิกบนแผนที่ (ค่าเริ่มต้นคือ null หมายถึงยังไม่ได้คลิก)
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  // state สำหรับควบคุมการเปิด/ปิดหน้าต่าง Popup (Modal) ของบริการต่างๆ
  // null = ปิดอยู่, 'accommodation' = เปิดหน้าต่างที่พัก, 'car' = เปิดหน้าต่างรถเช่า
  const [activeServiceModal, setActiveServiceModal] = useState(null);

  // ฟังก์ชันนี้จะถูกเรียกใช้เมื่อผู้ใช้คลิกเลือกภูมิภาคบนแผนที่
  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName); // อัปเดต state ให้เป็นชื่อภูมิภาคที่คลิก
  };

  return (
    // โครงสร้างหลักของหน้า: จัดเรียงเนื้อหาจากบนลงล่าง (flex-col) และกำหนดสีพื้นหลัง
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col selection:bg-amber-200">
      
      {/* =========================================================
          1. HERO SECTION (ส่วนหัวของเว็บไซต์)
          ประกอบด้วย ภาพพื้นหลัง, เมนูนำทาง (Navbar), แผนที่ประเทศไทย และ โลโก้วงกลม
      ========================================================= */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] bg-sky-900 overflow-hidden flex flex-col justify-between">
        
        {/* ภาพพื้นหลังทะเลอันดามัน */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.92]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2400&q=85')`,   // เปลี่ยน HeroSection
          }}
        >
          {/* เลเยอร์ไล่สีดำโปร่งแสง เพื่อให้ตัวหนังสือด้านบนอ่านง่ายขึ้น */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
        </div>

        {/* แถบเมนูนำทาง (Navigation Bar) ด้านบนสุด */}
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-12 py-5 sm:py-6 flex items-center justify-between">
          
          {/* โลโก้แบรนด์ GoThailand */}
          <div className="flex flex-col">
            <span className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#f3ba36] drop-shadow-md">
              GoThailand
            </span>
            <span className="text-[10px] sm:text-xs font-light text-amber-200 tracking-wider -mt-1 drop-shadow">
              - Experience the Best of Asia -
            </span>
          </div>

          {/* ลิงก์เมนูต่างๆ (ซ่อนในหน้าจอมือถือ, แสดงในหน้าจอขนาด md ขึ้นไป) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm lg:text-base font-medium text-white drop-shadow">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // เลื่อนกลับไปบนสุด
              className="relative pb-1 font-semibold text-white cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#f3ba36]"
            >
              Home
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('services-section');
                el?.scrollIntoView({ behavior: 'smooth' }); // เลื่อนไปหาส่วนบริการ (Services)
              }}
              className="hover:text-amber-200 transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={onNavigateToGuides} // เปลี่ยนหน้าไปหน้ารายการไกด์
              className="hover:text-amber-200 transition-colors cursor-pointer"
            >
              Destinations
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('footer-contact');
                el?.scrollIntoView({ behavior: 'smooth' }); // เลื่อนไปหาข้อมูลติดต่อด้านล่างสุด
              }}
              className="hover:text-amber-200 transition-colors cursor-pointer"
            >
              About Us
            </button>
          </nav>

          {/* ปุ่ม Book Now (จองเลย) */}
          <button
            id="hero-header-book-now-btn"
            onClick={onNavigateToGuides}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#f3ba36] hover:bg-[#e0a623] text-stone-900 font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Book Now
          </button>
        </div>

        {/* เนื้อหาตรงกลางของ Hero: แผนที่ประเทศไทย (ซ้าย) และ โลโก้วงกลม (ขวา) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 flex-1">
          
          {/* ซ้าย: แผนที่ประเทศไทย */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="bg-black/35 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-2xl max-w-xs sm:max-w-sm">
              <div className="text-white mb-2">
                <span className="text-[11px] uppercase tracking-widest text-amber-300 font-bold">
                  Private Group Journeys
                </span>
                <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-white leading-tight">
                  Explore by Region
                </h3>
              </div>

              {/* กล่องแสดงแผนที่ SVG */}
              <div className="relative w-full h-48 sm:h-52 bg-gradient-to-b from-sky-950/60 to-emerald-950/60 rounded-xl p-3 flex items-center justify-center border border-white/15 overflow-hidden">
                <svg
                  viewBox="0 0 200 260"
                  className="h-full w-auto drop-shadow-lg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* การวาดแผนที่แต่ละภาค (ใช้ path ของ SVG) เมื่อคลิกจะเรียก handleRegionClick */}
                  {/* ภาคเหนือ */}
                  <path
                    d="M 60,25 C 75,18 105,20 120,35 C 128,45 115,70 100,75 C 80,75 60,60 55,45 Z"
                    fill="#15803d"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => handleRegionClick('Northern Region')}
                  />
                  {/* ภาคอีสาน */}
                  <path
                    d="M 100,72 C 120,65 160,70 175,95 C 185,120 155,145 125,140 C 105,135 95,100 100,72 Z"
                    fill="#ea580c"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => handleRegionClick('Northeast Region')}
                  />
                  {/* ภาคกลาง */}
                  <path
                    d="M 68,75 C 95,78 115,105 115,138 C 105,155 75,155 65,142 C 60,120 58,95 68,75 Z"
                    fill="#eab308"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => handleRegionClick('Central Region')}
                  />
                  {/* ภาคใต้ */}
                  <path
                    d="M 68,146 C 78,148 85,165 80,195 C 75,220 90,245 75,255 C 65,245 60,215 58,190 C 55,170 60,152 68,146 Z"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:brightness-125 transition-all"
                    onClick={() => handleRegionClick('Southern Region')}
                  />

                  {/* หมุดแผนที่ (Pins) สำหรับแต่ละภาค */}
                  <g className="cursor-pointer" onClick={() => handleRegionClick('Northern Region')}>
                    <circle cx="85" cy="45" r="7" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
                    <MapPin className="w-3 h-3 text-white" x="79" y="39" />
                  </g>
                  {/* ... (หมุดอื่นๆ) ... */}
                  <g className="cursor-pointer" onClick={() => handleRegionClick('Northeast Region')}>
                    <circle cx="138" cy="102" r="7" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                    <MapPin className="w-3 h-3 text-white" x="132" y="96" />
                  </g>
                  <g className="cursor-pointer" onClick={() => handleRegionClick('Central Region')}>
                    <circle cx="85" cy="120" r="7" fill="#ca8a04" stroke="#ffffff" strokeWidth="1.5" />
                    <MapPin className="w-3 h-3 text-white" x="79" y="114" />
                  </g>
                  <g className="cursor-pointer" onClick={() => handleRegionClick('Southern Region')}>
                    <circle cx="70" cy="195" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                    <MapPin className="w-3 h-3 text-white" x="64" y="189" />
                  </g>
                </svg>

                {/* ป้ายแสดงชื่อภูมิภาคที่ผู้ใช้คลิกเลือก (ดึงค่าจาก state) */}
                <div className="absolute right-2 top-2 text-[9px] text-white font-mono bg-black/40 px-2 py-1 rounded">
                  {selectedRegion || 'Click any region'}
                </div>
              </div>

              {/* ปุ่มคำอธิบายสีของแต่ละภาค (Legend) */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3 pt-2 border-t border-white/15 text-[11px] text-white">
                <button
                  onClick={() => handleRegionClick('Northern Region')}
                  className="flex items-center gap-1.5 hover:text-amber-300 text-left cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803d] shrink-0 ring-1 ring-white/60" />
                  <span>Northern Region</span>
                </button>
                {/* ... (ปุ่มภาคอื่นๆ) ... */}
                <button
                  onClick={() => handleRegionClick('Northeast Region')}
                  className="flex items-center gap-1.5 hover:text-amber-300 text-left cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] shrink-0 ring-1 ring-white/60" />
                  <span>Northeast Region</span>
                </button>
                <button
                  onClick={() => handleRegionClick('Central Region')}
                  className="flex items-center gap-1.5 hover:text-amber-300 text-left cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] shrink-0 ring-1 ring-white/60" />
                  <span>Central Region</span>
                </button>
                <button
                  onClick={() => handleRegionClick('Southern Region')}
                  className="flex items-center gap-1.5 hover:text-amber-300 text-left cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0 ring-1 ring-white/60" />
                  <span>Southern Region</span>
                </button>
              </div>
            </div>
          </div>

          {/* ขวา: โลโก้วงกลมกลางหน้าจอ */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center text-center">
            <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-full shadow-2xl border-4 border-[#d4a326]/60 w-64 h-64 sm:w-72 sm:h-72 flex flex-col items-center justify-center text-stone-900 group hover:scale-105 transition-transform duration-300">
              {/* ไอคอนช้างแบบ SVG */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0b1a30] via-[#152a4a] to-[#0b1a30] flex items-center justify-center text-amber-400 p-2 shadow-inner border border-amber-300/40">
                <svg viewBox="0 0 100 100" className="w-14 h-14 fill-current text-[#f3ba36]">
                  <path d="M50 15 C35 15 25 25 22 40 C20 50 25 65 35 70 C33 78 30 85 28 88 C32 87 40 82 44 76 C46 76 48 77 50 77 C52 77 54 76 56 76 C60 82 68 87 72 88 C70 85 67 78 65 70 C75 65 80 50 78 40 C75 25 65 15 50 15 Z M42 45 C39 45 37 42 37 39 C37 36 39 33 42 33 C45 33 47 36 47 39 C47 42 45 45 42 45 Z M58 45 C55 45 53 42 53 39 C53 36 55 33 58 33 C61 33 63 36 63 39 C63 42 61 45 58 45 Z M50 64 C42 64 36 58 36 55 C36 54 37 53 38 53 C40 53 42 55 50 55 C58 55 60 53 62 53 C63 53 64 54 64 55 C64 58 58 64 50 64 Z" />
                </svg>
              </div>

              {/* ข้อความโลโก้ */}
              <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#0b1a30] mt-2">
                Go<span className="text-[#c99726]">Thailand</span>
              </span>

              {/* คำอธิบายบริการ */}
              <p className="text-[10px] sm:text-xs font-semibold text-stone-600 tracking-wider mt-0.5 uppercase">
                Accommodation • Car Rental • Guide
              </p>
              <span className="text-[11px] font-medium text-amber-700 italic mt-0.5">
                For private group
              </span>
            </div>
          </div>
        </div>

        {/* แถบไล่สีด้านล่างสุดของ Hero เพื่อให้กลมกลืนกับส่วนถัดไป */}
        <div className="relative z-10 w-full h-8 bg-gradient-to-t from-[#faf8f5] to-transparent" />
      </section>

      {/* =========================================================
          2. CORE SERVICE CARDS (ส่วนแสดงบริการ 3 อย่าง)
      ========================================================= */}
      <section id="services-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8a681c]">
            Exclusive Private Group Services
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Choose Your Thai Experience
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Tailor-made itineraries crafted for discerning travelers seeking comfort, culture, and seamless mobility.
          </p>
        </div>

        {/* ตารางจัดเรียงการ์ด 3 ใบ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* --- การ์ดใบที่ 1: ที่พัก (Accommodation) --- */}
          <div
            id="card-accommodation"
            onClick={() => setActiveServiceModal('accommodation')} // เปิด Modal ที่พักเมื่อคลิก
            className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
          >
            <div className="p-6 text-center border-b border-stone-100">
              <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 group-hover:text-[#c99726] transition-colors">
                Accommodation
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Luxury pool villas & private ocean retreats
              </p>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
              <div className="relative h-56 sm:h-64 w-full rounded-xl overflow-hidden bg-stone-100 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-*************-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                  alt="Luxury Accommodation Pool Villa"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-medium flex items-center gap-1">
                    View Private Villas <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs text-stone-600">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Home className="w-3.5 h-3.5" /> 5-Star Certified
                </span>
                <span className="text-stone-400 font-mono">From ฿4,500/night</span>
              </div>
            </div>
          </div>

          {/* --- การ์ดใบที่ 2: รถเช่า (Car Rental) --- */}
          <div
            id="card-car-rental"
            onClick={() => setActiveServiceModal('car')} // เปิด Modal รถเช่าเมื่อคลิก
            className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
          >
            <div className="p-6 text-center border-b border-stone-100">
              <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 group-hover:text-[#c99726] transition-colors">
                Car Rental
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Premium SUVs & executive private vans
              </p>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
              <div className="relative h-56 sm:h-64 w-full rounded-xl overflow-hidden bg-stone-100 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
                  alt="White SUV Car Rental on Scenic Coastal Road"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-medium flex items-center gap-1">
                    Explore Vehicle Fleet <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs text-stone-600">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Car className="w-3.5 h-3.5" /> With Chauffeur / Self-Drive
                </span>
                <span className="text-stone-400 font-mono">From ฿1,800/day</span>
              </div>
            </div>
          </div>

          {/* --- การ์ดใบที่ 3: ไกด์นำเที่ยว (Tourist Guide) --- */}
          <div
            id="card-tourist-guide"
            onClick={onNavigateToGuides} // เปลี่ยนไปหน้ารายการไกด์ทันที
            className="bg-white rounded-2xl border-2 border-[#d4a326]/60 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer relative ring-2 ring-amber-400/20"
          >
            {/* ป้ายแนะนำมุมขวาบน */}
            <div className="absolute top-3 right-3 z-10 bg-[#0b1a30] text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>10 Guides Ready</span>
            </div>
            <div className="p-6 text-center border-b border-stone-100">
              <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 group-hover:text-[#c99726] transition-colors">
                Tourist Guide
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Licensed local experts across Thailand
              </p>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
              <div className="relative h-56 sm:h-64 w-full rounded-xl overflow-hidden bg-stone-100 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-*************-259b08848526?auto=format&fit=crop&w=800&q=80"
                  alt="Tourist Guide with Travelers at Thai Temple"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white space-y-1">
                    <span className="text-xs font-bold bg-[#f3ba36] text-stone-900 px-2 py-0.5 rounded inline-flex items-center gap-1">
                      Click to Browse Guides <ArrowRight className="w-3 h-3" />
                    </span>
                    <p className="text-[11px] text-stone-200">
                      Niran S., Mali, Somchai, Kittisak & 6 more
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[#8a681c] font-semibold">
                  <UserCheck className="w-3.5 h-3.5" /> 100% Certified Guides
                </span>
                <span className="text-[#8a681c] font-bold font-mono">From ฿2,200/day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. MID CTA BANNER (ส่วนแบนเนอร์กระตุ้นให้กดจอง)
      ========================================================= */}
      <section className="relative w-full min-h-[420px] sm:min-h-[460px] bg-stone-900 overflow-hidden flex items-center">
        {/* ภาพพื้นหลังแบนเนอร์ */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.88]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-*************-46273834b3fb?auto=format&fit=crop&w=2200&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/50 to-transparent" />
        </div>

        {/* ข้อความและปุ่มจอง */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 py-16">
          <div className="max-w-xl space-y-4">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
              Book Your Unforgettable<br />
              Thai Experience Today!
            </h2>
            <p className="text-sm sm:text-base text-stone-200 font-light leading-relaxed drop-shadow">
              Let us take care of your journey while you create beautiful memories.
            </p>

            <div className="pt-4">
              <button
                id="mid-banner-book-now-btn"
                onClick={onNavigateToGuides} // กดแล้วไปหน้ารายการไกด์
                className="px-8 py-3.5 bg-[#f3ba36] hover:bg-[#e0a623] text-stone-900 font-bold text-sm rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Book Now</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. FOOTER (ส่วนท้ายสุดของเว็บไซต์)
      ========================================================= */}
      <footer id="footer-contact" className="w-full bg-[#0c1b33] text-stone-200 pt-14 pb-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-stone-700/60 items-center">
            
            {/* ซ้าย: ข้อมูลการติดต่อ */}
            <div className="md:col-span-6 space-y-3.5">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#f3ba36]">
                Contact Us
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-stone-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#f3ba36] shrink-0" />
                  <span>******************</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#f3ba36] shrink-0" />
                  <span>*****@********.***</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#f3ba36] shrink-0" />
                  <span>190 Nor Si Rd, T.Ndasades, Thailand</span>
                </div>
              </div>
            </div>

            {/* กลาง: เส้นแบ่งแนวตั้ง (แสดงเฉพาะจอใหญ่) */}
            <div className="hidden md:flex md:col-span-1 justify-center">
              <div className="w-[1px] h-32 bg-stone-700" />
            </div>

            {/* ขวา: ไอคอน Social Media และ Tagline */}
            <div className="md:col-span-5 flex flex-col items-center md:items-end space-y-4">
              <div className="flex items-center space-x-4">
                <a href="#facebook" className="w-10 h-10 rounded-full bg-[#f3ba36] text-[#0c1b33] flex items-center justify-center font-bold text-sm shadow-md hover:scale-110 transition-transform cursor-pointer">f</a>
                <a href="#instagram" className="w-10 h-10 rounded-full bg-[#f3ba36] text-[#0c1b33] flex items-center justify-center font-bold text-sm shadow-md hover:scale-110 transition-transform cursor-pointer"><span className="text-base">📷</span></a>
                <a href="#line" className="w-10 h-10 rounded-full bg-[#f3ba36] text-[#0c1b33] flex items-center justify-center font-bold text-sm shadow-md hover:scale-110 transition-transform cursor-pointer"><span className="text-[11px] font-black uppercase">LINE</span></a>
              </div>
              <div className="flex items-center gap-2 text-base font-serif-luxury font-bold text-[#f3ba36]">
                <span>For private group</span>
              </div>
              <span className="text-[#f3ba36] text-xl font-serif">✦</span>
            </div>
          </div>

          {/* ล่างสุด: Copyright และเงื่อนไขการใช้งาน */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
            <p className="text-center sm:text-left">
              © 2024 GoThailand. All Rights Reserved. (This website is for study only. No real services provide.)
            </p>
            <div className="flex items-center space-x-6 text-stone-400">
              <span className="hover:text-amber-300 cursor-pointer">Sitemap</span>
              <span>|</span>
              <span className="hover:text-amber-300 cursor-pointer">Terms of Use</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================
          5. MODALS (หน้าต่าง Popup ที่จะแสดงเมื่อถูกคลิกเปิดเท่านั้น)
      ========================================================= */}

      {/* หน้าต่างสำหรับ "ที่พัก (Accommodation)" 
          จะแสดงเฉพาะตอนที่ค่า activeServiceModal เท่ากับ 'accommodation' */}
      {activeServiceModal === 'accommodation' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                GoThailand Luxury Accommodation
              </h3>
              {/* ปุ่มกากบาทเพื่อปิด Modal (ตั้งค่า state กลับเป็น null) */}
              <button
                onClick={() => setActiveServiceModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              We curate handpicked 5-star private villas in Phuket, Koh Samui, Chiang Mai, and Bangkok for private groups. Each property includes dedicated concierge service, daily breakfast, and infinity pools.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              💡 <strong>Pro-Tip:</strong> Bundle your villa stay with a certified local guide for complimentary airport VIP transfer.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setActiveServiceModal(null); // ปิด Modal ก่อน
                  onNavigateToGuides();        // แล้วค่อยเปลี่ยนหน้า
                }}
                className="px-5 py-2.5 bg-[#0b1a30] text-white text-xs font-bold rounded-lg hover:bg-[#152a4a] transition-colors cursor-pointer"
              >
                Book with Tourist Guide →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* หน้าต่างสำหรับ "รถเช่า (Car Rental)" 
          จะแสดงเฉพาะตอนที่ค่า activeServiceModal เท่ากับ 'car' */}
      {activeServiceModal === 'car' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                GoThailand Premium Car Rental
              </h3>
              {/* ปุ่มกากบาทปิด Modal */}
              <button
                onClick={() => setActiveServiceModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Travel comfortably across Thailand with our modern fleet of luxury SUVs (Toyota Fortuner, BMW X5) and Toyota Commuter VIP executive vans with English-speaking professional drivers.
            </p>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900">
              🚗 All vehicles come with comprehensive commercial passenger insurance and 24/7 roadside assistance.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setActiveServiceModal(null);
                  onNavigateToGuides();
                }}
                className="px-5 py-2.5 bg-[#0b1a30] text-white text-xs font-bold rounded-lg hover:bg-[#152a4a] transition-colors cursor-pointer"
              >
                Book with Tourist Guide →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};