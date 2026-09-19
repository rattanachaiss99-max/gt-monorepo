import { getAssetUrl as getAsset } from '../utils/accommodationImages';

/**
 * GetInspired Component
 * -------------------------------------------------------------
 * แสดงแกลเลอรีสร้างแรงบันดาลใจจุดหมายปลายทางยอดนิยมในไทย
 * เลย์เอาต์ตามต้นแบบ Canva:
 *  - แถวบน: 2 การ์ดใหญ่ (Bangkok 🇹🇭, Chiang Mai 🇹🇭)
 *  - แถวล่าง: 3 การ์ดกลาง (Phuket 🇹🇭, Pattaya 🇹🇭, Krabi 🇹🇭)
 * -------------------------------------------------------------
 */
export default function GetInspired({
  destinationCounts = {},
  onSelectDestination,
}) {
  const topDestinations = [
    {
      city: 'Bangkok',
      region: 'central',
      displayName: 'Bangkok 🇹🇭',
      desc: 'Historic riverfronts, golden temples & vibrant city suites',
      image: getAsset('siam-heritage-sanctuary'),
    },
    {
      city: 'Chiang Mai',
      region: 'north',
      displayName: 'Chiang Mai 🇹🇭',
      desc: 'Misty mountain valleys, teak retreats & Lanna culture',
      image: getAsset('emerald-jungle-retreat'),
    },
  ];

  const bottomDestinations = [
    {
      city: 'Phuket',
      region: 'south',
      displayName: 'Phuket 🇹🇭',
      desc: 'Private oceanfront villas & turquoise bays',
      image: getAsset('amanpuri-retreat-villas'),
    },
    {
      city: 'Chonburi',
      region: 'east',
      displayName: 'Pattaya 🇹🇭',
      desc: 'Bustling beach retreats & coastal escapes',
      image: getAsset('hua-hin-royal-beachfront'),
    },
    {
      city: 'Krabi',
      region: 'south',
      displayName: 'Krabi 🇹🇭',
      desc: 'Iconic limestone karsts & secluded lagoon coves',
      image: getAsset('railay-cliff-beach-villas'),
    },
  ];

  return (
    <section className="mb-16">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
          Get inspired for your next trip
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Handpicked top destinations across Thailand with verified stays
        </p>
      </div>

      <div className="space-y-4">
        {/* แถวบน: การ์ดใหญ่ 2 อัน */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topDestinations.map((dest) => {
            const count = destinationCounts[dest.city] || 0;

            return (
              <div
                key={dest.city}
                onClick={() => onSelectDestination?.(dest.city, dest.region)}
                className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200/80"
              >
                {/* รูปพื้นหลัง */}
                <img
                  src={dest.image}
                  alt={dest.displayName}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                />

                {/* เงา Gradient สีเข้ม */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 group-hover:via-black/35 transition-colors" />

                {/* ป้ายด้านบน: จำนวนที่พัก */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {count > 0 ? `${count} stays` : 'New'}
                  </span>
                </div>

                {/* เนื้อหาข้อความ */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-10 text-white space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight drop-shadow-md flex items-center gap-2">
                    <span>{dest.displayName}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 line-clamp-2 max-w-md font-normal drop-shadow-sm">
                    {dest.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                    <span>Explore stays</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* แถวล่าง: การ์ดขนาดกลาง 3 อัน */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bottomDestinations.map((dest) => {
            const count = destinationCounts[dest.city] || 0;

            return (
              <div
                key={dest.city}
                onClick={() => onSelectDestination?.(dest.city, dest.region)}
                className="group relative h-56 sm:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200/80"
              >
                {/* รูปพื้นหลัง */}
                <img
                  src={dest.image}
                  alt={dest.displayName}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                />

                {/* เงา Gradient สีเข้ม */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 group-hover:via-black/35 transition-colors" />

                {/* ป้ายด้านบน: จำนวนที่พัก */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {count > 0 ? `${count} stays` : 'New'}
                  </span>
                </div>

                {/* เนื้อหาข้อความ */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-10 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight drop-shadow-md">
                    {dest.displayName}
                  </h3>
                  <p className="text-xs text-white/85 line-clamp-1 font-normal drop-shadow-sm">
                    {dest.desc}
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                    <span>Explore stays</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
