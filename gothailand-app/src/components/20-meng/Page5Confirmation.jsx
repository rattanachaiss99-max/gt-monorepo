import React, { useState } from 'react';
import {
  Check,
  Copy,
  CheckCheck,
  Calendar,
  Clock,
  Users,
  Building,
  ShieldCheck,
  Download,
  ArrowRight,
  MessageSquare,
  MapPin,
} from 'lucide-react';

export const Page5Confirmation = ({
  guide,
  bookingState,
  onRestart,
  onOpenContactModal,
  onOpenBookingModal,
  onDownloadReceipt,
}) => {
  const [copied, setCopied] = useState(false);

  const referenceCode = bookingState.bookingReference || 'GT-GUIDE-150926';

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Status Icon & Heading */}
        <div className="text-center space-y-4">
          {/* Amber Rounded Checkmark */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-200/90 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-stone-900 flex items-center justify-center">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-stone-900 stroke-[2.5]" />
            </div>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto leading-relaxed">
            Your local guide experience with {guide.name} has been successfully booked. A confirmation email has been sent to your address.
          </p>

          {/* Booking Reference Box */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white px-6 py-3.5 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                BOOKING REFERENCE:
              </span>
              <span className="font-serif-luxury text-lg font-bold text-stone-900 tracking-wider">
                {referenceCode}
              </span>
              <button
                id="copy-booking-reference-btn"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider pl-2 border-l border-stone-200 cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Card: Guide & Trip Details */}
          <div className="md:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
            {/* Guide Info */}
            <div className="flex items-start gap-4 pb-5 border-b border-stone-100">
              <img
                src={guide.avatar}
                alt={guide.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                    {guide.name}
                  </h3>
                  <div className="flex items-center text-xs font-semibold text-stone-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    <span className="text-amber-500 mr-1">★</span>
                    <span>{Number(guide.rating).toFixed(1)}</span>
                    <span className="text-stone-600 ml-0.5">({guide.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center text-xs text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 mr-1 shrink-0" />
                  <span>{guide.location}</span>
                </div>

                <p className="text-xs text-stone-600 pt-0.5">
                  Specialty: {guide.specialties.join(' & ')}
                </p>
              </div>
            </div>

            {/* 2x2 Details Grid */}
            <div className="grid grid-cols-2 gap-5 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>DATE</span>
                </div>
                <p className="font-medium text-stone-900 text-sm">
                  {bookingState.date || '15 September 2026'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>DURATION</span>
                </div>
                <p className="font-medium text-stone-900 text-sm">
                  {bookingState.duration.includes('Half') ? 'Half Day (4 Hours)' : '1 Day (8 Hours)'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>GUESTS</span>
                </div>
                <p className="font-medium text-stone-900 text-sm">
                  {bookingState.guests} Guests
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                  <Building className="w-3.5 h-3.5 text-stone-400" />
                  <span>MEETING POINT</span>
                </div>
                <p className="font-medium text-stone-900 text-sm">
                  {bookingState.meetingPoint || 'Hotel Lobby - Siam Kempinski'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: Payment Summary */}
          <div className="md:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Payment Successful Badge */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-stone-900">
                    Payment Successful
                  </h3>
                  <p className="text-[11px] text-stone-600">
                    Secure Transaction
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Guide Fee (1 Day)</span>
                  <span className="font-medium text-stone-900">
                    ฿{bookingState.guideFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Service Fee</span>
                  <span className="font-medium text-stone-900">฿0</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-stone-700 tracking-wider uppercase">
                  TOTAL PAID
                </span>
                <span className="font-serif-luxury text-3xl font-bold text-stone-900">
                  ฿{bookingState.totalAmount.toLocaleString()}
                </span>
              </div>

              <button
                id="download-receipt-pdf-btn"
                onClick={onDownloadReceipt}
                className="w-full py-2.5 px-4 rounded-lg border border-stone-200 hover:border-stone-400 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Receipt (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* What Happens Next? Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-8">
          <h2 className="font-serif-luxury text-2xl font-bold text-stone-900">
            What Happens Next?
          </h2>

          <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-stone-200">
            {/* Step 1 */}
            <div className="relative flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-amber-400 border-4 border-white shadow-xs shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900">
                  Booking Confirmed
                </h3>
                <p className="text-xs text-stone-600">
                  Your booking is secured. You will receive an email shortly with all details.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-stone-300 border-4 border-white shadow-xs shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900">
                  Meet Your Guide
                </h3>
                <p className="text-xs text-stone-600">
                  {guide.name} will meet you at the {bookingState.meetingPoint || 'Siam Kempinski Hotel Lobby'} at 9:00 AM on Sept 15.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-stone-300 border-4 border-white shadow-xs shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900">
                  Enjoy Bangkok
                </h3>
                <p className="text-xs text-stone-600">
                  Experience the vibrant culture and local food scene of Bangkok.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-stone-100">
            <button
              id="view-my-booking-btn"
              onClick={onOpenBookingModal}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0b1a30] hover:bg-[#152a4a] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <span>View My Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="contact-guide-btn"
              onClick={onOpenContactModal}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
