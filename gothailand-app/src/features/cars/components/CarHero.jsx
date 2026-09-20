import { TravelSearchBox } from '../../../components/common';

const DEFAULT_CAR_LOCATIONS = [
  'Bangkok (BKK) Suvarnabhumi Airport',
  'Bangkok (DMK) Don Mueang Airport',
  'Chiang Mai (CNX) Airport',
  'Phuket (HKT) Airport',
  'Krabi (KBV) Airport',
  'Samui (USM) Airport',
  'Pattaya Downtown',
  'Hua Hin City Center',
];

/**
 * CarHero Component (Yok Search Bar Pattern)
 * -------------------------------------------------------------
 * ส่วนหัวแบนเนอร์ภาพรถ/การเดินทาง พร้อม Floating Search Card สไตล์เดียวกับ Yok
 * ขับเคลื่อนด้วย TravelSearchBox (Shared Component)
 * รองรับการเลือก: สถานที่รับ-คืนรถ, ช่วงวันเดินทาง (พร้อมคำนวณจำนวนวัน), ประเภทรถยนต์
 * -------------------------------------------------------------
 */
export default function CarHero({
  searchLocation = '',
  onSearchLocationChange,
  pickupDate = '2026-10-15',
  onPickupDateChange,
  returnDate = '2026-10-18',
  onReturnDateChange,
  selectedCategory = 'all',
  onSelectedCategoryChange,
  onSearchSubmit,
  availableLocations = DEFAULT_CAR_LOCATIONS,
}) {
  return (
    <section className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-8 bg-[#0a192f] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 shadow-md relative overflow-hidden">
      {/* ลวดลายพื้นหลัง */}
      <img
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80"
        alt="Scenic Highway Drive"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/70 via-[#0a192f]/85 to-[#0a192f] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* หัวข้อ & คำอธิบายย่อย */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3 inline-block">
            Premium Car Rentals in Thailand
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Explore Thailand Your Way
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Premium car rentals for your exclusive journey. From sleek sedans to luxury SUVs, discover the freedom of the open road.
          </p>
        </div>

        {/* กล่องค้นหาแบบลอย — ใช้ Shared TravelSearchBox Component */}
        <div className="max-w-5xl mx-auto">
          <TravelSearchBox
            defaultService="cars"
            hideTabs={true}
            showBookingLinks={false}
            searchButtonText="Search Cars"
            searchLocation={searchLocation}
            onSearchLocationChange={onSearchLocationChange}
            pickupDate={pickupDate}
            onPickupDateChange={onPickupDateChange}
            returnDate={returnDate}
            onReturnDateChange={onReturnDateChange}
            selectedCategory={selectedCategory}
            onSelectedCategoryChange={onSelectedCategoryChange}
            availableProvinces={availableLocations}
            onSearchSubmit={onSearchSubmit}
            className="shadow-2xl border-slate-200/90"
          />
        </div>
      </div>
    </section>
  );
}
