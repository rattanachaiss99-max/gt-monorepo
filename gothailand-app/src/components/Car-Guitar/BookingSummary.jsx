import Button from "./Button";

export default function BookingSummary({ 
  car = null, 
  rentalDays = 3, 
  pickupLocation = "Bangkok (BKK) Suvarnabhumi Airport", 
  datesLabel = "", 
  onConfirm, 
  onBack, 
  loading = false 
}) {
  const carName = car?.name || "Rental Car";
  const localFallback = car?.slug ? `/images/cars/${car.slug}.jpg` : "/images/cars/toyota-yaris.jpg";
  const carImage = car?.mainImage || (car?.galleryImages && car.galleryImages[0]) || localFallback;
  const carCategory = car?.category || "Economy";
  const seats = car?.seats || 5;
  const fuel = car?.fuelType || car?.fuel || "Petrol";
  const rating = car?.rating ?? 5.0;
  const dailyPrice = car?.pricePerDay || car?.price || 1200;
  const totalRentalPrice = dailyPrice * rentalDays;
  const displayDates = datesLabel || `Oct 24, 10:00 AM - Oct 27, 10:00 AM (${rentalDays} Days)`;

  return (
    <aside className="md:col-span-1 md:sticky md:top-24">
      <div className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-gray-900">Booking Summary</h2>
        <div className="flex items-center gap-4">
          <img 
            src={carImage} 
            alt={carName} 
            onError={(e) => {
              if (!e.currentTarget.dataset.fallbackApplied) {
                e.currentTarget.dataset.fallbackApplied = "true";
                e.currentTarget.src = localFallback;
              } else if (!e.currentTarget.src.includes("toyota-yaris.jpg")) {
                e.currentTarget.src = "/images/cars/toyota-yaris.jpg";
              }
            }}
            className="h-14 w-20 rounded object-cover border border-slate-100" 
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{carName}</h3>
            <p className="text-[11px] text-gray-500">{carCategory} · {seats} Seats · {fuel}</p>
            <p className="mt-0.5 text-xs font-medium text-[#C69B59]">★ {rating}</p>
          </div>
        </div>
        <hr className="border-gray-100" />
        <div className="space-y-4 text-xs">
          <SummaryDetail label="PICK-UP & RETURN" value={pickupLocation} icon="⌖" />
          <SummaryDetail label="DATES" value={displayDates} icon="◷" />
        </div>
        <hr className="border-gray-100" />
        <div className="space-y-2 text-xs">
          <PriceRow label={`Rental (฿${dailyPrice.toLocaleString()} x ${rentalDays} days)`} value={`฿${totalRentalPrice.toLocaleString()}`} />
          <PriceRow label="Service Fee" value="฿0" />
          <PriceRow label="Taxes & Fees (7% VAT)" value="Included" />
        </div>
        <div className="flex items-baseline justify-between border-t border-gray-100 pt-4">
          <span className="font-serif text-base font-bold text-gray-900">Total</span>
          <span className="font-serif text-2xl font-bold text-[#b48a3c]">฿{totalRentalPrice.toLocaleString()}</span>
        </div>
        <div className="space-y-2.5 pt-2">
          <Button 
            type="submit" 
            variant="gold" 
            onClick={onConfirm} 
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded py-3 text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing..." : <>Confirm &amp; Pay <span aria-hidden="true">→</span></>}
          </Button>
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="w-full rounded py-2.5 text-xs font-medium cursor-pointer"
          >
            Back to Booking Details
          </Button>
        </div>
        <div className="space-y-2.5 border-t border-gray-100 pt-4 text-[11px] leading-tight text-gray-500">
          <p>🔒 Secure Payment</p>
          <p>🛡 256-bit Encryption</p>
          <p>✓ Free Cancellation up to 48 hours before pick-up</p>
        </div>
      </div>
    </aside>
  );
}

function SummaryDetail({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-base text-gray-600" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-[9px] font-bold tracking-wider text-gray-400">{label}</p>
        <p className="mt-0.5 font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}