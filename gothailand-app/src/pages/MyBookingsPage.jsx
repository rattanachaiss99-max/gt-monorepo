import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';

/**
 * MyBookingsPage — /my-bookings
 * -------------------------------------------------------------
 * แสดงประวัติคำสั่งจองทั้งหมดของนักท่องเที่ยว (Cars, Accommodations, Guides)
 * พร้อมระบบกรองประเภทบริการ, การดู E-Voucher / ใบเสร็จรับเงินเสมือน,
 * และรองรับการดึงข้อมูลทั้งจาก Backend API และ LocalStorage Fallback
 */

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all | car | accommodation | guide
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [copyStatus, setCopyStatus] = useState(null);

  // ตรวจสอบการเข้าสู่ระบบ
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated) {
      navigate('/login?redirect=/my-bookings', { replace: true });
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const identifier = user?.email || user?._id || user?.id;
        const data = await bookingService.getUserBookings(identifier);
        setBookings(data || []);
      } catch (err) {
        console.error('โหลดข้อมูลการจองไม่สำเร็จ:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAuthenticated, user, navigate]);

  const handleCopyRef = (refId) => {
    navigator.clipboard?.writeText(refId);
    setCopyStatus(refId);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  // กรองรายการตามประเภทบริการ
  const filteredBookings = bookings.filter((b) => {
    if (filterType === 'all') return true;
    if (b.serviceType === filterType) return true;
    if (Array.isArray(b.items) && b.items.some((item) => item.type === filterType)) return true;
    return false;
  });

  const getServiceBadge = (type) => {
    switch (type) {
      case 'car':
        return { label: 'รถเช่า (Car)', bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🚗' };
      case 'accommodation':
        return { label: 'ที่พัก (Hotel)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '🏨' };
      case 'guide':
        return { label: 'ไกด์ (Guide)', bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🧭' };
      default:
        return { label: 'ท่องเที่ยว (Trip)', bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: '✨' };
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-[11px] tracking-wide text-slate-400 flex items-center gap-2 mb-4">
          <Link to="/" className="hover:text-slate-700 transition">หน้าแรก</Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">การจองของฉัน</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span>📋</span>
              <span>การจองของฉัน (My Bookings)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ประวัติและใบเสร็จคำสั่งจองบริการท่องเที่ยวทั้งหมดของคุณ ({bookings.length} รายการ)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/accommodations"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition shadow-2xs flex items-center gap-1.5"
            >
              <span>🏨</span>
              <span>จองที่พักเพิ่ม</span>
            </Link>
            <Link
              to="/cars"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition shadow-2xs flex items-center gap-1.5"
            >
              <span>🚗</span>
              <span>จองรถเช่าเพิ่ม</span>
            </Link>
            <Link
              to="/guides"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition shadow-2xs flex items-center gap-1.5"
            >
              <span>🧭</span>
              <span>จองไกด์เพิ่ม</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none text-xs font-semibold">
          {[
            { id: 'all', label: 'ทั้งหมด (All)', icon: '📦' },
            { id: 'car', label: 'รถเช่า (Cars)', icon: '🚗' },
            { id: 'accommodation', label: 'ที่พัก (Hotels)', icon: '🏨' },
            { id: 'guide', label: 'ไกด์นำเที่ยว (Guides)', icon: '🧭' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#0a192f] text-amber-400 font-bold shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-normal">
                {tab.id === 'all'
                  ? bookings.length
                  : bookings.filter((b) => b.serviceType === tab.id || b.items?.some((i) => i.type === tab.id)).length}
              </span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-serif font-semibold text-slate-800 text-base">กำลังโหลดประวัติการจองของคุณ...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl mx-auto mb-4">
              🧳
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-lg sm:text-xl mb-2">
              {filterType === 'all' ? 'ยังไม่มีประวัติการจองในระบบ' : 'ไม่พบรายการจองในหมวดหมู่นี้'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              คุณยังไม่มีรายการจองที่เสร็จสมบูรณ์ เริ่มต้นวางแผนทริปท่องเที่ยวไทยด้วยการจองที่พัก รถเช่า หรือไกด์นำเที่ยวได้เลย
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/cars"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
              >
                🚗 จองรถเช่า
              </Link>
              <Link
                to="/accommodations"
                className="px-5 py-2.5 bg-[#0a192f] hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
              >
                🏨 ค้นหาที่พัก
              </Link>
              <Link
                to="/guides"
                className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
              >
                🧭 เลือกไกด์นำเที่ยว
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => {
              const primaryItem = booking.items?.[0] || {};
              const badge = getServiceBadge(primaryItem.type || booking.serviceType);
              const formattedDate = booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'เมื่อสักครู่';

              return (
                <div
                  key={booking.id || booking.bookingRef}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition duration-200"
                >
                  {/* Card Top Banner */}
                  <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${badge.bg} flex items-center gap-1.5`}>
                        <span>{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>

                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="text-slate-400">Ref:</span>
                        <span className="font-mono font-bold text-slate-900">{booking.bookingRef}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyRef(booking.bookingRef)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer text-xs ml-1"
                          title="คัดลอกรหัสอ้างอิง"
                        >
                          {copyStatus === booking.bookingRef ? '✓' : '📋'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">จองเมื่อ: {formattedDate}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        ● ยืนยันแล้ว
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Items list */}
                    <div className="lg:col-span-2 space-y-4">
                      {booking.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                {item.type === 'car' ? '🚗' : item.type === 'accommodation' ? '🏨' : '🧭'}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-slate-900 text-base line-clamp-1">
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-xs text-slate-500 mb-1">{item.subtitle}</p>
                            )}

                            {/* Dates badge */}
                            {item.dates?.startDate && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium my-1">
                                <span>📅</span>
                                <span>
                                  {item.dates.startDate}
                                  {item.dates.endDate ? ` → ${item.dates.endDate}` : ''}
                                  {' '}({item.dates.durationDays || 1} {item.type === 'accommodation' ? 'คืน' : 'วัน'})
                                </span>
                              </div>
                            )}

                            {/* Service Specific details */}
                            <div className="text-xs text-slate-600 space-y-0.5 mt-1.5">
                              {item.type === 'car' && (
                                <>
                                  {booking.carRentalDetails?.pickupLocation && (
                                    <p className="flex items-center gap-1.5">
                                      <span className="text-slate-400">จุดรับรถ:</span>
                                      <span className="font-semibold text-slate-800">{booking.carRentalDetails.pickupLocation}</span>
                                    </p>
                                  )}
                                  {booking.carRentalDetails?.returnLocation && (
                                    <p className="flex items-center gap-1.5">
                                      <span className="text-slate-400">จุดคืนรถ:</span>
                                      <span className="font-semibold text-slate-800">{booking.carRentalDetails.returnLocation}</span>
                                    </p>
                                  )}
                                </>
                              )}

                              {item.type === 'guide' && (
                                <>
                                  {booking.guideBookingDetails?.meetingPoint && (
                                    <p className="flex items-center gap-1.5">
                                      <span className="text-slate-400">จุดนัดพบ:</span>
                                      <span className="font-semibold text-slate-800">{booking.guideBookingDetails.meetingPoint}</span>
                                    </p>
                                  )}
                                  {booking.guideBookingDetails?.meetingTime && (
                                    <p className="flex items-center gap-1.5">
                                      <span className="text-slate-400">เวลานัดพบ:</span>
                                      <span className="font-semibold text-slate-800">{booking.guideBookingDetails.meetingTime} น.</span>
                                    </p>
                                  )}
                                </>
                              )}

                              {item.type === 'accommodation' && item.details?.roomName && (
                                <p className="flex items-center gap-1.5">
                                  <span className="text-slate-400">ห้องพัก:</span>
                                  <span className="font-semibold text-slate-800">{item.details.roomName}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {booking.specialRequests && (
                        <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900">
                          <span className="font-bold">💬 คำขอพิเศษ:</span> {booking.specialRequests}
                        </div>
                      )}
                    </div>

                    {/* Right: Payment summary & Actions */}
                    <div className="lg:border-l lg:border-slate-100 lg:pl-6 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="text-xs text-slate-500">
                          <p className="font-semibold text-slate-700 mb-1">ผู้เดินทางหลัก:</p>
                          <p className="font-bold text-slate-900">{booking.traveler?.fullName || user?.name || 'ลูกค้า'}</p>
                          <p>{booking.traveler?.phone}</p>
                          <p>{booking.traveler?.email}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 text-xs">
                          <span className="text-slate-400 block mb-0.5">ชำระผ่าน:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <span>💳</span>
                            <span>
                              {booking.payment?.method === 'promptpay'
                                ? 'PromptPay QR'
                                : booking.payment?.method === 'bank'
                                ? 'Bank Transfer'
                                : 'Credit / Debit Card'}
                            </span>
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-xs text-slate-400 block">ยอดรวมทั้งสิ้น (Total Paid):</span>
                          <span className="font-serif font-bold text-xl sm:text-2xl text-[#0a192f]">
                            ฿{(booking.totalPrice || booking.grandTotal || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setSelectedVoucher(booking)}
                          className="w-full py-2.5 px-4 bg-[#0a192f] hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>🎟️</span>
                          <span>ดูตั๋ว / E-Voucher</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* E-Voucher Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up">
            {/* Modal Header */}
            <div className="bg-[#0a192f] text-white p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedVoucher(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🇹🇭</span>
                <span className="font-serif font-bold tracking-wider uppercase text-amber-400 text-sm">
                  GoThailand Official E-Voucher
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                ใบยืนยันการจองบริการท่องเที่ยว
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Booking Reference: <span className="font-mono font-bold text-white">{selectedVoucher.bookingRef}</span>
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700">
              {/* QR Code Barcode Mock */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-200 shadow-xs mb-2 flex items-center justify-center">
                  {/* SVG QR Code Simulation */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0h30v30H0zm5 5v20h20V5zm5 5h10v10H10zM70 0h30v30H70zm5 5v20h20V5zm5 5h10v10H80zM0 70h30v30H0zm5 5v20h20V5zm5 5h10v10H10zM40 10h10v10H40zm10 20h10v10H50zm-10 10h10v10H40zm20 10h10v10H60zm10 10h10v10H70zm10-10h10v10H80zm10 20h10v10H90zm-50 0h10v10H40zm10 10h10v10H50zm10-10h10v10H60zm-30 0h10v10H30z" />
                  </svg>
                </div>
                <p className="font-mono text-[10px] text-slate-400">สแกนเพื่อตรวจสอบความถูกต้อง ณ จุดบริการ</p>
              </div>

              <div className="space-y-2 border-t border-b border-slate-100 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">ชื่อผู้เดินทาง (Lead Guest):</span>
                  <span className="font-bold text-slate-900">{selectedVoucher.traveler?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">เบอร์โทรติดต่อ:</span>
                  <span className="font-semibold text-slate-900">{selectedVoucher.traveler?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">สถานะการชำระเงิน:</span>
                  <span className="font-bold text-emerald-600">✓ ชำระเงินแล้ว (Paid)</span>
                </div>
              </div>

              {/* Items Summary in Voucher */}
              <div className="space-y-2">
                <p className="font-bold text-slate-800">รายการบริการที่ได้รับสิทธิ์:</p>
                {selectedVoucher.items?.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.dates?.startDate} {item.dates?.endDate ? `→ ${item.dates.endDate}` : ''}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">฿{item.itemTotal?.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Extra Details */}
              {selectedVoucher.guideBookingDetails?.meetingPoint && (
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                  <span className="font-bold">📍 จุดนัดพบไกด์:</span> {selectedVoucher.guideBookingDetails.meetingPoint}
                  {' '}(เวลา {selectedVoucher.guideBookingDetails.meetingTime} น.)
                </div>
              )}

              {selectedVoucher.carRentalDetails?.returnLocation && (
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                  <span className="font-bold">🚗 จุดคืนรถ:</span> {selectedVoucher.carRentalDetails.returnLocation}
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-slate-200">
                <span>ยอดเงินรวมทั้งสิ้น</span>
                <span className="text-base text-amber-600 font-serif">
                  ฿{(selectedVoucher.totalPrice || selectedVoucher.grandTotal || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                🖨️ พิมพ์ใบยืนยัน
              </button>
              <button
                type="button"
                onClick={() => setSelectedVoucher(null)}
                className="px-5 py-2 bg-[#0a192f] hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
