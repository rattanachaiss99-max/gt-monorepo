import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BookingSummaryPanel from '../components/common/BookingSummaryPanel';

/**
 * BookingDetailsPage — /booking/details
 * หน้ากรอกข้อมูลผู้จองและรายละเอียดบริการ
 * รองรับทั้ง 3 บริการ: car, accommodation, guide
 * Auto-fill ข้อมูลจาก user ที่ login อยู่
 */

// Step Indicator component (ใช้ร่วมกัน)
function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: 'เลือกบริการ', done: currentStep > 1 },
    { num: 2, label: 'ข้อมูลการจอง', done: currentStep > 2 },
    { num: 3, label: 'ชำระเงิน', done: currentStep > 3 },
  ];
  return (
    <div className="flex items-center gap-1 sm:gap-2 mb-6 text-xs">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center gap-1 sm:gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-colors ${
            step.num === currentStep
              ? 'bg-[#0a192f] text-amber-400'
              : step.done
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-400'
          }`}>
            {step.done ? '✓' : `0${step.num}`}
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-6 sm:w-10 h-px ${step.done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// FormField helper
function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = 'w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-300';

export default function BookingDetailsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, grandTotal } = useCart();

  // ถ้าตะกร้าว่างหรือไม่ได้ login redirect กลับ
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated) {
      navigate('/login?redirect=/booking/details', { replace: true });
    } else if (items.length === 0) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, items.length, navigate]);

  // ข้อมูลผู้จอง — auto-fill จาก user
  const [traveler, setTraveler] = useState({
    fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // ข้อมูลเฉพาะบริการ (สำหรับรถ)
  const carItem = items.find(i => i.type === 'car');
  const defaultPickup = carItem?.details?.pickupLocation || 'Suvarnabhumi Airport (BKK)';

  const [driverInfo, setDriverInfo] = useState({
    driverName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    licenseCountry: 'Thailand',
    driverAge: '',
    licenseNumber: '',
  });

  const [carRentalDetails, setCarRentalDetails] = useState({
    pickupLocation: defaultPickup,
    returnLocation: defaultPickup,
    sameLocation: true,
  });

  // ข้อมูลเฉพาะบริการ (สำหรับไกด์)
  const [guideBookingDetails, setGuideBookingDetails] = useState({
    meetingPoint: '',
    meetingTime: '08:30',
    preferredLanguage: 'Thai',
  });

  const [specialRequests, setSpecialRequests] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});

  // ตรวจสอบว่า cart มีบริการประเภทไหนบ้าง
  const hasCarItems = items.some(i => i.type === 'car');
  const hasAccommodation = items.some(i => i.type === 'accommodation');
  const hasGuide = items.some(i => i.type === 'guide');

  const validate = () => {
    const newErrors = {};
    if (!traveler.fullName.trim()) newErrors.fullName = 'กรุณากรอกชื่อ-นามสกุล';
    if (!traveler.email.trim()) newErrors.email = 'กรุณากรอก Email';
    if (!traveler.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทร';
    if (hasCarItems && !driverInfo.driverAge) newErrors.driverAge = 'กรุณากรอกอายุผู้ขับขี่';
    if (hasGuide && !guideBookingDetails.meetingPoint.trim()) {
      newErrors.meetingPoint = 'กรุณาระบุจุดนัดพบ หรือโรงแรมที่ต้องการให้ไปรับ';
    }
    if (!acceptTerms) newErrors.terms = 'กรุณายอมรับข้อกำหนดและเงื่อนไข';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    navigate('/checkout', {
      state: {
        traveler,
        driverInfo: hasCarItems ? driverInfo : null,
        carRentalDetails: hasCarItems ? carRentalDetails : null,
        guideBookingDetails: hasGuide ? guideBookingDetails : null,
        specialRequests,
        fromDetails: true,
      },
    });
  };

  if (!isAuthenticated || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-[11px] tracking-wide text-slate-400 flex items-center gap-2 mb-4">
          <Link to="/" className="hover:text-slate-700 transition">หน้าแรก</Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">ข้อมูลการจอง</span>
        </nav>

        <StepIndicator currentStep={2} />

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-6">
          Complete Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ฝั่งซ้าย — ฟอร์ม */}
          <div className="lg:col-span-2 space-y-5">

            {/* รายการที่เลือก */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h2 className="font-serif font-semibold text-slate-900 mb-3 text-sm">รายการที่เลือก</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          {item.type === 'car' ? '🚗' : item.type === 'accommodation' ? '🏨' : '🧭'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 line-clamp-1">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                      {item.dates?.startDate && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          📅 {item.dates.startDate} {item.dates.endDate ? `→ ${item.dates.endDate}` : ''}
                          {' '}({item.dates.durationDays || 1} {item.type === 'accommodation' ? 'คืน' : 'วัน'})
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-slate-900">฿{item.itemTotal?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ข้อมูลผู้เดินทาง */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-7 h-7 rounded-full bg-[#0a192f] text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <h2 className="font-serif font-semibold text-slate-900">ข้อมูลผู้เดินทาง</h2>
              </div>

              <FormField label="ชื่อ-นามสกุล" required>
                <input
                  type="text"
                  className={`${inputClass} ${errors.fullName ? 'border-rose-300 focus:border-rose-400' : ''}`}
                  value={traveler.fullName}
                  onChange={(e) => setTraveler(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="ชื่อและนามสกุล (ตรงกับพาสปอร์ต)"
                />
                {errors.fullName && <p className="text-rose-500 text-[11px] mt-1">{errors.fullName}</p>}
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Email Address" required>
                  <input
                    type="email"
                    className={`${inputClass} ${errors.email ? 'border-rose-300' : ''}`}
                    value={traveler.email}
                    onChange={(e) => setTraveler(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
                </FormField>

                <FormField label="เบอร์โทรติดต่อ" required>
                  <input
                    type="tel"
                    className={`${inputClass} ${errors.phone ? 'border-rose-300' : ''}`}
                    value={traveler.phone}
                    onChange={(e) => setTraveler(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+66 8x-xxxx-xxxx"
                  />
                  {errors.phone && <p className="text-rose-500 text-[11px] mt-1">{errors.phone}</p>}
                </FormField>
              </div>

              <FormField label="ที่อยู่ / Address">
                <input
                  type="text"
                  className={inputClass}
                  value={traveler.address}
                  onChange={(e) => setTraveler(p => ({ ...p, address: e.target.value }))}
                  placeholder="ที่อยู่สำหรับออกใบเสร็จ (ถ้ามี)"
                />
              </FormField>
            </div>

            {/* ข้อมูลเฉพาะบริการ — รถเช่า */}
            {hasCarItems && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full bg-[#0a192f] text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <h2 className="font-serif font-semibold text-slate-900">ข้อมูลผู้ขับขี่ (Driver Information)</h2>
                </div>

                <FormField label="ชื่อผู้ขับขี่ (ตรงกับใบขับขี่)" required>
                  <input
                    type="text"
                    className={inputClass}
                    value={driverInfo.driverName}
                    onChange={(e) => setDriverInfo(p => ({ ...p, driverName: e.target.value }))}
                    placeholder="Full Name as on License"
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="ประเทศที่ออกใบขับขี่">
                    <select
                      className={inputClass}
                      value={driverInfo.licenseCountry}
                      onChange={(e) => setDriverInfo(p => ({ ...p, licenseCountry: e.target.value }))}
                    >
                      {['Thailand', 'United States', 'United Kingdom', 'Japan', 'China', 'South Korea', 'Australia', 'Germany', 'France', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="อายุผู้ขับขี่" required>
                    <input
                      type="number"
                      min="18"
                      max="99"
                      className={`${inputClass} ${errors.driverAge ? 'border-rose-300' : ''}`}
                      value={driverInfo.driverAge}
                      onChange={(e) => setDriverInfo(p => ({ ...p, driverAge: e.target.value }))}
                      placeholder="อายุ (ต้องอายุ 21 ปีขึ้นไป)"
                    />
                    {errors.driverAge && <p className="text-rose-500 text-[11px] mt-1">{errors.driverAge}</p>}
                  </FormField>
                </div>

                <FormField label="เลขใบขับขี่ (License Number)">
                  <input
                    type="text"
                    className={inputClass}
                    value={driverInfo.licenseNumber}
                    onChange={(e) => setDriverInfo(p => ({ ...p, licenseNumber: e.target.value }))}
                    placeholder="DL-xxxxxxxxxx"
                  />
                </FormField>

                {/* จุดรับ-คืนรถ และเที่ยวบิน */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-700">จุดรับ-คืนรถ และข้อมูลการเดินทาง</p>
                  
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">📍 จุดรับรถ (Pickup):</span>
                    <span className="font-bold text-slate-800">{carRentalDetails.pickupLocation}</span>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={carRentalDetails.sameLocation}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setCarRentalDetails(p => ({
                            ...p,
                            sameLocation: checked,
                            returnLocation: checked ? p.pickupLocation : '',
                          }));
                        }}
                        className="accent-amber-500 rounded cursor-pointer"
                      />
                      <span>คืนรถที่เดียวกับจุดรับรถ (Return to same location)</span>
                    </label>

                    {!carRentalDetails.sameLocation && (
                      <FormField label="จุดคืนรถที่ต้องการ (Drop-off Location)">
                        <input
                          type="text"
                          className={inputClass}
                          value={carRentalDetails.returnLocation}
                          onChange={(e) => setCarRentalDetails(p => ({ ...p, returnLocation: e.target.value }))}
                          placeholder="เช่น Don Mueang Airport (DMK) หรือ สำนักงานในเมือง"
                        />
                      </FormField>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ที่พัก — ข้อมูลเพิ่มเติม */}
            {hasAccommodation && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[#0a192f] text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {hasCarItems ? '3' : '2'}
                  </span>
                  <h2 className="font-serif font-semibold text-slate-900">ความต้องการพิเศษ (ที่พัก)</h2>
                </div>
                <p className="text-xs text-slate-500 mb-3">ระบุความต้องการพิเศษเพิ่มเติม เช่น ห้องชั้นสูง เตียงใหญ่ หรือเวลาคาดว่าจะถึง</p>
                <textarea
                  className={`${inputClass} h-20 resize-none`}
                  placeholder="ระบุความต้องการพิเศษ เช่น early check-in, smoking room, etc."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            )}

            {/* ไกด์ — ข้อมูลเพิ่มเติม */}
            {hasGuide && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full bg-[#0a192f] text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {hasCarItems && hasAccommodation ? '4' : hasCarItems || hasAccommodation ? '3' : '2'}
                  </span>
                  <h2 className="font-serif font-semibold text-slate-900">รายละเอียดการนัดพบ (ไกด์นำเที่ยว)</h2>
                </div>

                <FormField label="จุดนัดพบ หรือ โรงแรมที่ให้ไปรับ (Meeting Point / Hotel Pickup)" required>
                  <input
                    type="text"
                    className={`${inputClass} ${errors.meetingPoint ? 'border-rose-300 focus:border-rose-400' : ''}`}
                    value={guideBookingDetails.meetingPoint}
                    onChange={(e) => setGuideBookingDetails(p => ({ ...p, meetingPoint: e.target.value }))}
                    placeholder="เช่น ล็อบบี้โรงแรม Centara Grand หรือ ทางออก 2 BTS สยาม"
                  />
                  {errors.meetingPoint && <p className="text-rose-500 text-[11px] mt-1">{errors.meetingPoint}</p>}
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="เวลานัดพบที่ต้องการ (Preferred Time)">
                    <select
                      className={inputClass}
                      value={guideBookingDetails.meetingTime}
                      onChange={(e) => setGuideBookingDetails(p => ({ ...p, meetingTime: e.target.value }))}
                    >
                      {['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '13:00', '14:00'].map(t => (
                        <option key={t} value={t}>{t} น.</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="ภาษาหลักที่ต้องการให้สื่อสาร">
                    <select
                      className={inputClass}
                      value={guideBookingDetails.preferredLanguage}
                      onChange={(e) => setGuideBookingDetails(p => ({ ...p, preferredLanguage: e.target.value }))}
                    >
                      <option value="Thai">ภาษาไทย (Thai)</option>
                      <option value="English">ภาษาอังกฤษ (English)</option>
                      <option value="Chinese">ภาษาจีน (Mandarin)</option>
                      <option value="Japanese">ภาษาญี่ปุ่น (Japanese)</option>
                    </select>
                  </FormField>
                </div>

                <FormField label="ความต้องการพิเศษเพิ่มเติม (ถ้ามี)">
                  <textarea
                    className={`${inputClass} h-18 resize-none`}
                    placeholder="เช่น สถานที่ที่อยากไปเป็นพิเศษ หรือมีเด็ก/ผู้สูงอายุร่วมเดินทาง"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </FormField>
              </div>
            )}

            {/* ข้อตกลง */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className={`flex items-start gap-3 cursor-pointer ${errors.terms ? 'text-rose-600' : ''}`}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-amber-500 cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  ฉันยอมรับ{' '}
                  <span className="text-amber-600 font-semibold underline cursor-pointer">ข้อกำหนดการให้บริการ</span>
                  {', '}
                  <span className="text-amber-600 font-semibold underline cursor-pointer">นโยบายความเป็นส่วนตัว</span>
                  {' '}และ{' '}
                  <span className="text-amber-600 font-semibold underline cursor-pointer">นโยบายการยกเลิก</span>
                  {' '}ของ Go Thailand
                </span>
              </label>
              {errors.terms && <p className="text-rose-500 text-[11px] mt-2 ml-7">{errors.terms}</p>}
            </div>

            {/* ปุ่มดำเนินการต่อ (mobile) */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-[#0a192f] hover:bg-amber-400 hover:text-slate-900 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer"
              >
                ดำเนินการชำระเงิน →
              </button>
            </div>
          </div>

          {/* ฝั่งขวา — Booking Summary */}
          <div className="hidden lg:block">
            <BookingSummaryPanel
              onContinue={handleContinue}
              continueLabel="ดำเนินการชำระเงิน →"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
