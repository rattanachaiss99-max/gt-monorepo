import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CarCard from './CarCard';

export default function BookingDetails({ cars }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find(c => c.id === id) || cars[0];

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-[11px] tracking-wider text-slate-400 uppercase mb-4">
          Home &gt; Car Rental &gt; {car.name} &gt; <span className="text-slate-700 font-bold">Booking</span>
        </div>

        <div className="flex gap-6 items-center text-xs mb-6">
          <span className="flex items-center gap-1 font-semibold text-slate-900">✓ Vehicle Selection</span>
          <span className="flex items-center gap-1 font-bold text-[#b48a3c] border-b-2 border-[#b48a3c] pb-1">② Booking Details</span>
          <span className="text-slate-400">③ Checkout</span>
        </div>

        <h1 className="text-2xl font-serif font-semibold text-slate-900 mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-5">
            {/* Selected Car Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={car.mainImage} alt={car.name} className="w-24 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">{car.name}</h3>
                  <div className="text-[11px] text-slate-400">Premium {car.category} • 👤 {car.seats} Seats • ⚙️ {car.transmission} • ⛽ {car.fuel}</div>
                  <Link to="/cars" className="text-[11px] text-[#b48a3c] hover:underline font-semibold block mt-1">Change Vehicle</Link>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-serif text-slate-900">฿{car.price.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block">/ day</span>
              </div>
            </div>

            {/* Rental Details */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-serif font-semibold text-slate-900">Rental Details</h4>
                <span className="text-xs text-[#b48a3c] cursor-pointer">✏ Edit</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block font-bold">Pick-up</span>
                  <div className="font-medium mt-0.5">Bangkok (BKK) Suvarnabhumi Airport</div>
                  <div className="text-slate-400 text-[11px]">Oct 24, 2026 • 10:00 AM</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block font-bold">Drop-off</span>
                  <div className="font-medium mt-0.5">Bangkok (BKK) Suvarnabhumi Airport</div>
                  <div className="text-slate-400 text-[11px]">Oct 27, 2026 • 10:00 AM</div>
                </div>
              </div>
            </div>

            {/* Driver Form */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-serif font-semibold text-slate-900">1. Driver Information</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name (as on license)</label>
                  <input type="text" className="w-full border p-2.5 rounded-lg" defaultValue="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address</label>
                    <input type="email" className="w-full border p-2.5 rounded-lg" defaultValue="john@example.com" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone Number</label>
                    <input type="tel" className="w-full border p-2.5 rounded-lg" defaultValue="+1 234 567 890" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#0b1b36] text-white p-6 rounded-xl shadow-lg space-y-4 sticky top-6">
              <h3 className="font-serif text-lg font-bold border-b border-slate-700 pb-3">Booking Summary</h3>
              <div className="text-xs space-y-2 text-slate-300">
                <div className="flex justify-between"><span>{car.name}</span> <span className="font-semibold text-white">฿{car.price.toLocaleString()} x 3 days</span></div>
                <div className="flex justify-between"><span>Base Rate</span> <span className="text-white">฿{(car.price * 3).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Service Fee</span> <span className="text-white">฿0</span></div>
                <div className="flex justify-between"><span>Taxes & Fees (7% VAT)</span> <span className="text-emerald-400">Included</span></div>
              </div>
              <div className="pt-4 border-t border-slate-700 flex justify-between items-baseline">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Total Amount</span>
                <span className="text-2xl font-serif font-bold text-[#f2cb6c]">฿{(car.price * 3).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => navigate(`/checkout`)}
                className="w-full bg-[#f2cb6c] hover:bg-[#e4bd58] text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer"
              >
                Continue to Checkout →
              </button>
            </div>
          </div>
        </div>

        {/* Alternative Vehicles ใช้ CarCard ร่วมกัน */}
        <div className="border-t pt-10">
          <h2 className="text-2xl font-serif text-center font-semibold text-slate-900 mb-8">Alternative Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cars.slice(1, 4).map((altCar) => (
              <CarCard key={altCar.id} car={altCar} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}