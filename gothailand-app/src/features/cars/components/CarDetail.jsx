import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CarDetail Component (Presentation Component)
 * -------------------------------------------------------------
 * แสดงรายละเอียดเฉพาะของรถเช่าแต่ละคัน:
 * - แกลเลอรีรูปภาพ (ภาพหลัก + รูปย่อย) พร้อมระบบ Fallback
 * - สเปกรถ (เกียร์, ที่นั่ง, น้ำมัน, กระเป๋า)
 * - การเลือกสถานที่รับรถและคำนวณราคา 3 วัน
 * - ปุ่มจอง (Book Now)
 */
export default function CarDetail({ car = {}, onBookNow }) {
  const navigate = useNavigate();

  const localFallback = car.slug ? `/images/cars/${car.slug}.jpg` : "/images/cars/toyota-yaris.jpg";
  const mainImage = car.mainImage || (car.galleryImages && car.galleryImages[0]) || localFallback;

  const defaultGallery = [
    mainImage,
    car.slug ? `/images/cars/${car.slug}-rear.jpg` : "/images/cars/toyota-yaris-rear.jpg",
    car.slug ? `/images/cars/${car.slug}-interior.jpg` : "/images/cars/toyota-yaris-interior.jpg",
  ];
  const gallery = (car.galleryImages && car.galleryImages.length > 0)
    ? car.galleryImages
    : (car.gallery && car.gallery.length > 0)
    ? car.gallery
    : defaultGallery;

  const dailyPrice = car.pricePerDay || car.price || 0;
  const reviewCount = car.reviewCount ?? car.reviews ?? 0;
  const fuelType = car.fuelType || car.fuel || "Petrol";
  const luggageCapacity = car.luggageCapacity || car.luggage || "2 Large Bags";
  const locations = car.availableLocations?.length 
    ? car.availableLocations 
    : ['Bangkok (BKK) Suvarnabhumi Airport', 'Don Mueang Airport (DMK)', 'Chiang Mai International Airport (CNX)'];

  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [activeImage, setActiveImage] = useState(mainImage);
  const [pickupDate, setPickupDate] = useState("2026-10-15");
  const [pickupTime, setPickupTime] = useState("10:00 AM");

  const handleBookClick = () => {
    if (onBookNow) {
      onBookNow({
        car,
        pickupLocation: selectedLocation || locations[0],
        pickupDate,
        pickupTime,
        rentalDays: 3,
      });
      const carId = car.slug || car._id || car.id;
      navigate(`/cars/${carId}/booking`, {
        state: {
          car,
          pickupLocation: selectedLocation || locations[0],
          pickupDate,
          pickupTime,
          rentalDays: 3,
        }
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ฝั่งซ้าย: รูปภาพและรายละเอียดสเปก */}
      <div className="lg:col-span-2 space-y-6">
        <div className="w-full">
          {/* รูปภาพหลัก */}
          <div className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-sm mb-3 bg-slate-100 border border-slate-200/70">
            <img 
              src={activeImage || mainImage} 
              alt={car.name || "Car"} 
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => {
                if (!e.currentTarget.dataset.fallbackApplied) {
                  e.currentTarget.dataset.fallbackApplied = "true";
                  e.currentTarget.src = localFallback;
                } else if (!e.currentTarget.src.includes("toyota-yaris.jpg")) {
                  e.currentTarget.src = "/images/cars/toyota-yaris.jpg";
                }
              }}
            />
          </div>

          {/* แกลเลอรีรูปย่อย */}
          <div className="grid grid-cols-4 gap-3 h-20 sm:h-24">
            {gallery.slice(0, 3).map((img, i) => (
              <button 
                type="button"
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`h-full rounded-xl overflow-hidden border-2 bg-slate-100 transition cursor-pointer ${
                  activeImage === img ? "border-amber-500 shadow-sm" : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <img 
                  src={img} 
                  alt="thumb" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallbackApplied) {
                      e.currentTarget.dataset.fallbackApplied = "true";
                      e.currentTarget.src = localFallback;
                    } else if (!e.currentTarget.src.includes("toyota-yaris.jpg")) {
                      e.currentTarget.src = "/images/cars/toyota-yaris.jpg";
                    }
                  }}
                />
              </button>
            ))}
            <div className="h-full rounded-xl overflow-hidden relative bg-slate-900 flex items-center justify-center border border-slate-200/70">
              <img 
                src={gallery[3] || mainImage} 
                alt="thumb" 
                className="w-full h-full object-cover opacity-50 absolute inset-0"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallbackApplied) {
                    e.currentTarget.dataset.fallbackApplied = "true";
                    e.currentTarget.src = localFallback;
                  } else if (!e.currentTarget.src.includes("toyota-yaris.jpg")) {
                    e.currentTarget.src = "/images/cars/toyota-yaris.jpg";
                  }
                }}
              />
              <span className="relative z-10 text-white font-bold text-xs tracking-wider">
                +{Math.max(0, gallery.length - 3)} Photos
              </span>
            </div>
          </div>
        </div>

        {/* กล่องข้อมูลสเปกรถ */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-3">
            <span className="bg-[#0a192f] text-white text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
              {car.category || "Economy"}
            </span>
            <span className="text-xs font-semibold text-amber-500">★ {car.rating ?? 5.0}</span>
            <span className="text-xs text-slate-400">({reviewCount} Reviews)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{car.name}</h1>
          <p className="text-sm leading-relaxed text-slate-600 font-light">{car.description}</p>

          <h3 className="font-serif text-base font-bold text-slate-900 pt-4 border-t border-slate-100">
            Key Specifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Transmission</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">⚙️ {car.transmission || "Automatic"}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Seats</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">👤 {car.seats || 5} Seats</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Fuel Type</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">⛽ {fuelType}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Luggage</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">🧳 {luggageCapacity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ฝั่งขวา: การ์ดคำนวณราคาและปุ่มจอง (Sticky Booking Widget) */}
      <div>
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-md space-y-5 sticky top-24">
          <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                ฿{dailyPrice.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Per Day</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Total (3 Days)</span>
              <span className="text-xl font-serif font-bold text-amber-600">
                ฿{(dailyPrice * 3).toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
              Pick-up & Return Location
            </label>
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-slate-200 rounded-xl p-3 text-xs text-slate-800 bg-slate-50 w-full outline-none focus:border-[#0a192f] focus:bg-white transition"
            >
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
                Pick-up Date
              </label>
              <input 
                type="date" 
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="border border-slate-200 rounded-xl p-2.5 text-xs w-full bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition" 
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
                Time
              </label>
              <input 
                type="text" 
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="border border-slate-200 rounded-xl p-2.5 text-xs w-full bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition" 
              />
            </div>
          </div>

          <button 
            type="button"
            onClick={handleBookClick}
            className="w-full bg-[#0a192f] hover:bg-amber-400 hover:text-slate-900 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Book Now</span>
            <span aria-hidden="true">→</span>
          </button>

          <div className="text-[11px] text-center text-slate-400 leading-relaxed">
            ✓ Free cancellation up to 48h before pick-up<br />
            ✓ All taxes & insurance included
          </div>
        </div>
      </div>
    </div>
  );
}
