import React, { useState } from 'react';
import {
  Check,
  User,
  CreditCard,
  Lock,
  Calendar,
  Users,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Guide, BookingState } from '../types';

interface Page4CheckoutProps {
  guide: Guide;
  bookingState: BookingState;
  onUpdateBooking: (updates: Partial<BookingState>) => void;
  onConfirmPayment: () => Promise<void>;
  onBackToDetails: () => void;
  isProcessing: boolean;
}

export const Page4Checkout: React.FC<Page4CheckoutProps> = ({
  guide,
  bookingState,
  onUpdateBooking,
  onConfirmPayment,
  onBackToDetails,
  isProcessing,
}) => {
  const [firstName, setFirstName] = useState(bookingState.traveler.firstName || 'Alex');
  const [lastName, setLastName] = useState(bookingState.traveler.lastName || 'Smith');
  const [email, setEmail] = useState(bookingState.traveler.email || 'alex.smith@email.com');
  const [phone, setPhone] = useState(bookingState.traveler.phone || '+1 234 567 8900');

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'promptpay'>(
    bookingState.payment.method || 'card'
  );
  const [cardNumber, setCardNumber] = useState(bookingState.payment.cardNumber || '4242 •••• •••• 4242');
  const [cardName, setCardName] = useState(bookingState.payment.cardName || 'Alex Smith');
  const [expiry, setExpiry] = useState(bookingState.payment.expiry || '08/28');
  const [cvv, setCvv] = useState(bookingState.payment.cvv || '888');
  const [agreedToTerms, setAgreedToTerms] = useState(bookingState.payment.agreedToTerms ?? true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMsg('Please agree to the Terms and Conditions and Privacy Policy to proceed.');
      return;
    }
    if (!firstName || !lastName || !email) {
      setErrorMsg('Please fill in required traveler information.');
      return;
    }
    setErrorMsg(null);

    onUpdateBooking({
      traveler: { firstName, lastName, email, phone },
      payment: {
        method: paymentMethod,
        cardNumber,
        cardName,
        expiry,
        cvv,
        agreedToTerms,
      },
    });

    await onConfirmPayment();
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-stone-500 font-medium">
          <button
            onClick={onBackToDetails}
            className="hover:text-stone-900 cursor-pointer"
          >
            Home
          </button>
          <span>›</span>
          <span className="hover:text-stone-900 cursor-pointer">Local Guide</span>
          <span>›</span>
          <span className="hover:text-stone-900 cursor-pointer">{guide.name}</span>
          <span>›</span>
          <span className="text-stone-900 font-semibold">Checkout</span>
        </nav>

        {/* Stepper with Checkmarks */}
        <div className="max-w-xl mx-auto py-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-stone-200 -z-0" />

            {/* Step 1 Done */}
            <div className="relative z-10 flex flex-col items-center bg-[#faf9f6] px-2">
              <div className="w-7 h-7 rounded-full bg-[#8a681c] text-white flex items-center justify-center text-xs font-bold">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-stone-600 mt-1.5">Guide</span>
            </div>

            {/* Step 2 Done */}
            <div className="relative z-10 flex flex-col items-center bg-[#faf9f6] px-2">
              <div className="w-7 h-7 rounded-full bg-[#8a681c] text-white flex items-center justify-center text-xs font-bold">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-stone-600 mt-1.5">Details</span>
            </div>

            {/* Step 3 Active */}
            <div className="relative z-10 flex flex-col items-center bg-[#faf9f6] px-2">
              <div className="w-7 h-7 rounded-full bg-[#0b1a30] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                3
              </div>
              <span className="text-xs font-bold text-stone-900 mt-1.5">Checkout</span>
            </div>

            {/* Step 4 Upcoming */}
            <div className="relative z-10 flex flex-col items-center bg-[#faf9f6] px-2">
              <div className="w-7 h-7 rounded-full border border-stone-300 bg-white text-stone-400 flex items-center justify-center text-xs font-semibold">
                4
              </div>
              <span className="text-xs font-medium text-stone-400 mt-1.5">Done</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Secure Checkout
          </h1>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Forms */}
          <form onSubmit={handlePay} className="lg:col-span-8 space-y-6">
            {/* Traveler Information */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-stone-900">
                <User className="w-4 h-4 text-stone-700" />
                <h2 className="font-serif-luxury text-lg sm:text-xl font-bold">
                  Traveler Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="checkout-first-name"
                    className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1"
                  >
                    FIRST NAME
                  </label>
                  <input
                    id="checkout-first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 border-b border-stone-300 hover:border-stone-500 focus:border-stone-900 text-sm font-medium text-stone-900 focus:outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-last-name"
                    className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1"
                  >
                    LAST NAME
                  </label>
                  <input
                    id="checkout-last-name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 border-b border-stone-300 hover:border-stone-500 focus:border-stone-900 text-sm font-medium text-stone-900 focus:outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1"
                  >
                    EMAIL
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border-b border-stone-300 hover:border-stone-500 focus:border-stone-900 text-sm font-medium text-stone-900 focus:outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1"
                  >
                    PHONE NUMBER
                  </label>
                  <input
                    id="checkout-phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border-b border-stone-300 hover:border-stone-500 focus:border-stone-900 text-sm font-medium text-stone-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-stone-900">
                <CreditCard className="w-4 h-4 text-stone-700" />
                <h2 className="font-serif-luxury text-lg sm:text-xl font-bold">
                  Payment Method
                </h2>
              </div>

              {/* Option 1: Credit / Debit Card */}
              <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
                paymentMethod === 'card'
                  ? 'border-stone-900 bg-stone-50/50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}>
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <input
                      id="payment-method-card"
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-[#0b1a30] focus:ring-[#c99726] accent-[#0b1a30]"
                    />
                    <span className="text-sm font-semibold text-stone-900">
                      Credit / Debit Card
                    </span>
                  </div>
                  <CreditCard className="w-5 h-5 text-stone-400" />
                </label>

                {paymentMethod === 'card' && (
                  <div className="mt-5 space-y-4 pt-4 border-t border-stone-200">
                    <div>
                      <label
                        htmlFor="card-number-input"
                        className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        id="card-number-input"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3.5 py-2 border-b border-stone-300 focus:border-stone-900 text-sm font-mono text-stone-900 focus:outline-none bg-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="card-name-input"
                        className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1"
                      >
                        Name on Card
                      </label>
                      <input
                        id="card-name-input"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Cardholder Name"
                        className="w-full px-3.5 py-2 border-b border-stone-300 focus:border-stone-900 text-sm font-medium text-stone-900 focus:outline-none bg-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="card-expiry-input"
                          className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1"
                        >
                          MM/YY
                        </label>
                        <input
                          id="card-expiry-input"
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2 border-b border-stone-300 focus:border-stone-900 text-sm font-medium text-stone-900 focus:outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="card-cvv-input"
                          className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1"
                        >
                          CVV
                        </label>
                        <input
                          id="card-cvv-input"
                          type="password"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3.5 py-2 border-b border-stone-300 focus:border-stone-900 text-sm font-mono text-stone-900 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: PromptPay */}
              <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
                paymentMethod === 'promptpay'
                  ? 'border-stone-900 bg-stone-50/50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}>
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <input
                      id="payment-method-promptpay"
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'promptpay'}
                      onChange={() => setPaymentMethod('promptpay')}
                      className="w-4 h-4 text-[#0b1a30] focus:ring-[#c99726] accent-[#0b1a30]"
                    />
                    <span className="text-sm font-semibold text-stone-900">
                      PromptPay
                    </span>
                  </div>
                  <QrCode className="w-5 h-5 text-stone-400" />
                </label>

                {paymentMethod === 'promptpay' && (
                  <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-stone-100">
                    <div className="w-28 h-28 bg-stone-900 rounded-lg p-2 flex flex-col items-center justify-center text-white text-center shrink-0">
                      <QrCode className="w-16 h-16 text-white" />
                      <span className="text-[9px] tracking-wider uppercase font-mono mt-0.5">PromptPay QR</span>
                    </div>
                    <div className="text-xs text-stone-600 space-y-1 text-center sm:text-left">
                      <p className="font-semibold text-stone-900">Scan via Any Thai Mobile Banking App</p>
                      <p>Instant verification for ฿{bookingState.totalAmount.toLocaleString()}</p>
                      <p className="text-[11px] text-amber-700">QR code valid for 15 minutes upon confirmation.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-start gap-3">
              <input
                id="checkout-agree-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-stone-300 text-[#0b1a30] focus:ring-[#c99726] cursor-pointer accent-[#0b1a30]"
              />
              <label
                htmlFor="checkout-agree-terms"
                className="text-xs text-stone-700 select-none cursor-pointer"
              >
                I agree to the <span className="underline font-medium text-stone-900">Terms and Conditions</span> and <span className="underline font-medium text-stone-900">Privacy Policy</span>.
              </label>
            </div>
          </form>

          {/* Right Column: Booking Summary Card */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-sm space-y-6 sticky top-24">
            <h2 className="font-serif-luxury text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
              Booking Summary
            </h2>

            {/* Selected Guide mini summary */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-stone-100">
              <img
                src={guide.avatar}
                alt={guide.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
              />
              <div className="space-y-0.5">
                <h3 className="font-serif-luxury text-base font-bold text-stone-900">
                  {guide.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {guide.specialties.join(' & ')}
                </p>
                <div className="text-[11px] text-stone-700 flex items-center gap-1 pt-0.5">
                  <span className="text-amber-500 font-bold">★ {guide.rating.toFixed(1)}</span>
                  <span>({guide.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Key details list */}
            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  Date
                </span>
                <span className="font-medium text-stone-900">
                  {bookingState.date || '15 Sep 2026'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  Guests
                </span>
                <span className="font-medium text-stone-900">
                  {bookingState.guests} Guests
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  Duration
                </span>
                <span className="font-medium text-stone-900">
                  {bookingState.duration.includes('Half') ? 'Half Day' : '1 Day'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-2 text-stone-500 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  Meeting Point
                </span>
                <span className="font-medium text-stone-900 text-right">
                  {bookingState.meetingPoint || 'Siam Kempinski Lobby'}
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Guide Fee</span>
                <span className="font-medium text-stone-900">
                  ฿{bookingState.guideFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Service Fee</span>
                <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  ฿0
                </span>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
                <span className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                  TOTAL
                </span>
                <span className="font-serif-luxury text-2xl font-bold text-stone-900">
                  ฿{bookingState.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Confirm & Pay Button */}
            <div className="space-y-3 pt-2">
              <button
                id="confirm-and-pay-btn"
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-[#8a681c] hover:bg-[#725514] text-white font-bold text-xs tracking-wider uppercase rounded-lg shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>CONFIRM & PAY</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Secure Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
