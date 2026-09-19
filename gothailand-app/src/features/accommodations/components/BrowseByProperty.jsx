import { getAssetUrl as getAsset } from '../utils/accommodationImages';

/**
 * BrowseByProperty Component
 * -------------------------------------------------------------
 * แสดงหมวดหมู่ที่พักตามประเภท (Hotels, Resorts, Villas, B&B, Guesthouse, Budget)
 * ออกแบบตามต้นแบบใน Canva
 * -------------------------------------------------------------
 */
export default function BrowseByProperty({
  categoryCounts = {},
  onSelectCategory,
}) {
  const propertyTypes = [
    {
      id: 'Luxury Resort',
      name: 'Resorts',
      fullName: 'Luxury Resort',
      image: getAsset('lanna-riverside-boutique'),
    },
    {
      id: 'Private Villa',
      name: 'Villas',
      fullName: 'Private Villa',
      image: getAsset('amanpuri-retreat-villas'),
    },
    {
      id: 'Luxury Hotel',
      name: 'Hotels',
      fullName: 'Luxury Hotel',
      image: getAsset('skyline-executive-suites'),
    },
    {
      id: 'Bed & Breakfast',
      name: 'Bed & Breakfast',
      fullName: 'Bed & Breakfast',
      image: getAsset('doi-mist-mountain-lodge'),
    },
    {
      id: 'Guest House',
      name: 'Guest Houses',
      fullName: 'Guest House',
      image: getAsset('isan-ricefield-homestay'),
    },
    {
      id: 'Budget Hotel',
      name: 'Budget Stays',
      fullName: 'Budget Hotel',
      image: getAsset('ayutthaya-heritage-riverside'),
    },
  ];

  return (
    <section className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Browse by property type
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore curated stays tailored to your ideal travel experience
          </p>
        </div>
      </div>

      {/* กริดการ์ดประเภทที่พัก */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {propertyTypes.map((item) => {
          const count = categoryCounts[item.id] || 0;

          return (
            <div
              key={item.id}
              onClick={() => onSelectCategory?.(item.id)}
              className="group cursor-pointer space-y-2.5"
            >
              {/* รูปการ์ด */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs group-hover:shadow-lg transition-all duration-300">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.fullName}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200" />
                )}
                {/* เงา gradient จางๆ ตอน hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              </div>

              {/* ชื่อ & จำนวน */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {count > 0 ? `${count} stays` : 'Explore stays'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
