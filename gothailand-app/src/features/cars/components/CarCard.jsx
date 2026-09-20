import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useCart } from '../../../context/CartContext';

/**
 * CarCard Component (Guitar x Yok Design System)
 * -------------------------------------------------------------
 * แสดงข้อมูลรถเช่าแต่ละคัน: รูปภาพ, ป้ายหมวดหมู่, สเปก (ที่นั่ง, เกียร์, น้ำมัน)
 * และราคาต่อวัน พร้อมปุ่มเข้าดูรายละเอียดตามโทนสีและ Typography ของ Yok
 */
export default function CarCard({ car, onViewDetail }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!car) return null;

  // แมปชื่อฟิลด์ให้รองรับ API จริง และ prioritize slug เพื่อให้ URL สวยงาม (/cars/toyota-fortuner)
  const carId = car.slug || car._id || car.id;
  const name = car.name || `${car.brand || ''} ${car.model || ''}`.trim() || "Car Model";
  const category = car.category || "Economy";
  const rating = car.rating ?? 5.0;
  const reviews = car.reviewCount ?? car.reviews ?? 0;
  const seats = car.seats || 5;
  const transmission = car.transmission || "Automatic";
  const fuel = car.fuelType || car.fuel || "Petrol";
  const price = car.pricePerDay || car.price || 0;
  const localFallback = car.slug ? `/images/cars/${car.slug}.jpg` : "/images/cars/toyota-yaris.jpg";
  const mainImage = car.mainImage || (car.galleryImages && car.galleryImages[0]) || localFallback;

  const handleDetailClick = () => {
    if (onViewDetail) {
      onViewDetail(car);
    } else {
      navigate(`/cars/${carId}`);
    }
  };

  const handleQuickAdd = (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    addToCart(
      {
        type: 'car',
        itemId: carId,
        title: name,
        subtitle: `${category} • ${seats} ที่นั่ง • เกียร์ ${transmission}`,
        image: mainImage,
        location: car.availableLocations?.[0] || 'Bangkok Suvarnabhumi Airport',
        unitPrice: price,
        priceUnitLabel: '/ วัน',
        quantity: 1,
        dates: {
          startDate: '2026-10-15',
          endDate: '2026-10-18',
          durationDays: 3,
        },
        details: {
          pickupLocation: car.availableLocations?.[0] || 'Bangkok Suvarnabhumi Airport',
          transmission,
          seats,
          fuel,
        },
      },
      { openDrawer: true }
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* รูปภาพรถพร้อมป้ายหมวดหมู่ */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <span className="absolute top-3 left-3 bg-[#0a192f]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider uppercase z-10 shadow-2xs">
            {category}
          </span>
          <img 
            src={mainImage} 
            alt={name} 
            loading="lazy"
            onError={(e) => {
              if (!e.currentTarget.dataset.fallbackApplied) {
                e.currentTarget.dataset.fallbackApplied = "true";
                e.currentTarget.src = localFallback;
              } else if (!e.currentTarget.src.includes("toyota-yaris.jpg")) {
                e.currentTarget.src = "/images/cars/toyota-yaris.jpg";
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* ข้อมูลรายละเอียดสเปก */}
        <div className="p-4 sm:p-5">
          <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {name}
          </h4>
          
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-amber-500 font-bold">★ {rating}</span>
            <span className="text-slate-400">({reviews} Reviews)</span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-[11px] font-medium text-slate-700">
              👤 {seats} Seats
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-[11px] font-medium text-slate-700">
              ⚙️ {transmission}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-[11px] font-medium text-slate-700">
              ⛽ {fuel}
            </span>
          </div>
        </div>
      </div>

      {/* ส่วนราคาและปุ่มดำเนินการ */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-lg sm:text-xl font-bold font-serif text-slate-900">
              ฿{price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ day</span>
            </div>
            <div className="text-[10px] text-slate-400">All taxes included</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={handleDetailClick}
            variant="outline"
            size="none"
            className="w-full font-semibold py-2.5 text-xs tracking-wider transition-all duration-200 shadow-2xs cursor-pointer"
          >
            <span>รายละเอียด</span>
          </Button>

          <Button
            type="button"
            onClick={handleQuickAdd}
            variant="primary"
            size="none"
            className="w-full font-bold py-2.5 text-xs tracking-wider transition-all duration-200 shadow-2xs gap-1 cursor-pointer"
          >
            <span>🛒</span>
            <span>ใส่ตะกร้า</span>
          </Button>
        </div>
      </div>
    </div>
  );
}