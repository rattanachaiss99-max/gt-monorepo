import { TravelSearchBox } from '../../../components/common';

/**
 * AccommodationHero Component
 * -------------------------------------------------------------
 * ส่วนหัว Hero Banner พร้อม Floating Search Bar Card
 * สไตล์รูปแบบตามภาพตัวอย่างใหม่ แต่ใช้โทนสีกรมท่าเข้ม (#0a192f) เดิม
 * ใช้คอมโพเนนต์กล่องค้นหาส่วนกลาง TravelSearchBox ในโหมด hideTabs
 * เชื่อมโยงกับ State และ Filter ของ AccommodationPage ได้อย่างสมบูรณ์แบบเดิม 100%
 * -------------------------------------------------------------
 */
export default function AccommodationHero({
  searchTerm = '',
  onSearchTermChange,
  checkIn = '2026-09-18',
  onCheckInChange,
  checkOut = '2026-09-19',
  onCheckOutChange,
  guestCount = 2,
  onGuestCountChange,
  onSearchSubmit,
}) {
  return (
    <section className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-8 bg-[#0a192f] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 shadow-md relative overflow-visible z-20">
      {/* Background Image Container — ตัดขอบภาพล้นเฉพาะในเลเยอร์นี้เพื่อไม่ให้คลิป Popover ปฏิทิน */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80"
          alt="Thailand hotel resort"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/70 via-[#0a192f]/85 to-[#0a192f]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* หัวข้อ & คำอธิบายย่อย */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3 inline-block">
            Handpicked Hotels, Villas & Resorts
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Curated Stays Across Thailand
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Handpicked hotels, villas, and resorts with verified reviews and flexible booking.
          </p>
        </div>

        {/* กล่องค้นหาแบบลอย — ใช้ Shared TravelSearchBox Component */}
        <div className="max-w-5xl mx-auto">
          <TravelSearchBox
            defaultService="accommodations"
            hideTabs={true}
            showBookingLinks={false}
            searchButtonText="Search"
            searchTerm={searchTerm}
            onSearchTermChange={onSearchTermChange}
            checkIn={checkIn}
            onCheckInChange={onCheckInChange}
            checkOut={checkOut}
            onCheckOutChange={onCheckOutChange}
            guestCount={guestCount}
            onGuestCountChange={onGuestCountChange}
            onSearchSubmit={onSearchSubmit}
            className="shadow-2xl border-slate-200/90"
          />
        </div>
      </div>
    </section>
  );
}
