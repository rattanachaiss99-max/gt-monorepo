import React from 'react';
import { X, Printer, Download, CheckCircle2, QrCode } from 'lucide-react';

export const ViewBookingModal = ({
  guide,
  bookingState,
  onClose,
  onDownloadPdf,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0b1a30] text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-amber-400 font-serif-luxury text-xl font-bold">GoThailand</span>
            <p className="text-xs text-stone-300 mt-0.5">Official Tour Voucher & Electronic Ticket</p>
          </div>
          <button
            id="close-view-booking-modal-btn"
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Reference Bar */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Booking Reference</span>
              <p className="font-mono text-lg font-bold text-stone-900">{bookingState.bookingReference}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Confirmed & Paid
              </span>
            </div>
          </div>

          {/* Guide & Traveler Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-stone-100">
            {/* Guide Info */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Assigned Guide</span>
              <div className="flex items-center gap-3">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                />
                <div>
                  <h4 className="font-serif-luxury font-bold text-stone-900">{guide.name}</h4>
                  <p className="text-xs text-stone-500">{guide.location}</p>
                  <p className="text-xs text-amber-600 font-medium">★ {Number(guide.rating).toFixed(1)} Verified Guide</p>
                </div>
              </div>
            </div>

            {/* Traveler Info */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Lead Traveler</span>
              <p className="text-sm font-semibold text-stone-900">
                {bookingState.traveler.firstName} {bookingState.traveler.lastName}
              </p>
              <p className="text-xs text-stone-600">{bookingState.traveler.email}</p>
              <p className="text-xs text-stone-600">{bookingState.traveler.phone}</p>
            </div>
          </div>

          {/* Tour Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Date</span>
              <p className="font-medium text-stone-900">{bookingState.date}</p>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Duration</span>
              <p className="font-medium text-stone-900">{bookingState.duration}</p>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Party Size</span>
              <p className="font-medium text-stone-900">{bookingState.guests} Guests</p>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Paid</span>
              <p className="font-bold text-stone-900">฿{bookingState.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Meeting Point & QR Code */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Meeting Point</span>
              <p className="text-sm font-semibold text-stone-900">{bookingState.meetingPoint}</p>
              <p className="text-xs text-stone-600">Please arrive 10 minutes prior to scheduled start time (9:00 AM).</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-xs flex flex-col items-center shrink-0">
              <QrCode className="w-16 h-16 text-stone-800" />
              <span className="text-[8px] font-mono text-stone-500 mt-1">CHECK-IN QR</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={onDownloadPdf}
              className="px-5 py-2.5 bg-[#0b1a30] hover:bg-[#152a4a] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
