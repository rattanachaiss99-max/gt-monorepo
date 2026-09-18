import React, { useState } from 'react';
import {
  MapPin,
  Star,
  ShieldCheck,
  Briefcase,
  BookOpen,
  Users,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';

export const Page2GuideProfile = ({
  guide,
  bookingState,
  onUpdateBooking,
  onProceedToDetails,
  onBackToDirectory,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    bookingState.date || '2026-09-15'
  );
  const [guestsCount, setGuestsCount] = useState(bookingState.guests || 2);
  const [duration, setDuration] = useState(
    bookingState.duration || 'Full Day (8 Hours)'
  );

  const durationMultiplier = duration.includes('Half') ? 0.65 : 1;
  const calculatedFee = Math.round(guide.pricePerDay * durationMultiplier);

  const handleBookClick = () => {
    onUpdateBooking({
      guideId: guide.id,
      guide: guide,
      date: selectedDate,
      guests: guestsCount,
      duration: duration,
      guideFee: calculatedFee,
      serviceFee: 0,
      totalAmount: calculatedFee,
    });
    onProceedToDetails();
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div>
          <button
            id="back-to-directory-btn"
            onClick={onBackToDirectory}
            className="inline-flex items-center text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to All Guides
          </button>
        </div>

        {/* Top Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Guide Portrait Photo */}
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-stone-200 aspect-[4/5] sm:aspect-[3/4] max-h-[480px]">
              <img
                src={guide.avatar}
                alt={guide.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Middle: Guide Info & Bio */}
          <div className="lg:col-span-4 bg-white p-7 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Verified Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 border border-amber-300 text-amber-900 rounded-md text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Verified Local Guide</span>
              </div>

              {/* Name and Location */}
              <div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                  {guide.name}
                </h1>
                <div className="flex items-center text-xs text-stone-600 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 mr-1 shrink-0" />
                  <span>{guide.location}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1.5 text-xs text-stone-800">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm">{Number(guide.rating).toFixed(1)}</span>
                <span className="text-stone-500">({guide.reviewCount} reviews)</span>
              </div>

              {/* Specialty tags */}
              <div className="pt-2">
                <span className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  SPECIALTY
                </span>
                <div className="flex flex-wrap gap-2">
                  {guide.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-stone-100 text-stone-800 text-xs font-medium rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote Block */}
              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  "{guide.bio}"
                </p>
              </div>
            </div>
          </div>

          {/* Right: Booking Action Card */}
          <div className="lg:col-span-4 bg-white p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
              <span className="font-serif-luxury text-3xl font-bold text-stone-900">
                ฿{guide.pricePerDay.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500 font-normal">/ day</span>
            </div>

            {/* Date Input */}
            <div>
              <label
                htmlFor="profile-booking-date"
                className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5"
              >
                DATE
              </label>
              <div className="relative">
                <input
                  id="profile-booking-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Guests Select */}
            <div>
              <label
                htmlFor="profile-guests-select"
                className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5"
              >
                GUESTS
              </label>
              <div className="relative">
                <select
                  id="profile-guests-select"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full appearance-none px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5+ Guests</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Duration Select */}
            <div>
              <label
                htmlFor="profile-duration-select"
                className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5"
              >
                DURATION
              </label>
              <div className="relative">
                <select
                  id="profile-duration-select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  <option value="Full Day (8 Hours)">Full Day (8 Hours)</option>
                  <option value="Half Day (4 Hours)">Half Day (4 Hours)</option>
                  <option value="2 Days (Custom Itinerary)">2 Days (Custom Itinerary)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Total Cost Line */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <span className="text-xs text-stone-600 font-medium">Total Cost</span>
              <span className="font-serif-luxury text-xl font-bold text-stone-900">
                ฿{calculatedFee.toLocaleString()}
              </span>
            </div>

            {/* Book This Guide Button */}
            <div className="space-y-2">
              <button
                id="book-this-guide-btn"
                onClick={handleBookClick}
                className="w-full py-3.5 px-6 bg-[#b5892b] hover:bg-[#996d13] text-white font-semibold text-xs tracking-wider uppercase rounded-lg shadow-sm active:scale-[0.99] transition-all cursor-pointer"
              >
                BOOK THIS GUIDE
              </button>
              <p className="text-[11px] text-center text-stone-600">
                You won't be charged yet.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-stone-200/90 text-center space-y-2">
            <Briefcase className="w-5 h-5 mx-auto text-[#b5892b]" />
            <div className="font-serif-luxury text-2xl font-bold text-stone-900">
              {guide.yearsExp}
            </div>
            <div className="text-xs text-stone-600">Years Exp.</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200/90 text-center space-y-2">
            <Star className="w-5 h-5 mx-auto fill-amber-400 text-amber-400" />
            <div className="font-serif-luxury text-2xl font-bold text-stone-900">
              {Number(guide.rating).toFixed(1)}
            </div>
            <div className="text-xs text-stone-600">Rating</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200/90 text-center space-y-2">
            <BookOpen className="w-5 h-5 mx-auto text-[#b5892b]" />
            <div className="font-serif-luxury text-2xl font-bold text-stone-900">
              {guide.reviewCount}
            </div>
            <div className="text-xs text-stone-600">Reviews</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200/90 text-center space-y-2">
            <Users className="w-5 h-5 mx-auto text-[#b5892b]" />
            <div className="font-serif-luxury text-2xl font-bold text-stone-900">
              {guide.travelersCount}
            </div>
            <div className="text-xs text-stone-600">Travelers</div>
          </div>
        </div>

        {/* Specialized Services */}
        <div className="space-y-6 pt-6">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
            Specialized Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guide.services.map((service) => (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow group"
              >
                <div className="h-52 overflow-hidden bg-stone-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
