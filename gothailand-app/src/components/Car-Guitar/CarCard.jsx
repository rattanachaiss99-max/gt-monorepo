import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CarCard({ car }) {
  const navigate = useNavigate();

  // ป้องกันกรณี car ยังไม่ได้ส่งมา หรือกำลังโหลดข้อมูล
  if (!car) return null;

  // แมปชื่อฟิลด์ให้รองรับทั้ง MongoDB จริง และ Mock Data
  const carId = car._id || car.id;
  const name = car.name || `${car.brand || ''} ${car.model || ''}`.trim() || "Car Model";
  const category = car.category || "Economy";
  const rating = car.rating ?? 5.0;
  const reviews = car.reviewCount ?? car.reviews ?? 0;
  const seats = car.seats || 5;
  const transmission = car.transmission || "Auto";
  const fuel = car.fuelType || car.fuel || "Petrol";
  const price = car.price || car.pricePerDay || 0;
  const mainImage = car.mainImage || (car.galleryImages && car.galleryImages[0]) || "";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="relative h-44 w-full overflow-hidden">
          <span className="absolute top-2 left-2 bg-[#d7e6f5] text-[#2c5282] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase z-10">
            {category}
          </span>
          <img 
            src={mainImage} 
            alt={name} 
            className="w-full h-full object-cover hover:scale-105 transition duration-300" 
          />
        </div>

        <div className="p-4">
          <h4 className="font-serif text-base font-medium text-slate-900">{name}</h4>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-amber-500">★</span> {rating} ({reviews} Reviews)
          </div>
          <div className="flex gap-2 text-[11px] text-slate-500 mt-3">
            <span>👤 {seats} Seats</span>
            <span>⚙️ {transmission}</span>
            <span>⛽ {fuel}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="text-base font-semibold text-slate-900">
          ฿{price.toLocaleString()} <span className="text-[11px] text-slate-400 font-normal">/ day</span>
        </div>
        <div className="text-[10px] text-slate-400 mb-3">All taxes included</div>
        <button 
          onClick={() => navigate(`/cars/${carId}`)}
          className="w-full border border-slate-800 text-slate-800 hover:bg-slate-900 hover:text-white py-2 rounded text-[11px] font-medium tracking-wider uppercase transition cursor-pointer"
        >
          View Detail
        </button>
      </div>
    </div>
  );
}