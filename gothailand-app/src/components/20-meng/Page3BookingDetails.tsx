import React from 'react';
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Award,
  Headphones,
  CreditCard,
  Crown,
  ChevronRight,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Guide, BookingState } from '../types';

interface Page3BookingDetailsProps {
  guide: Guide;
  bookingState: BookingState;
  onUpdateBooking: (updates: Partial<BookingState>) => void;
  onProceedToCheckout: () => void;
  onBackToProfile: () => void;
}

export const Page3BookingDetails: React.FC<Page3BookingDetailsProps> = ({
  guide,
  bookingState,
  onUpdateBooking,
  onProceedToCheckout,
  onBackToProfile,
}) => {
  return (
    <div className="min-h-screen bg-[#faf9f6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
          <button
            onClick={onBackToProfile}
            className="hover:text-stone-900 cursor-pointer"
          >
            Home
          </button>
          <span>›</span>
          <span className="hover:text-stone-900 cursor-pointer">Local Guide</span>
          <span>›</span>
          <span className="hover:text-stone-900 cursor-pointer">{guide.name}</span>
          <span>›</span>
          <span className="text-stone-900 font-semibold">Booking Cart</span>
        </nav>

        {/* Stepper (1 Selection, 2 Details, 3 Checkout, 4 Confirmation) */}
        <div className="max-w-2xl mx-auto py-2">
          <div className="flex items-center justify-between relative">
            {/* Connecting lines */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-stone-200 -z-0" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center bg-[#faf9f6] px-2">
              <div className="w-8 h-8 rounded-full bg-[#0b1a30] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                1
              </div>
              <span className="text-xs font-medium text-stone-600 mt-1.5">Selection</span>
            </div>

            {/* Step 2 (Active) */}
            <div className="relative z-10 flex flex-col items-center bg-[#faf9f6] px-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#0b1a30] bg-[#0b1a30] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                2
              </div>
              <span className="text-xs font-bold text-stone-900 mt-1.5">Details</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center bg-[#faf9f6] px-2">
              <div className="w-8 h-8 rounded-full border border-stone-300 bg-white text-stone-400 flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <span className="text-xs font-medium text-stone-400 mt-1.5">Checkout</span>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center bg-[#faf9f6] px-2">
              <div className="w-8 h-8 rounded-full border border-stone-300 bg-white text-stone-400 flex items-center justify-center text-xs font-semibold">
                4
              </div>
              <span className="text-xs font-medium text-stone-400 mt-1.5">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Page Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Review Your Booking Details
          </h1>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Guide details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Your Selected Guide Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
              <h2 className="text-xs font-bold tracking-wider text-stone-900 uppercase">
                Your Selected Guide
              </h2>
              <div className="flex items-start gap-5">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-stone-100 shadow-sm shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                      {guide.name}
                    </h3>
                    <span className="font-serif-luxury text-lg font-bold text-[#b5892b]">
                      ฿{guide.pricePerDay.toLocaleString()}
                      <span className="text-xs text-stone-600 font-normal"> per day</span>
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-stone-600">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400" />
                    <span>{guide.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {guide.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-0.5 bg-sky-50 text-sky-800 rounded-md text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-xs text-stone-600 pt-1">
                    <span className="text-amber-500 font-bold mr-1">★ {guide.rating.toFixed(1)}</span>
                    <span>({guide.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details Inputs */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
              <h2 className="text-xs font-bold tracking-wider text-stone-900 uppercase">
                Booking Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* DATE */}
                <div>
                  <label
                    htmlFor="details-date"
                    className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5"
                  >
                    DATE
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                    <input
                      id="details-date"
                      type="date"
                      value={bookingState.date}
                      onChange={(e) => onUpdateBooking({ date: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* GUESTS */}
                <div>
                  <label
                    htmlFor="details-guests"
                    className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5"
                  >
                    GUESTS
                  </label>
                  <div className="relative flex items-center">
                    <Users className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                    <select
                      id="details-guests"
                      value={bookingState.guests}
                      onChange={(e) => onUpdateBooking({ guests: Number(e.target.value) })}
                      className="w-full appearance-none pl-10 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                    >
                      <option value={1}>1 Person</option>
                      <option value={2}>2 People</option>
                      <option value={3}>3 People</option>
                      <option value={4}>4 People</option>
                      <option value={5}>5+ People</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>

                {/* DURATION */}
                <div>
                  <label
                    htmlFor="details-duration"
                    className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5"
                  >
                    DURATION
                  </label>
                  <div className="relative flex items-center">
                    <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                    <select
                      id="details-duration"
                      value={bookingState.duration}
                      onChange={(e) => onUpdateBooking({ duration: e.target.value })}
                      className="w-full appearance-none pl-10 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                    >
                      <option value="Full Day (8 hrs)">Full Day (8 hrs)</option>
                      <option value="Half Day (4 hrs)">Half Day (4 hrs)</option>
                      <option value="2 Days Tour">2 Days Tour</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>

                {/* MEETING POINT */}
                <div>
                  <label
                    htmlFor="details-meetingpoint"
                    className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5"
                  >
                    MEETING POINT
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                    <input
                      id="details-meetingpoint"
                      type="text"
                      value={bookingState.meetingPoint}
                      onChange={(e) => onUpdateBooking({ meetingPoint: e.target.value })}
                      placeholder="e.g. Siam Kempinski Hotel Lobby"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
              <h2 className="text-xs font-bold tracking-wider text-stone-900 uppercase">
                Special Requests
              </h2>
              <p className="text-xs text-stone-600">
                Have any dietary restrictions, accessibility needs, or specific sights you want to visit? Let your guide know.
              </p>
              <textarea
                id="details-special-requests"
                rows={3}
                value={bookingState.specialRequests}
                onChange={(e) => onUpdateBooking({ specialRequests: e.target.value })}
                placeholder="Enter your requests here..."
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-400"
              />
            </div>

            {/* Protection Notice */}
            <div className="bg-stone-100/80 p-5 rounded-2xl border border-stone-200 flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-stone-900">
                  Your Booking is Protected
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We ensure a secure payment process and offer free cancellation up to 48 hours before your scheduled tour. Your satisfaction is our royal standard.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Summary Card */}
          <div className="lg:col-span-4 bg-white p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-6 sticky top-24">
            <h2 className="font-serif-luxury text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
              Booking Summary
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Guide Fee ({bookingState.duration.includes('Half') ? 'Half Day' : 'Full Day'})</span>
                <span className="font-medium text-stone-900">
                  ฿{bookingState.guideFee.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-stone-600 items-center">
                <span>Service Fee</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs line-through text-stone-400">฿150</span>
                  <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                    ฿0 Free
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-baseline justify-between">
                <div>
                  <span className="block text-xs font-semibold text-stone-700">Total Amount</span>
                  <span className="text-[10px] text-stone-600">Taxes included</span>
                </div>
                <span className="font-serif-luxury text-3xl font-bold text-stone-900">
                  ฿{bookingState.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <div className="space-y-2.5 pt-2">
              <button
                id="proceed-to-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-6 bg-[#d4a326] hover:bg-[#b88c1c] text-[#1c1d1f] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-stone-600">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Policy and Trust Section */}
        <div className="pt-12 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-600">
          <div>
            <h3 className="font-serif-luxury text-base font-bold text-stone-900 mb-3">
              Booking Policy
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <span><strong>Free Cancellation</strong> up to 48 hours before the start time.</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <span>Changes to the itinerary can be discussed directly with your guide post-booking.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif-luxury text-base font-bold text-stone-900 mb-3">
              Why Book with GoThailand?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#b5892b]" />
                <span className="font-medium text-stone-800">Vetted Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#b5892b]" />
                <span className="font-medium text-stone-800">24/7 Concierge</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#b5892b]" />
                <span className="font-medium text-stone-800">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#b5892b]" />
                <span className="font-medium text-stone-800">Royal Standards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
