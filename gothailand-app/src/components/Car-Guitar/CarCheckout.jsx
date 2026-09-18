import { useRef, useState } from "react";
import Button from "./Button";
import BookingSummary from "./BookingSummary";
import CheckoutSection from "./CheckoutSection";
import FormField, { inputClassName } from "./FormField";
import PaymentPanel from "./PaymentPanel";
import SiteFooter from "../../../../../../go-thailand-jsd13-grp8-s2/go-Thailand-Guitar/src/components/SiteFooter";
import SiteHeader from "../../../../../../go-thailand-jsd13-grp8-s2/go-Thailand-Guitar/src/components/SiteHeader";

const initialForm = {
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1 234 567 890",
  country: "United States",
  driverName: "John Doe",
  licenseCountry: "United States",
  driverAge: "35",
  licenseNumber: "DL-12345678",
  cardName: "John Doe",
  cardNumber: "0000 0000 0000 0000",
  expiryDate: "MM/YY",
  cvv: "123",
  saveCard: false,
  sameAsTraveler: true,
  terms: false,
};

export default function CarCheckout() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const summaryRef = useRef(null);

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (!form.fullName || !form.email || !form.driverName || !form.licenseNumber) {
      setError("Please complete the traveler and driver information.");
      return;
    }
    if (!form.terms) {
      setError("Please accept the Terms of Service and Rental Policy to continue.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // ส่งข้อมูลฟอร์มพร้อมข้อมูลสรุปค่าใช้จ่ายไปยัง Backend
      const payload = {
        carName: "Toyota Fortuner",
        carImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=240",
        carDetails: "SUV · 7 Seats · Diesel",
        carRating: "4.9",
        pickupReturn: "Suvarnabhumi Airport (BKK), Bangkok",
        dates: "Oct 15, 10:00 AM - Oct 18, 10:00 AM (3 Days)",
        rentalPrice: 7500,
        serviceFee: 0,
        totalPrice: 7500,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        driverName: form.driverName,
        licenseCountry: form.licenseCountry,
        driverAge: form.driverAge,
        licenseNumber: form.licenseNumber,
        paymentMethod: paymentMethod,
        cardName: form.cardName,
        cardNumber: form.cardNumber,
        expiryDate: form.expiryDate,
        cvv: form.cvv,
        saveCard: form.saveCard,
        sameAsTraveler: form.sameAsTraveler,
        termsAccepted: form.terms
      };

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create booking");

      setIsConfirmed(true);
    } catch (err) {
      setError(err.message || "Something went wrong while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div id="top" className="min-h-screen w-full bg-[#FDFBF7] font-sans text-gray-900 antialiased">
      <SiteHeader />
      {isConfirmed ? <Confirmation /> : (
        <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
          <p className="mb-2 text-xs text-gray-500">Home &gt; Car Rental &gt; Booking &gt; <span className="font-medium text-gray-900">Checkout</span></p>
          <h1 className="mb-6 font-serif text-3xl font-bold text-gray-900">Checkout</h1>
          <CheckoutStepper />
          <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <TravelerSection form={form} onChange={handleChange} />
              <DriverSection form={form} onChange={handleChange} />
              <PaymentPanel paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} form={form} onChange={handleChange} />
              <BillingSection form={form} onChange={handleChange} />
              <label className="flex cursor-pointer items-start gap-2.5 px-1 text-xs leading-relaxed text-gray-600">
                <input type="checkbox" checked={form.terms} onChange={handleChange("terms")} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-0" />
                <span>I agree to the <a href="#terms" className="text-black underline">Terms of Service</a>, <a href="#privacy" className="text-black underline">Privacy Policy</a>, and <a href="#rental-policy" className="text-black underline">Rental Policy</a>.</span>
              </label>
              {error && <p role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            </div>
            <div ref={summaryRef}>
              <BookingSummary onConfirm={handleSubmit} onBack={handleBack} loading={loading} />
            </div>
          </form>
        </main>
      )}
      <SiteFooter />
    </div>
  );
}

function TravelerSection({ form, onChange }) {
  return <CheckoutSection title="Traveler Information" icon="♙"><div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"><FormField label="Full Name" id="fullName"><input id="fullName" value={form.fullName} onChange={onChange("fullName")} className={inputClassName} autoComplete="name" /></FormField><FormField label="Email" id="email"><input id="email" type="email" value={form.email} onChange={onChange("email")} className={inputClassName} autoComplete="email" /></FormField><FormField label="Phone" id="phone"><input id="phone" value={form.phone} onChange={onChange("phone")} className={inputClassName} autoComplete="tel" /></FormField><FormField label="Country" id="country"><select id="country" value={form.country} onChange={onChange("country")} className={inputClassName}><option>United States</option><option>Thailand</option></select></FormField></div></CheckoutSection>;
}

function DriverSection({ form, onChange }) {
  return <CheckoutSection title="Driver Information" icon="▱"><div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"><FormField label="Driver Full Name" id="driverName"><input id="driverName" value={form.driverName} onChange={onChange("driverName")} className={inputClassName} /></FormField><FormField label="License Country" id="licenseCountry"><select id="licenseCountry" value={form.licenseCountry} onChange={onChange("licenseCountry")} className={inputClassName}><option>United States</option><option>Thailand</option></select></FormField><FormField label="Driver Age" id="driverAge"><input id="driverAge" type="number" value={form.driverAge} onChange={onChange("driverAge")} className={inputClassName} min="18" /></FormField><FormField label="License Number" id="licenseNumber"><input id="licenseNumber" value={form.licenseNumber} onChange={onChange("licenseNumber")} className={inputClassName} /></FormField></div></CheckoutSection>;
}

function BillingSection({ form, onChange }) {
  return <CheckoutSection title="Billing Address" icon="▤" className="flex items-center justify-between p-6"><label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700"><input type="checkbox" checked={form.sameAsTraveler} onChange={onChange("sameAsTraveler")} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-0" />Same as traveler</label></CheckoutSection>;
}

function CheckoutStepper() {
  return <div className="mb-8 flex flex-wrap items-center gap-6 text-xs font-medium text-gray-600"><Step label="Selection" done /><Step label="Details" done /><Step label="Checkout" active /></div>;
}

function Step({ label, done, active }) {
  return <span className={`flex items-center gap-2 ${active ? "font-bold text-black" : ""}`}><span className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${active ? "border-black bg-black text-white" : "border-gray-400 text-gray-600"}`}>{done ? "✓" : "●"}</span>{label}</span>;
}

function Confirmation() {
  return <main className="mx-auto max-w-2xl px-6 py-24 text-center"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3CB68] text-2xl">✓</div><h1 className="font-serif text-3xl font-bold">Booking Confirmed</h1><p className="mt-3 text-gray-600">Your Toyota Fortuner booking has been confirmed and saved to MongoDB.</p><Button variant="primary" className="mt-8 rounded px-6 py-3 text-sm" onClick={() => window.location.reload()}>Book Another Car</Button></main>;
}