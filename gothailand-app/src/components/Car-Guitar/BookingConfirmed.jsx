import { useNavigate, useLocation } from 'react-router-dom';

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();

  const carName = location?.state?.carName || location?.state?.car?.name || "vehicle";
  const referenceId = location?.state?.bookingId || "GT-CR-2026-00128";

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 flex flex-col justify-center items-center py-16 px-4">
      <div className="w-16 h-16 bg-[#fde9b8] rounded-2xl flex items-center justify-center text-2xl text-[#785b12] mb-6 shadow-sm">
        ✓
      </div>
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Your Car Rental is Confirmed!</h1>
      <p className="text-xs text-slate-500 mb-6 font-light">
        Your {carName} rental has been successfully booked.
      </p>

      <div className="bg-slate-100 border border-slate-200 py-3 px-8 rounded-lg text-center mb-6">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Booking Reference ID</span>
        <span className="text-lg font-serif font-bold text-slate-900 tracking-wider">{referenceId}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full my-6 text-center">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-2xl mb-2">✉️</div>
          <div className="font-bold text-xs text-slate-900 mb-1">01 Check Your Email</div>
          <div className="text-[10px] text-slate-400">Review your detailed itinerary and receipt.</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-2xl mb-2">📄</div>
          <div className="font-bold text-xs text-slate-900 mb-1">02 Prepare Documents</div>
          <div className="text-[10px] text-slate-400">Have your driver's license and passport ready.</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-2xl mb-2">🔑</div>
          <div className="font-bold text-xs text-slate-900 mb-1">03 Pick Up Your Car</div>
          <div className="text-[10px] text-slate-400">Arrive at the designated pickup point.</div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button 
          onClick={() => navigate('/cars')}
          className="bg-[#f2cb6c] hover:bg-[#e4bd58] text-slate-900 px-6 py-2.5 rounded-lg text-xs font-bold transition shadow cursor-pointer"
        >
          View More Cars
        </button>
        <button 
          onClick={() => navigate('/')}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}