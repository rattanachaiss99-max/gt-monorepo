import { useState } from 'react';
import { getDefaultDateRange } from '../../../utils/date';
import Button from './Button';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80";

/**
 * GuideDetail Component (Presentation Component)
 * -------------------------------------------------------------
 * แสดงรายละเอียดโปรไฟล์และข้อมูลใบอนุญาตของมัคคุเทศก์:
 * - รูปโปรไฟล์ขนาดใหญ่, ป้าย Verified Guide, เลขที่ใบอนุญาต
 * - ประวัติคำแนะนำตัว (Bio) และความเชี่ยวชาญ
 * - จุดนำเที่ยวและพื้นที่ให้บริการหลัก (Service Areas)
 * - บริการและโปรแกรมทัวร์พิเศษ (Specialized Services)
 * - Sticky Booking Widget คำนวณราคาตามระยะเวลาและช่องทางติดต่อตรง
 */
export default function GuideDetail({ guide = {}, onBookGuide }) {
  const photoUrl = guide.guide_photo || guide.image || DEFAULT_AVATAR;
  const rating = guide.rating_avg ?? guide.rating ?? 5.0;
  const reviewCount = guide.total_reviews ?? guide.reviews ?? 0;
  const dailyFee = guide.daily_fee || guide.pricePerDay || 1600;
  const overtimeRate = guide.overtime_rate_perhour || Math.round(dailyFee / 8 * 1.25);
  const maxGuest = guide.max_guest || 10;
  const languages = Array.isArray(guide.language)
    ? guide.language
    : Array.isArray(guide.languages)
    ? guide.languages
    : ["Thai", "English"];
  const serviceAreas = Array.isArray(guide.service_areas) && guide.service_areas.length > 0
    ? guide.service_areas
    : [`Downtown ${guide.province || 'Thailand'}`, "Historical Sites", "Local Markets"];
  const specializedServices = Array.isArray(guide.specialized_services) && guide.specialized_services.length > 0
    ? guide.specialized_services
    : [
        {
          service_id: "svc-default-1",
          title: "Customized Local Day Tour",
          description: "โปรแกรมนำเที่ยวแบบยืดหยุ่นตามความต้องการของลูกทัวร์ พร้อมแนะนำจุดถ่ายรูปและร้านอาหารท้องถิ่น",
          image_url: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80"
        }
      ];

  // State ของ Widget การจอง
  const [selectedDate, setSelectedDate] = useState(getDefaultDateRange(1, 1).start);
  const [guestCount, setGuestCount] = useState(2);
  const [duration, setDuration] = useState('full'); // 'full' (8 ชม.) หรือ 'half' (4 ชม.)

  const durationMultiplier = duration === 'half' ? 0.65 : 1;
  const calculatedFee = Math.round(dailyFee * durationMultiplier);

  const handleBookClick = () => {
    if (onBookGuide) {
      onBookGuide({
        guide,
        date: selectedDate,
        guestCount,
        duration: duration === 'full' ? 'Full Day (8 Hours)' : 'Half Day (4 Hours)',
        totalPrice: calculatedFee,
      });
    } else {
      alert(
        `ติดต่อจองมัคคุเทศก์: ${guide.name} (${guide.nickname || 'Guide'})\n` +
        `วันที่: ${selectedDate}\n` +
        `จำนวนลูกทัวร์: ${guestCount} ท่าน\n` +
        `แพ็กเกจ: ${duration === 'full' ? 'เต็มวัน (8 ชั่วโมง)' : 'ครึ่งวัน (4 ชั่วโมง)'}\n` +
        `ยอดรวม: ฿${calculatedFee.toLocaleString()}`
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* ฝั่งซ้าย: ข้อมูลโปรไฟล์มัคคุเทศก์ ใบอนุญาต และโปรแกรมพิเศษ */}
      <div className="lg:col-span-2 space-y-7">
        {/* กล่องหัวเรื่องโปรไฟล์ */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-6 items-start">
          {/* รูปถ่ายไกด์ */}
          <div className="relative w-full sm:w-48 h-64 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm">
            <img
              src={photoUrl}
              alt={guide.name || "Guide Profile"}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                if (e.currentTarget.src !== DEFAULT_AVATAR) {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }
              }}
            />
            {guide.status && (
              <span className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                guide.status === 'Available'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-700 text-white'
              }`}>
                ● {guide.status}
              </span>
            )}
          </div>

          {/* รายละเอียดสรุป */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {guide.verified && (
                <span className="inline-flex items-center gap-1 bg-[#0a192f] text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                  <span>✓</span>
                  <span>Verified Professional Guide</span>
                </span>
              )}
              {guide.province && (
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                  📍 {guide.province}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                {guide.name}
              </h1>
              {guide.nickname && (
                <span className="text-sm font-bold text-amber-600">
                  "{guide.nickname}"
                </span>
              )}
            </div>

            {/* เลขที่ใบอนุญาต */}
            {guide.license_number && (
              <p className="text-xs text-slate-500 font-mono">
                License No: <span className="font-bold text-slate-800">{guide.license_number}</span> ({guide.license_category || 'General'})
              </p>
            )}

            {/* สถิติ 4 ช่อง */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Rating</span>
                <span className="text-xs font-bold text-amber-500 mt-0.5 block">
                  ★ {Number(rating).toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">({reviewCount})</span>
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Experience</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {guide.years_experience || 3} Years
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Travelers</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {guide.total_travelers ? `${guide.total_travelers}+` : '300+'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ประวัติและคำแนะนำตัว (About Guide) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            About the Guide & Expertise
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 font-light">
            {guide.description || "มัคคุเทศก์มืออาชีพพร้อมพาคุณสัมผัสประสบการณ์ท่องเที่ยวไทยแบบเจาะลึก"}
          </p>

          {/* ภาษาที่สื่อสารได้ */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Languages Spoken:
            </span>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-medium"
                >
                  <span>🗣️</span>
                  <span>{lang}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* จุดนำเที่ยวและพื้นที่ให้บริการหลัก (Service Areas) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Service Areas & Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {serviceAreas.map((area, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
              >
                <span className="text-amber-500">📍</span>
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* โปรแกรมทัวร์พิเศษเฉพาะทาง (Specialized Services) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Specialized Programs & Services
            </h2>
            <span className="text-xs text-amber-600 font-semibold">
              {specializedServices.length} Programs
            </span>
          </div>

          <div className="space-y-4">
            {specializedServices.map((svc, idx) => (
              <div
                key={svc.service_id || idx}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-200/70 hover:border-amber-400/60 bg-white transition-all shadow-2xs"
              >
                {svc.image_url && (
                  <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={svc.image_url}
                      alt={svc.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-serif font-bold text-slate-900 text-base">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ข้อมูลใบอนุญาตอย่างเป็นทางการ (Official Credentials) */}
        <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200/80 space-y-3">
          <h3 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
            <span>🛡️</span>
            <span>Official Tourism Department Verification</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block">License Type:</span>
              <span className="font-semibold text-slate-800">{guide.license_category || 'General'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Scope of Authorization:</span>
              <span className="font-semibold text-slate-800">{guide.scope_type || 'Inbound & Domestic'}</span>
            </div>
            {guide.scope_description && (
              <div className="sm:col-span-2 text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200/60">
                {guide.scope_description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ฝั่งขวา: กล่องคำนวณราคา จองบริการ และช่องทางติดต่อ (Sticky Booking Widget) */}
      <div>
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-md space-y-5 sticky top-24">
          {/* Header ราคา */}
          <div className="flex justify-between items-baseline border-b border-slate-100 pb-4">
            <div>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                ฿{dailyFee.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Standard Daily Rate (8h)</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Overtime</span>
              <span className="text-xs font-semibold text-slate-700">
                +฿{overtimeRate}/hr
              </span>
            </div>
          </div>

          {/* เลือกวันที่ */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
              Tour Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-slate-200 rounded-xl p-2.5 text-xs w-full bg-slate-50 focus:bg-white outline-none focus:border-[#0a192f] transition"
            />
          </div>

          {/* เลือกระยะเวลา (เต็มวัน / ครึ่งวัน) */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">
              Service Duration
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDuration('full')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  duration === 'full'
                    ? 'bg-[#0a192f] text-amber-400 border-[#0a192f] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Full Day (8h)
              </button>
              <button
                type="button"
                onClick={() => setDuration('half')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  duration === 'half'
                    ? 'bg-[#0a192f] text-amber-400 border-[#0a192f] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Half Day (4h)
              </button>
            </div>
          </div>

          {/* จำนวนลูกทัวร์ */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Group Size
              </label>
              <span className="text-[10px] text-slate-400">
                Max {maxGuest} guests
              </span>
            </div>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 bg-slate-50 w-full outline-none focus:border-[#0a192f] focus:bg-white transition"
            >
              {Array.from({ length: maxGuest }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* ยอดรวมคำนวณ */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Estimated Total:</span>
            <span className="font-serif text-xl font-bold text-amber-600">
              ฿{calculatedFee.toLocaleString()}
            </span>
          </div>

          {/* ปุ่มจองบริการ */}
          <Button
            type="button"
            onClick={handleBookClick}
            variant="navy"
            size="none"
            className="w-full py-3.5 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg gap-2"
          >
            <span>Book Tour Guide</span>
            <span aria-hidden="true">→</span>
          </Button>

          {/* ช่องทางติดต่อตรงกับไกด์ */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Direct Guide Contacts:
            </span>
            <div className="space-y-1.5 text-xs text-slate-700">
              {guide.phone && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">📞 Phone:</span>
                  <a href={`tel:${guide.phone}`} className="font-bold text-slate-800 hover:text-amber-600">
                    {guide.phone}
                  </a>
                </div>
              )}
              {guide.line_id && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 text-emerald-900">
                  <span className="text-emerald-700">💬 LINE ID:</span>
                  <span className="font-bold font-mono">{guide.line_id}</span>
                </div>
              )}
              {guide.email && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-500">✉️ Email:</span>
                  <span className="font-mono text-[11px] truncate max-w-[150px]">{guide.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-center text-slate-400 leading-relaxed pt-1">
            ✓ 100% Certified Department of Tourism Guide<br />
            ✓ Free cancellation up to 48 hours prior
          </div>
        </div>
      </div>
    </div>
  );
}
