import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function CarDetail({ cars }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find(c => c.id === id) || cars[0];

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-[11px] tracking-wider text-slate-400 uppercase mb-4">
          <Link to="/cars" className="hover:underline">Home</Link> &gt; <Link to="/cars" className="hover:underline">Car Rental</Link> &gt; <span className="text-slate-700 font-bold">{car.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full">
              <div className="w-full h-[360px] rounded-xl overflow-hidden shadow-sm mb-3">
                <img src={car.mainImage} alt={car.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-3 h-24">
                {car.gallery?.slice(0, 3).map((img, i) => (
                  <div key={i} className="h-full rounded-lg overflow-hidden border border-slate-100">
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="h-full rounded-lg overflow-hidden relative bg-slate-900 flex items-center justify-center">
                  <img src={car.gallery?.[3] || car.mainImage} alt="thumb" className="w-full h-full object-cover opacity-50 absolute inset-0" />
                  <span className="relative z-10 text-white font-bold text-xs">+12 Photos</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-sky-100 text-sky-800 text-xs px-2 py-0.5 rounded font-bold">{car.category}</span>
                <span className="text-xs text-slate-500">★ {car.rating} ({car.reviews} Reviews)</span>
              </div>
              <h1 className="text-3xl font-serif text-slate-900">{car.name}</h1>
              <p className="text-xs leading-relaxed text-slate-600 font-light">{car.description}</p>

              <h3 className="font-serif text-base font-semibold pt-4 border-t">Key Specifications</h3>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Transmission</span>
                  <span className="text-xs font-semibold mt-1 block">{car.transmission}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Seats</span>
                  <span className="text-xs font-semibold mt-1 block">{car.seats} Seats</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fuel</span>
                  <span className="text-xs font-semibold mt-1 block">{car.fuel}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Luggage</span>
                  <span className="text-xs font-semibold mt-1 block">{car.luggage}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg space-y-5 sticky top-6">
              <div className="flex justify-between items-baseline border-b pb-4">
                <div>
                  <span className="text-2xl font-serif font-bold text-slate-900">฿{car.price.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-400 block uppercase">Per Day</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total (3 Days)</span>
                  <span className="text-xl font-serif font-bold text-slate-900">฿{(car.price * 3).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pick-up Location</label>
                <div className="border rounded-lg p-2.5 text-xs text-slate-700 bg-slate-50">Bangkok (BKK Airport) ▾</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pick-up Date</label>
                  <input type="date" defaultValue="2026-10-15" className="border rounded-lg p-2 text-xs w-full" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Time</label>
                  <input type="text" defaultValue="10:00 AM" className="border rounded-lg p-2 text-xs w-full" />
                </div>
              </div>

              <button 
                onClick={() => navigate(`/cars/${car.id}/booking`)}
                className="w-full bg-[#f2cb6c] hover:bg-[#e4bd58] text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
              >
                Book Now →
              </button>
              <div className="text-[10px] text-center text-slate-400">
                No credit card fees. Free cancellation up to 48 hours before pick-up.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}