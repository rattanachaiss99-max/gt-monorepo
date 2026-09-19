import { useState } from 'react';

// Dynamically load all accommodation images from the assets folder using Vite
const accommodationImages = import.meta.glob(
  '../../../assets/accommodations/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
);

const ASSET_KEYS = [
  'siam-heritage-sanctuary',
  'skyline-executive-suites',
  'ayutthaya-heritage-riverside',
  'river-kwai-jungle-raft',
  'hua-hin-royal-beachfront',
  'four-seasons-samui-cove',
  'railay-cliff-beach-villas',
  'amanpuri-retreat-villas',
  'lanna-riverside-boutique',
  'emerald-jungle-retreat',
  'doi-mist-mountain-lodge',
  'khaoyai-vineyard-villas',
  'mekong-riverside-retreat',
  'isan-ricefield-homestay',
];

const CATEGORY_FALLBACK = {
  'Luxury Resort': 'lanna-riverside-boutique',
  'Private Villa': 'amanpuri-retreat-villas',
  'Luxury Hotel': 'skyline-executive-suites',
  'Bed & Breakfast': 'doi-mist-mountain-lodge',
  'Guest House': 'isan-ricefield-homestay',
  'Budget Hotel': 'ayutthaya-heritage-riverside',
};

function getAssetUrl(name) {
  if (!name) return null;
  return (
    accommodationImages[`../../../assets/accommodations/${name}.jpg`] ||
    accommodationImages[`../../../assets/accommodations/${name}.png`] ||
    accommodationImages[`../../../assets/accommodations/${name}.webp`] ||
    null
  );
}

function getImageForAccommodation(accommodation) {
  if (!accommodation) return null;
  const id = accommodation.id || '';
  
  const directMatch = getAssetUrl(id);
  if (directMatch) return directMatch;

  const matchedKey = ASSET_KEYS.find((k) => id.includes(k) || (accommodation.name && accommodation.name.toLowerCase().includes(k.replace(/-/g, ' '))));
  if (matchedKey) return getAssetUrl(matchedKey);

  const catKey = CATEGORY_FALLBACK[accommodation.category];
  if (catKey && getAssetUrl(catKey)) return getAssetUrl(catKey);

  const numericId = typeof accommodation._id === 'number' ? accommodation._id : (id.length || 0);
  const fallbackKey = ASSET_KEYS[Math.abs(numericId) % ASSET_KEYS.length];
  return getAssetUrl(fallbackKey);
}

function getGalleryForAccommodation(accommodation, mainImage) {
  const pictures = [];
  if (mainImage) pictures.push(mainImage);

  // เสริมรูปในเครือและหมวดเดียวกันเพื่อจำลองแกลเลอรีคุณภาพสูง
  const numericId = typeof accommodation._id === 'number' ? accommodation._id : 1;
  const secondaryKey1 = ASSET_KEYS[(numericId + 1) % ASSET_KEYS.length];
  const secondaryKey2 = ASSET_KEYS[(numericId + 2) % ASSET_KEYS.length];
  const secondaryKey3 = ASSET_KEYS[(numericId + 3) % ASSET_KEYS.length];

  const img1 = getAssetUrl(secondaryKey1);
  const img2 = getAssetUrl(secondaryKey2);
  const img3 = getAssetUrl(secondaryKey3);

  if (img1 && !pictures.includes(img1)) pictures.push(img1);
  if (img2 && !pictures.includes(img2)) pictures.push(img2);
  if (img3 && !pictures.includes(img3)) pictures.push(img3);

  return pictures;
}

/**
 * AccommodationDetail Component (Presentation Component)
 * -------------------------------------------------------------
 * แสดงรายละเอียดที่พักท่องเที่ยว:
 * - แกลเลอรีรูปภาพหลัก + แถบรูปย่อยที่คลิกสลับดูรูปได้
 * - สเปกและสิ่งอำนวยความสะดวก (Facilities / Amenities)
 * - ตัวเลือกห้องพัก (Room Types) และราคา
 * - แผนที่/สถานที่สำคัญใกล้เคียง (Nearby Landmarks)
 * - Widget คำนวณราคาและปุ่มจอง (Sticky Booking Widget)
 */
export default function AccommodationDetail({ accommodation = {}, onBookNow }) {
  const mainImageAsset = getImageForAccommodation(accommodation);
  const gallery = getGalleryForAccommodation(accommodation, mainImageAsset);

  const [activeImage, setActiveImage] = useState(mainImageAsset || gallery[0]);
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedRoomId, setSelectedRoomId] = useState(
    accommodation.rooms?.[0]?.room_type_id || 'default'
  );

  const basePrice = Number(accommodation.base_price_per_night || 0);
  const selectedRoom = accommodation.rooms?.find((r) => r.room_type_id === selectedRoomId);
  const currentPricePerNight = selectedRoom?.price_per_night || basePrice;
  const nights = 3; // คำนวณจากช่วงวันที่ 15 - 18 ต.ค.
  const totalPrice = currentPricePerNight * nights;

  const location = accommodation.location || {};
  const cityLabel = location.city || location.address_label || 'Thailand';
  const districtLabel = location.district ? `${location.district}, ` : '';
  const fullLocation = `${districtLabel}${cityLabel}`;

  const rating = accommodation.rating_avg ?? 5.0;
  const reviews = accommodation.total_reviews ?? 0;

  const facilities = accommodation.facilities || [
    'Free Wi-Fi',
    'Swimming Pool',
    'Room Service',
    'Spa',
    'Air Conditioning',
  ];

  const handleBookClick = () => {
    if (onBookNow) {
      onBookNow({
        accommodation,
        checkInDate,
        checkOutDate,
        guestsCount,
        selectedRoom,
        totalPrice,
      });
    } else {
      alert(`กำลังดำเนินการจอง: ${accommodation.name}\nยอดรวม: ฿${totalPrice.toLocaleString()}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* ฝั่งซ้าย: ข้อมูลที่พัก แกลเลอรี สเปกห้อง และสถานที่สำคัญ */}
      <div className="lg:col-span-2 space-y-7">
        {/* ส่วนแกลเลอรีรูปภาพ */}
        <div className="w-full">
          {/* รูปภาพหลักขนาดใหญ่ */}
          <div className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-sm mb-3 bg-slate-100 border border-slate-200/70 relative">
            <img
              src={activeImage || mainImageAsset}
              alt={accommodation.name || 'Accommodation'}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-[#0a192f]/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-2xs">
                {accommodation.category || 'Luxury Resort'}
              </span>
              {accommodation.special_options?.[0] && (
                <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                  ★ {accommodation.special_options[0]}
                </span>
              )}
            </div>
          </div>

          {/* แถบ Thumbnail รูปย่อยที่สามารถคลิกเลือกสลับดูได้ */}
          <div className="grid grid-cols-4 gap-3 h-20 sm:h-24">
            {gallery.slice(0, 3).map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActiveImage(img)}
                className={`h-full rounded-xl overflow-hidden border-2 bg-slate-100 transition cursor-pointer ${
                  activeImage === img
                    ? 'border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                    : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
            <div className="h-full rounded-xl overflow-hidden relative bg-slate-900 flex items-center justify-center border border-slate-200/70">
              <img
                src={gallery[3] || gallery[0]}
                alt="thumb"
                className="w-full h-full object-cover opacity-50 absolute inset-0"
              />
              <span className="relative z-10 text-white font-bold text-xs tracking-wider">
                +{Math.max(0, gallery.length - 3)} Photos
              </span>
            </div>
          </div>
        </div>

        {/* ข้อมูลชื่อและรายละเอียดที่พัก */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-amber-500 text-sm">★ {rating}</span>
              <span className="text-slate-400">({reviews} Verified Reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">📍 {fullLocation}</span>
            </div>
            {accommodation.region && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                Region: {accommodation.region}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {accommodation.name}
          </h1>

          <p className="text-sm leading-relaxed text-slate-600 font-light">
            {accommodation.description}
          </p>

          {accommodation.descriptionExtra && (
            <p className="text-xs leading-relaxed text-slate-500 font-light bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              {accommodation.descriptionExtra}
            </p>
          )}

          {/* สิ่งอำนวยความสะดวกหลัก (Facilities / Amenities) */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-serif text-base font-bold text-slate-900 mb-3">
              Popular Amenities & Facilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-100 font-medium"
                >
                  <span className="text-amber-500">✓</span>
                  {fac}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ตัวเลือกประเภทห้องพัก (Available Room Types) */}
        {accommodation.rooms && accommodation.rooms.length > 0 && (
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Available Room Types
            </h3>
            <div className="space-y-3">
              {accommodation.rooms.map((room) => {
                const isSelected = selectedRoomId === room.room_type_id;
                return (
                  <div
                    key={room.room_type_id}
                    onClick={() => setSelectedRoomId(room.room_type_id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/30 shadow-2xs'
                        : 'border-slate-200/70 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900">
                        {room.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        🛏️ {room.bed_type} · 👤 สูงสุด {room.max_guests?.adults || 2} ผู้ใหญ่
                        {room.max_guests?.children ? `, ${room.max_guests.children} เด็ก` : ''}
                      </p>
                      {room.available_quantity && (
                        <p className="text-[11px] text-emerald-600 font-medium mt-1">
                          ✓ เหลือ {room.available_quantity} ห้องสุดท้าย
                        </p>
                      )}
                    </div>
                    <div className="text-right sm:self-center">
                      <span className="text-xl font-serif font-bold text-slate-900">
                        ฿{Number(room.price_per_night || 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 block font-normal">/ night</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* สถานที่สำคัญใกล้เคียงและนโยบาย (Nearby Landmarks & Policies) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nearby Landmarks */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="font-serif font-bold text-slate-900 text-sm">
              📍 Nearby Landmarks
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {(location.nearby_landmarks || [
                { name: 'City Center / Night Market', distance: '1.2 km' },
                { name: 'Main Airport / Train Station', distance: '12 km' },
                { name: 'Scenic Viewpoint', distance: '2.5 km' },
              ]).map((lm, idx) => (
                <li key={idx} className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                  <span className="font-medium text-slate-700">{lm.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{lm.distance}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="font-serif font-bold text-slate-900 text-sm">
              ℹ️ Hotel Policies
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Check-in:</span>
                <span className="font-semibold text-slate-800">
                  {accommodation.policies?.check_in_time || '14:00'} เป็นต้นไป
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Check-out:</span>
                <span className="font-semibold text-slate-800">
                  ก่อน {accommodation.policies?.check_out_time || '12:00'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2">
                {accommodation.policies?.cancellation_policy || 'ยกเลิกการจองฟรีสูงสุด 48 ชั่วโมงก่อนเช็คอิน'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ฝั่งขวา: กล่องคำนวณราคาและปุ่มจอง (Sticky Booking Widget) */}
      <div>
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-md space-y-5 sticky top-24">
          <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                ฿{currentPricePerNight.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block uppercase font-medium">/ night</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">
                Total ({nights} Nights)
              </span>
              <span className="text-xl font-serif font-bold text-amber-600">
                ฿{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
                Check-in
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="border border-slate-200 rounded-xl p-2.5 text-xs w-full bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
                Check-out
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="border border-slate-200 rounded-xl p-2.5 text-xs w-full bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
              Guests
            </label>
            <select
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              className="border border-slate-200 rounded-xl p-3 text-xs text-slate-800 bg-slate-50 w-full outline-none focus:border-[#0a192f] focus:bg-white transition"
            >
              <option value={1}>1 Adult</option>
              <option value={2}>2 Adults</option>
              <option value={3}>3 Adults</option>
              <option value={4}>4 Adults</option>
              <option value={5}>Family (5+ Guests)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleBookClick}
            className="w-full bg-[#0a192f] hover:bg-amber-400 hover:text-slate-900 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Reserve Now</span>
            <span aria-hidden="true">→</span>
          </button>

          <div className="text-[11px] text-center text-slate-400 leading-relaxed space-y-1">
            <p>✓ Instant confirmation without booking fees</p>
            <p>✓ Best Price Guaranteed by GoThailand</p>
          </div>
        </div>
      </div>
    </div>
  );
}
