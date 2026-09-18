import React from 'react';
import CarCard from './CarCard';

export default function CarCatalog({ cars }) {
  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800">
      <div className="relative h-[380px] bg-slate-900 flex flex-col justify-center items-center text-center px-4">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-2xl mt-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-normal mb-3">Explore Thailand Your Way</h1>
          <p className="text-slate-200 text-sm md:text-base font-light">
            Premium car rentals for your exclusive journey. From sleek sedans to luxury SUVs, discover the freedom of the open road.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white shadow-xl rounded-xl p-4 flex flex-wrap md:flex-nowrap gap-4 items-center justify-between border border-slate-100">
          <div className="flex-1 min-w-[200px]">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Pick-up & Return Location</span>
            <div className="text-sm font-medium text-slate-700">📍 Bangkok, Thailand</div>
          </div>
          <div className="flex-1 min-w-[160px] border-t md:border-t-0 md:border-l pl-0 md:pl-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Dates</span>
            <div className="text-sm font-medium text-slate-700">📅 Select dates</div>
          </div>
          <div className="flex-1 min-w-[160px] border-t md:border-t-0 md:border-l pl-0 md:pl-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Vehicle Type</span>
            <div className="text-sm font-medium text-slate-700">🚗 All Types</div>
          </div>
          <button className="bg-[#785b12] hover:bg-[#60490e] text-white px-8 py-3 rounded-lg text-xs tracking-wider uppercase font-semibold transition cursor-pointer">
            🔍 Search Cars
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-16">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <div>
            <h2 className="text-2xl font-serif text-slate-900">Available Cars</h2>
            <p className="text-xs text-slate-500 mt-1">24 vehicles matching your criteria</p>
          </div>
          <div className="text-xs text-slate-500">
            Sort by: <span className="font-semibold text-slate-800">Recommended ▾</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium text-slate-900 border-b pb-2">Filter Cars</h3>
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 block mb-2">Car Type</span>
              <div className="space-y-2 text-xs text-slate-700">
                <label className="flex items-center gap-2"><input type="checkbox" /> Sedan (12)</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> SUV (8)</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Luxury (4)</label>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}