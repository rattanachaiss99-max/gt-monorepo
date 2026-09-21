import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BookingSummaryPanel from '../components/common/BookingSummaryPanel';
import bookingService from '../services/bookingService';

/**
 * CheckoutPage — /checkout
 * หน้าชำระเงิน รองรับทั้ง car / accommodation / guide
 * auto-fill ข้อมูลจาก user และข้อมูลจาก BookingDetailsPage
 */

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

const inputClass = 'w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-300';

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'promptpay', label: 'PromptPay', icon: '📱' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { items, grandTotal, clearCart } = useCart();
  const isSuccessRef = useRef(false);

  // ข้อมูลที่ผ่านมาจาก BookingDetailsPage (ถ้าผ่าน)
  const prevState = location.state || {};
  const prefillTraveler = prevState.traveler;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout', { replace: true });
    } else if (items.length === 0 && !isSuccessRef.current) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, items.length, navigate]);

  // ข้อมูลผู้เดินทาง (auto-fill)
  const [traveler, setTraveler] = useState({
    fullName: prefillTraveler?.fullName || (user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''),
    email: prefillTraveler?.email || user?.email || '',
    phone: prefillTraveler?.phone || user?.phone || '',
    country: 'Thailand',
  });

  const [driverInfo] = useState(prevState.driverInfo || null);
  const [carRentalDetails] = useState(prevState.carRentalDetails || null);
  const [guideBookingDetails] = useState(prevState.guideBookingDetails || null);
  const [specialRequests] = useState(prevState.specialRequests || '');

  // วิธีชำระเงิน
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    nameOnCard: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    saveCard: false,
  });

  // Billing Address
  const [billingAddress, setBillingAddress] = useState({
    sameAsTraveler: true,
    address: traveler.address || '',
    city: '',
    postalCode: '',
    country: 'Thailand',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry MM/YY
  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return clean;
  };

  const validate = () => {
    const errs = {};
    if (!traveler.fullName.trim()) errs.fullName = 'กรุณากรอกชื่อ';
    if (!traveler.email.trim()) errs.email = 'กรุณากรอก Email';
    if (!traveler.phone.trim()) errs.phone = 'กรุณากรอกเบอร์โทร';
    if (paymentMethod === 'card') {
      if (!cardInfo.nameOnCard.trim()) errs.nameOnCard = 'กรุณากรอกชื่อ';
      if (cardInfo.cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'เลขบัตรไม่ถูกต้อง';
      if (!cardInfo.expiry || cardInfo.expiry.length < 5) errs.expiry = 'กรุณากรอกวันหมดอายุ';
      if (!cardInfo.cvv || cardInfo.cvv.length < 3) errs.cvv = 'CVV ไม่ถูกต้อง';
    }
    if (!acceptTerms) errs.terms = 'กรุณายอมรับข้อกำหนด';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmPay = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const serviceType = items[0]?.type || 'car';
      const typePrefix = serviceType === 'car' ? 'CR' : serviceType === 'accommodation' ? 'HT' : 'GD';
      const refId = `GT-${typePrefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;

      // Payload สำหรับบันทึกคำสั่งจองลงระบบ
      const bookingPayload = {
        bookingRef: refId,
        bookingReferenceId: refId,
        userId: user?._id || user?.id || null,
        userEmail: user?.email || traveler.email,
        items: items.map((item) => ({
          cartItemId: item.cartItemId,
          itemId: item.itemId,
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          image: item.image,
          location: item.location,
          unitPrice: item.unitPrice,
          priceUnitLabel: item.priceUnitLabel,
          quantity: item.quantity || 1,
          dates: item.dates,
          details: item.details,
          itemTotal: item.itemTotal,
        })),
        serviceType: items.length > 1 ? 'mixed' : serviceType,
        dates: {
          startDate: items[0]?.dates?.startDate || new Date().toISOString().split('T')[0],
          endDate: items[0]?.dates?.endDate || items[0]?.dates?.startDate || new Date().toISOString().split('T')[0],
          durationDays: items[0]?.dates?.durationDays || 1,
        },
        totalPrice: grandTotal,
        pricing: {
          subtotal: grandTotal,
          totalPrice: grandTotal,
        },
        traveler,
        driver: driverInfo,
        carRentalDetails,
        guideBookingDetails,
        specialRequests,
        payment: {
          method: paymentMethod,
          cardName: cardInfo.nameOnCard,
          cardNumberMasked: cardInfo.cardNumber
            ? `**** **** **** ${cardInfo.cardNumber.replace(/\s/g, "").slice(-4)}`
            : "**** 0000",
          expiryDate: cardInfo.expiry,
          saveCardForFuture: cardInfo.saveCard,
          sameAsTravelerAddress: billingAddress.sameAsTraveler,
        },
        billingAddress,
        status: 'confirmed',
        paymentStatus: 'paid',
        termsAccepted: acceptTerms,
      };

      // บันทึกคำสั่งจองผ่าน bookingService (Dual-mode: Backend First + LocalStorage fallback)
      isSuccessRef.current = true;
      const savedBooking = await bookingService.saveBooking(bookingPayload);
      const finalRefId = savedBooking?.bookingReferenceId || savedBooking?.bookingRef || refId;
      const confirmedItems = items.map((i) => ({ title: i.title, itemTotal: i.itemTotal }));

      clearCart();
      navigate('/booking/confirmed', {
        state: {
          bookingRef: finalRefId,
          bookingId: savedBooking?._id || savedBooking?.id,
          serviceType,
          traveler,
          grandTotal,
          items: confirmedItems,
        },
        replace: true,
      });
    } catch (err) {
      isSuccessRef.current = false;
      console.error('Failed to create booking:', err);
      alert(
        err?.response?.data?.message ||
        'เกิดข้อผิดพลาดในการบันทึกการจอง กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || (items.length === 0 && !isSuccessRef.current)) return null;

  const hasCarItems = items.some(i => i.type === 'car');

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-[11px] tracking-wide text-slate-400 flex items-center gap-2 mb-4">
          <Link to="/" className="hover:text-slate-700 transition">หน้าแรก</Link>
          <span>/</span>
          {prevState.fromDetails && (
            <>
              <button onClick={() => navigate(-1)} className="hover:text-slate-700 transition cursor-pointer">ข้อมูลการจอง</button>
              <span>/</span>
            </>
          )}
          <span className="text-slate-600 font-semibold">ชำระเงิน</span>
        </nav>

        <StepIndicator currentStep={3} />

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ฝั่งซ้าย */}
          <div className="lg:col-span-2 space-y-5">

            {/* ข้อมูลผู้เดินทาง */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-base">👤</span>
                <h2 className="font-serif font-semibold text-slate-900">ข้อมูลผู้เดินทาง</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name">
                  <input
                    type="text"
                    className={`${inputClass} ${errors.fullName ? 'border-rose-300' : ''}`}
                    value={traveler.fullName}
                    onChange={(e) => setTraveler(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="ชื่อ-นามสกุล"
                  />
                  {errors.fullName && <p className="text-rose-500 text-[11px] mt-1">{errors.fullName}</p>}
                </FormField>

                <FormField label="Email">
                  <input
                    type="email"
                    className={`${inputClass} ${errors.email ? 'border-rose-300' : ''}`}
                    value={traveler.email}
                    onChange={(e) => setTraveler(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
                </FormField>

                <FormField label="Phone">
                  <input
                    type="tel"
                    className={`${inputClass} ${errors.phone ? 'border-rose-300' : ''}`}
                    value={traveler.phone}
                    onChange={(e) => setTraveler(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+66 8x-xxxx-xxxx"
                  />
                  {errors.phone && <p className="text-rose-500 text-[11px] mt-1">{errors.phone}</p>}
                </FormField>

                <FormField label="Country">
                  <select
                    className={inputClass}
                    value={traveler.country}
                    onChange={(e) => setTraveler(p => ({ ...p, country: e.target.value }))}
                  >
                    {['Thailand', 'United States', 'United Kingdom', 'Japan', 'China', 'South Korea', 'Australia', 'Germany', 'France', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {/* ข้อมูลผู้ขับขี่ (ถ้ามี car) */}
            {hasCarItems && driverInfo && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚗</span>
                  <h2 className="font-serif font-semibold text-slate-900">ข้อมูลผู้ขับขี่</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Driver Name</p>
                    <p className="font-medium">{driverInfo.driverName || traveler.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">License Country</p>
                    <p className="font-medium">{driverInfo.licenseCountry}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Driver Age</p>
                    <p className="font-medium">{driverInfo.driverAge}</p>
                  </div>
                  {driverInfo.licenseNumber && (
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">License Number</p>
                      <p className="font-medium">{driverInfo.licenseNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-base">💳</span>
                <h2 className="font-serif font-semibold text-slate-900">วิธีชำระเงิน</h2>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all cursor-pointer text-xs font-semibold ${
                      paymentMethod === method.id
                        ? 'border-[#0a192f] bg-[#0a192f]/5 text-[#0a192f]'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-[10px] sm:text-xs text-center leading-tight">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-2">
                  <FormField label="Name on Card">
                    <input
                      type="text"
                      className={`${inputClass} ${errors.nameOnCard ? 'border-rose-300' : ''}`}
                      value={cardInfo.nameOnCard}
                      onChange={(e) => setCardInfo(p => ({ ...p, nameOnCard: e.target.value }))}
                      placeholder="ชื่อบนบัตร"
                    />
                    {errors.nameOnCard && <p className="text-rose-500 text-[11px] mt-1">{errors.nameOnCard}</p>}
                  </FormField>

                  <FormField label="Card Number">
                    <input
                      type="text"
                      inputMode="numeric"
                      className={`${inputClass} font-mono tracking-widest ${errors.cardNumber ? 'border-rose-300' : ''}`}
                      value={cardInfo.cardNumber}
                      onChange={(e) => setCardInfo(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                    {errors.cardNumber && <p className="text-rose-500 text-[11px] mt-1">{errors.cardNumber}</p>}
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Expiry Date">
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`${inputClass} ${errors.expiry ? 'border-rose-300' : ''}`}
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiry && <p className="text-rose-500 text-[11px] mt-1">{errors.expiry}</p>}
                    </FormField>

                    <FormField label="CVV">
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`${inputClass} ${errors.cvv ? 'border-rose-300' : ''}`}
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cvv && <p className="text-rose-500 text-[11px] mt-1">{errors.cvv}</p>}
                    </FormField>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={cardInfo.saveCard}
                      onChange={(e) => setCardInfo(p => ({ ...p, saveCard: e.target.checked }))}
                      className="accent-amber-500 w-4 h-4"
                    />
                    บันทึกบัตรสำหรับการจองครั้งถัดไป
                  </label>
                </div>
              )}

              {/* PromptPay */}
              {paymentMethod === 'promptpay' && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-36 h-36 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                    <div className="text-center">
                      <div className="text-4xl mb-1">📱</div>
                      <p className="text-xs text-slate-500 font-medium">PromptPay QR</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-center max-w-xs">
                    สแกน QR Code ด้วยแอปธนาคารของคุณ เพื่อชำระยอด{' '}
                    <span className="font-bold text-slate-900">฿{grandTotal.toLocaleString()}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">หมายเลข PromptPay: 0812-345-6789 (Go Thailand Co., Ltd.)</p>
                </div>
              )}

              {/* Bank Transfer */}
              {paymentMethod === 'bank' && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 mb-2">ข้อมูลบัญชีธนาคาร</p>
                  {[
                    ['ธนาคาร', 'กสิกรไทย (KBank)'],
                    ['ชื่อบัญชี', 'Go Thailand Co., Ltd.'],
                    ['เลขบัญชี', '123-4-56789-0'],
                    ['ยอดที่ต้องโอน', `฿${grandTotal.toLocaleString()}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                  ))}
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
                    ⚠️ กรุณาโอนภายใน 24 ชั่วโมง และส่งสลิปมาที่ support@gothailand.com
                  </p>
                </div>
              )}
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📋</span>
                <h2 className="font-serif font-semibold text-slate-900">ที่อยู่สำหรับออกใบเสร็จ</h2>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={billingAddress.sameAsTraveler}
                  onChange={(e) => setBillingAddress(p => ({ ...p, sameAsTraveler: e.target.checked }))}
                  className="accent-amber-500 w-4 h-4"
                />
                ใช้ที่อยู่เดียวกับผู้เดินทาง
              </label>

              {!billingAddress.sameAsTraveler && (
                <textarea
                  className={`${inputClass} h-20 resize-none`}
                  placeholder="ระบุที่อยู่สำหรับออกใบเสร็จ"
                  value={billingAddress.address}
                  onChange={(e) => setBillingAddress(p => ({ ...p, address: e.target.value }))}
                />
              )}
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className={`flex items-start gap-3 cursor-pointer ${errors.terms ? 'text-rose-500' : 'text-slate-600'}`}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-amber-500 cursor-pointer shrink-0"
                />
                <span className="text-xs leading-relaxed">
                  ฉันยอมรับ{' '}
                  <span className="text-amber-600 font-semibold underline">Terms of Service</span>
                  {', '}
                  <span className="text-amber-600 font-semibold underline">Privacy Policy</span>
                  {' '}และ{' '}
                  <span className="text-amber-600 font-semibold underline">Rental Policy</span>
                </span>
              </label>
              {errors.terms && <p className="text-rose-500 text-[11px] mt-2 ml-7">{errors.terms}</p>}
            </div>

            {/* ปุ่มบน mobile */}
            <div className="lg:hidden space-y-2">
              <button
                type="button"
                onClick={handleConfirmPay}
                disabled={submitting}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-slate-900 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />กำลังดำเนินการ...</>
                ) : (
                  <>✅ ยืนยันและชำระเงิน →</>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full text-sm text-slate-500 hover:text-slate-800 py-2 transition cursor-pointer"
              >
                ← กลับไปหน้าข้อมูลการจอง
              </button>
            </div>
          </div>

          {/* ฝั่งขวา */}
          <div className="hidden lg:block space-y-3">
            <BookingSummaryPanel
              onContinue={handleConfirmPay}
              continueLabel={submitting ? 'กำลังดำเนินการ...' : '✅ ยืนยันและชำระเงิน →'}
              loading={submitting}
            />
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full text-sm text-slate-500 hover:text-slate-800 py-2 transition cursor-pointer text-center"
            >
              ← กลับไปหน้าข้อมูลการจอง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
