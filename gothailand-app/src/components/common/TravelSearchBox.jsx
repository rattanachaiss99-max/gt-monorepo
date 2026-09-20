import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateLabel, calculateDateSpan, getDefaultDateRange } from '../../utils/date';
import Button from './Button';

/**
 * TravelSearchBox (Universal Travel Search Box)
 * -------------------------------------------------------------
 * Reusable Search Box ส่วนกลางที่รองรับทุก Route ในระบบ:
 * 1. /provinces (หน้าจัดการข้อมูลจังหวัด เชื่อมต่อ Two-Way Binding แผนที่ SVG)
 * 2. /accommodations (หน้าระบบที่พักท่องเที่ยว)
 * 3. /cars (หน้าระบบรถเช่าท่องเที่ยว)
 * 4. /guides (หน้าระบบมัคคุเทศก์ / ไกด์นำเที่ยว)
 *
 * รองรับทั้งโหมด Multi-Service Tabs และโหมด Standalone (hideTabs = true)
 * พร้อมระบบ Controlled Props สำหรับใช้งานในทุก Hero Section ได้อย่างไร้รอยต่อ
 */
export default function TravelSearchBox({
  // โหมดแสดงผลและการเลือกแท็บ
  defaultService = 'all',
  hideTabs = false,
  searchButtonText,
  showBookingLinks = true,
  className = '',

  // Props ปลายทาง / สถานที่ (รองรับทุก Route)
  selectedProvince,
  onProvinceChange,
  onSelectedProvinceChange,
  searchTerm,
  onSearchTermChange,
  searchLocation,
  onSearchLocationChange,
  provinces = [],
  availableProvinces = [],

  // Props สำหรับ ที่พัก (Accommodations)
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guestCount,
  onGuestCountChange,

  // Props สำหรับ รถเช่า (Cars)
  pickupDate,
  onPickupDateChange,
  returnDate,
  onReturnDateChange,
  selectedCategory,
  onSelectedCategoryChange,
  carCategory,
  onCarCategoryChange,

  // Props สำหรับ ไกด์นำเที่ยว (Guides)
  tourDate,
  onTourDateChange,
  guideDate,
  onGuideDateChange,
  selectedLanguage,
  onSelectedLanguageChange,
  guideLanguage,
  onGuideLanguageChange,
  availableLanguages = [],

  // Callback เมื่อกด Submit
  onSearchSubmit,
}) {
  const navigate = useNavigate();

  // แท็บปัจจุบัน: 'all' | 'accommodations' | 'cars' | 'guides'
  const [internalTab, setInternalTab] = useState(defaultService);
  const activeTab = hideTabs ? defaultService : internalTab;
  const setActiveTab = setInternalTab;

  // ข้อมูลช่วงวันที่เริ่มต้น
  const defaultDates = getDefaultDateRange(1, 3);
  const defaultCarDates = getDefaultDateRange(1, 4);

  // --- สถานะภายในแบบ Uncontrolled (ใช้เมื่อไม่ได้ส่ง Controlled Props มา) ---
  const [internalLocation, setInternalLocation] = useState('');
  const [internalCheckIn, setInternalCheckIn] = useState(defaultDates.start);
  const [internalCheckOut, setInternalCheckOut] = useState(defaultDates.end);
  const [internalAdults, setInternalAdults] = useState(2);
  const [stayChildren, setStayChildren] = useState(0);
  const [stayRooms, setStayRooms] = useState(1);

  const [internalPickupDate, setInternalPickupDate] = useState(defaultCarDates.start);
  const [internalReturnDate, setInternalReturnDate] = useState(defaultCarDates.end);
  const [internalCarCategory, setInternalCarCategory] = useState('all');

  const [internalTourDate, setInternalTourDate] = useState(defaultDates.start);
  const [internalGuideLanguage, setInternalGuideLanguage] = useState('all');

  const [allStartDate, setAllStartDate] = useState(defaultDates.start);
  const [allEndDate, setAllEndDate] = useState(defaultDates.end);
  const [selectedServices, setSelectedServices] = useState({
    accommodations: true,
    cars: true,
    guides: true,
  });

  // สถานะ Popovers
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState('');

  // Refs สำหรับ Click Outside
  const datePickerRef = useRef(null);
  const guestPickerRef = useRef(null);

  // ปิด Popovers เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setDatePickerOpen(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target)) {
        setGuestPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- 1. จัดการค่า Location / Destination ---
  const effectiveLocation =
    searchTerm ??
    searchLocation ??
    selectedProvince ??
    internalLocation;

  const handleLocationChange = (val) => {
    setInternalLocation(val);
    onSearchTermChange?.(val);
    onSearchLocationChange?.(val);
    onProvinceChange?.(val);
    onSelectedProvinceChange?.(val);
  };

  // รายการจังหวัดที่พร้อมให้เลือก
  const effectiveProvinces =
    availableProvinces && availableProvinces.length > 0
      ? availableProvinces
      : provinces;

  // หาข้อมูลจังหวัดปัจจุบันที่ตรงกัน
  const currentProvinceObj = provinces.find(
    (p) =>
      p.slug === effectiveLocation ||
      p.nameTh === effectiveLocation ||
      p.nameEn === effectiveLocation
  );
  const provinceNameTh = currentProvinceObj?.nameTh || effectiveLocation || 'ทั่วประเทศ';
  const provinceNameEn = currentProvinceObj?.nameEn || '';
  const currentSlug = currentProvinceObj?.slug || effectiveLocation || '';

  // --- 2. จัดการค่าสำหรับ ที่พัก (Stays) ---
  const effectiveCheckIn = checkIn ?? internalCheckIn;
  const effectiveCheckOut = checkOut ?? internalCheckOut;
  const effectiveAdults = guestCount ?? internalAdults;
  const stayNights = calculateDateSpan(effectiveCheckIn, effectiveCheckOut);

  const handleCheckInChange = (val) => {
    setInternalCheckIn(val);
    onCheckInChange?.(val);
  };

  const handleCheckOutChange = (val) => {
    setInternalCheckOut(val);
    onCheckOutChange?.(val);
  };

  const handleAdultsChange = (val) => {
    const newAdults = Math.max(1, val);
    setInternalAdults(newAdults);
    onGuestCountChange?.(newAdults);
  };

  // --- 3. จัดการค่าสำหรับ รถเช่า (Cars) ---
  const effectivePickupDate = pickupDate ?? internalPickupDate;
  const effectiveReturnDate = returnDate ?? internalReturnDate;
  const effectiveCarCategory = selectedCategory ?? carCategory ?? internalCarCategory;
  const carDays = calculateDateSpan(effectivePickupDate, effectiveReturnDate);

  const handlePickupDateChange = (val) => {
    setInternalPickupDate(val);
    onPickupDateChange?.(val);
  };

  const handleReturnDateChange = (val) => {
    setInternalReturnDate(val);
    onReturnDateChange?.(val);
  };

  const handleCarCategoryChange = (val) => {
    setInternalCarCategory(val);
    onSelectedCategoryChange?.(val);
    onCarCategoryChange?.(val);
  };

  const carCategories = [
    { id: 'all', label: 'All Types (ทุกประเภท)' },
    { id: 'SUV', label: 'SUV' },
    { id: 'Sedan', label: 'Sedan' },
    { id: 'Economy', label: 'Economy' },
    { id: 'Luxury', label: 'Luxury' },
    { id: 'MPV', label: 'MPV / Van' },
  ];

  // --- 4. จัดการค่าสำหรับ ไกด์ (Guides) ---
  const effectiveTourDate = tourDate ?? guideDate ?? internalTourDate;
  const effectiveGuideLanguage = selectedLanguage ?? guideLanguage ?? internalGuideLanguage;

  const handleTourDateChange = (val) => {
    setInternalTourDate(val);
    onTourDateChange?.(val);
    onGuideDateChange?.(val);
  };

  const handleGuideLanguageChange = (val) => {
    setInternalGuideLanguage(val);
    onSelectedLanguageChange?.(val);
    onGuideLanguageChange?.(val);
  };

  const defaultGuideLanguages = [
    { id: 'all', label: 'All Languages (ทุกภาษา)' },
    { id: 'Thai', label: '🇹🇭 Thai (ไทย)' },
    { id: 'English', label: '🇬🇧 English (อังกฤษ)' },
    { id: 'Chinese', label: '🇨🇳 Chinese (จีน)' },
    { id: 'Japanese', label: '🇯🇵 Japanese (ญี่ปุ่น)' },
    { id: 'French', label: '🇫🇷 French (ฝรั่งเศส)' },
    { id: 'German', label: '🇩🇪 German (เยอรมัน)' },
    { id: 'Russian', label: '🇷🇺 Russian (รัสเซีย)' },
  ];

  const guideLanguages =
    availableLanguages && availableLanguages.length > 0
      ? [
          { id: 'all', label: 'All Languages (ทุกภาษา)' },
          ...availableLanguages.map((l) => ({
            id: typeof l === 'object' ? l.id : l,
            label: typeof l === 'object' ? l.label : l,
          })),
        ]
      : defaultGuideLanguages;

  const allDays = calculateDateSpan(allStartDate, allEndDate);

  // ข้อความบนปุ่มค้นหาเริ่มต้น
  const defaultButtonLabel =
    searchButtonText ||
    (activeTab === 'accommodations'
      ? 'Search Stays'
      : activeTab === 'cars'
      ? 'Search Cars'
      : activeTab === 'guides'
      ? 'Search Guides'
      : 'ค้นหาบริการ');

  // จัดการเมื่อกดปุ่มค้นหา
  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDatePickerOpen(false);
    setGuestPickerOpen(false);

    const payload = {
      serviceType: activeTab,
      location: effectiveLocation,
      searchTerm: effectiveLocation,
      searchLocation: effectiveLocation,
      selectedProvince: effectiveLocation,
      provinceSlug: currentSlug,
      provinceNameTh,
      provinceNameEn,
      startDate:
        activeTab === 'accommodations'
          ? effectiveCheckIn
          : activeTab === 'cars'
          ? effectivePickupDate
          : activeTab === 'guides'
          ? effectiveTourDate
          : allStartDate,
      endDate:
        activeTab === 'accommodations'
          ? effectiveCheckOut
          : activeTab === 'cars'
          ? effectiveReturnDate
          : allEndDate,
      checkIn: effectiveCheckIn,
      checkOut: effectiveCheckOut,
      pickupDate: effectivePickupDate,
      returnDate: effectiveReturnDate,
      tourDate: effectiveTourDate,
      guests: effectiveAdults + stayChildren,
      rooms: stayRooms,
      carCategory: effectiveCarCategory,
      selectedCategory: effectiveCarCategory,
      guideLanguage: effectiveGuideLanguage,
      selectedLanguage: effectiveGuideLanguage,
      selectedServices,
    };

    if (onSearchSubmit) {
      onSearchSubmit(payload);
    }

    setSearchFeedback(`กำลังค้นหาใน ${provinceNameTh}...`);
    setTimeout(() => setSearchFeedback(''), 3000);
  };

  // ลิงก์ตรงข้ามบริการไปยังหน้าบริการหลัก
  const handleNavigateToService = (service) => {
    if (service === 'accommodations') {
      const q = new URLSearchParams({
        destination: currentSlug || provinceNameTh,
        checkIn: effectiveCheckIn,
        checkOut: effectiveCheckOut,
        guests: effectiveAdults + stayChildren,
      }).toString();
      navigate(`/accommodations?${q}`);
    } else if (service === 'cars') {
      const q = new URLSearchParams({
        location: currentSlug || provinceNameTh,
        pickupDate: effectivePickupDate,
        returnDate: effectiveReturnDate,
        category: effectiveCarCategory,
      }).toString();
      navigate(`/cars?${q}`);
    } else if (service === 'guides') {
      const q = new URLSearchParams({
        province: provinceNameEn || provinceNameTh,
        date: effectiveTourDate,
        language: effectiveGuideLanguage,
      }).toString();
      navigate(`/guides?${q}`);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-visible relative z-20 ${className}`}>
      {/* 1. แถบเลือกโหมดบริการ (Multi-Service Tabs) — ซ่อนได้ผ่าน hideTabs */}
      {!hideTabs && (
        <div className="flex flex-wrap items-center gap-1.5 p-3 sm:p-4 bg-[#0a192f] rounded-t-2xl border-b border-slate-700/60">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mr-2 hidden md:inline-block">
            ค้นหาบริการท่องเที่ยว:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span>🌟</span>
            <span>ค้นหาทั้งหมด</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accommodations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'accommodations'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span>🏨</span>
            <span>ที่พัก</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cars')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'cars'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span>🚗</span>
            <span>รถเช่า</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'guides'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <span>🧭</span>
            <span>ไกด์นำเที่ยว</span>
          </button>
        </div>
      )}

      {/* 2. กล่องฟอร์มการค้นหาหลัก (Form Inputs) */}
      <form onSubmit={handleSearchSubmit} className="p-3 sm:p-4">
        <div className="flex flex-col md:flex-row items-stretch gap-2.5">
          {/* ฟิลด์ร่วม 1: ปลายทาง / จุดรับรถ / จังหวัด */}
          <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl px-3.5 py-2.5 border border-slate-200 flex items-center gap-3">
            <span className="text-xl shrink-0">📍</span>
            <div className="flex-1 min-w-0">
              <label htmlFor="travel-destination" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {activeTab === 'cars'
                  ? 'Pick-up & Return Location'
                  : activeTab === 'guides'
                  ? 'Province / Destination'
                  : 'Where to? / Destination'}
              </label>

              {/* กรณีเป็น Guide: แสดง Select Dropdown (พร้อมข้อมูลจาก availableProvinces หรือ provinces) */}
              {activeTab === 'guides' ? (
                <select
                  id="travel-destination"
                  value={effectiveLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full text-sm font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer truncate"
                >
                  <option value="">All Provinces (ทั่วประเทศ)</option>
                  {(availableProvinces && availableProvinces.length > 0
                    ? availableProvinces
                    : provinces
                  ).map((prov) => {
                    const val = typeof prov === 'string' ? prov : prov.nameTh || prov.slug;
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
              ) : (
                /* กรณีทั่วไป หรือโหมด Cars / Accommodations: Text Input พร้อม Clear Button ✕ และ Autocomplete */
                <div className="flex items-center gap-1">
                  <input
                    id="travel-destination"
                    type="text"
                    list="travel-provinces-datalist"
                    placeholder={
                      activeTab === 'cars'
                        ? 'Bangkok, Chiang Mai, Phuket...'
                        : activeTab === 'guides'
                        ? 'All Provinces (ทั่วประเทศ)'
                        : 'Where to? (เช่น เชียงใหม่, ภูเก็ต, BKK)'
                    }
                    value={effectiveLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full text-sm font-bold text-slate-800 placeholder-slate-400 bg-transparent border-none outline-none p-0 focus:ring-0"
                  />
                  {effectiveLocation && (
                    <button
                      type="button"
                      onClick={() => handleLocationChange('')}
                      className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                  {effectiveProvinces.length > 0 && (
                    <datalist id="travel-provinces-datalist">
                      {effectiveProvinces.map((p) => {
                        const val = typeof p === 'string' ? p : p.nameTh || p.slug;
                        const label = typeof p === 'string' ? p : p.nameEn ? `${p.nameEn} (${p.region || ''})` : '';
                        return <option key={val} value={val}>{label}</option>;
                      })}
                    </datalist>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ฟิลด์ตามบริการ: วันที่ (Dates) */}
          {activeTab === 'guides' ? (
            // ไกด์: Tour Date (เลือกวันเดียว)
            <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl px-3.5 py-2.5 border border-slate-200 flex items-center gap-3">
              <span className="text-xl shrink-0">📅</span>
              <div className="flex-1">
                <label htmlFor="guide-tour-date" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Tour Date (วันเดินทาง)
                </label>
                <input
                  id="guide-tour-date"
                  type="date"
                  value={effectiveTourDate}
                  onChange={(e) => handleTourDateChange(e.target.value)}
                  className="w-full text-sm font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
                />
              </div>
            </div>
          ) : (
            // ที่พัก, รถเช่า, ค้นหาทั้งหมด: ช่วงวันที่พร้อม Popover และคำนวณวัน/คืน
            <div className="relative flex-1" ref={datePickerRef}>
              <button
                type="button"
                onClick={() => {
                  setDatePickerOpen((prev) => !prev);
                  setGuestPickerOpen(false);
                }}
                className="w-full h-full bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl px-3.5 py-2.5 border border-slate-200 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0">📅</span>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      {activeTab === 'cars' ? 'Rental Dates' : activeTab === 'accommodations' ? 'Stay Dates' : 'Travel Dates'}
                    </span>
                    <div className="text-sm font-bold text-slate-800 whitespace-nowrap">
                      <span>
                        {formatDateLabel(
                          activeTab === 'cars'
                            ? effectivePickupDate
                            : activeTab === 'accommodations'
                            ? effectiveCheckIn
                            : allStartDate
                        ) || (activeTab === 'cars' ? 'Pick-up' : 'Check-in')}
                      </span>
                      <span className="mx-1 text-slate-400">-</span>
                      <span>
                        {formatDateLabel(
                          activeTab === 'cars'
                            ? effectiveReturnDate
                            : activeTab === 'accommodations'
                            ? effectiveCheckOut
                            : allEndDate
                        ) || (activeTab === 'cars' ? 'Return' : 'Check-out')}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-900 border border-amber-300/60 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {activeTab === 'cars'
                    ? `${carDays} ${carDays === 1 ? 'day' : 'days'}`
                    : activeTab === 'accommodations'
                    ? `${stayNights} ${stayNights === 1 ? 'night' : 'nights'}`
                    : `${allDays} วัน`}
                </span>
              </button>

              {/* Popover เลือกช่วงวัน */}
              {datePickerOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 min-w-[280px]">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        {activeTab === 'cars' ? 'Pick-up Date (วันรับรถ)' : 'Check-in Date (วันเช็คอิน)'}
                      </label>
                      <input
                        type="date"
                        value={
                          activeTab === 'cars'
                            ? effectivePickupDate
                            : activeTab === 'accommodations'
                            ? effectiveCheckIn
                            : allStartDate
                        }
                        onChange={(e) => {
                          if (activeTab === 'cars') handlePickupDateChange(e.target.value);
                          else if (activeTab === 'accommodations') handleCheckInChange(e.target.value);
                          else setAllStartDate(e.target.value);
                        }}
                        className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        {activeTab === 'cars' ? 'Return Date (วันคืนรถ)' : 'Check-out Date (วันเช็คเอาท์)'}
                      </label>
                      <input
                        type="date"
                        value={
                          activeTab === 'cars'
                            ? effectiveReturnDate
                            : activeTab === 'accommodations'
                            ? effectiveCheckOut
                            : allEndDate
                        }
                        onChange={(e) => {
                          if (activeTab === 'cars') handleReturnDateChange(e.target.value);
                          else if (activeTab === 'accommodations') handleCheckOutChange(e.target.value);
                          else setAllEndDate(e.target.value);
                        }}
                        className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="pt-2 flex justify-end border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setDatePickerOpen(false)}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                      >
                        Done (เสร็จสิ้น)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ฟิลด์ตามบริการ: Option เสริม */}
          {activeTab === 'accommodations' && (
            // ผู้เข้าพักและห้องพัก
            <div className="relative flex-1" ref={guestPickerRef}>
              <button
                type="button"
                onClick={() => {
                  setGuestPickerOpen((prev) => !prev);
                  setDatePickerOpen(false);
                }}
                className="w-full h-full bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl px-3.5 py-2.5 border border-slate-200 flex items-center justify-between gap-3 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0">👥</span>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Guests & Rooms
                    </span>
                    <div className="text-sm font-bold text-slate-800 whitespace-nowrap">
                      {stayRooms} room{stayRooms > 1 ? 's' : ''}, {effectiveAdults} adult{effectiveAdults > 1 ? 's' : ''}
                      {stayChildren > 0 ? `, ${stayChildren} child` : ''}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">▼</span>
              </button>

              {/* Popover ผู้เข้าพัก */}
              {guestPickerOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 min-w-[240px] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Adults (ผู้ใหญ่)</div>
                      <div className="text-[10px] text-slate-400">13 ปีขึ้นไป</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdultsChange(effectiveAdults - 1)}
                        className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{effectiveAdults}</span>
                      <button
                        type="button"
                        onClick={() => handleAdultsChange(effectiveAdults + 1)}
                        className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Children (เด็ก)</div>
                      <div className="text-[10px] text-slate-400">0-12 ปี</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStayChildren((c) => Math.max(0, c - 1))}
                        className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{stayChildren}</span>
                      <button
                        type="button"
                        onClick={() => setStayChildren((c) => c + 1)}
                        className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Rooms (ห้องพัก)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStayRooms((r) => Math.max(1, r - 1))}
                        className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{stayRooms}</span>
                      <button
                        type="button"
                        onClick={() => setStayRooms((r) => r + 1)}
                        className="w-7 h-7 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cars' && (
            // ประเภทรถยนต์ (Vehicle Category)
            <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl px-3.5 py-2.5 border border-slate-200 flex items-center gap-3">
              <span className="text-xl shrink-0">🚘</span>
              <div className="flex-1">
                <label htmlFor="travel-car-category" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Vehicle Category
                </label>
                <select
                  id="travel-car-category"
                  value={effectiveCarCategory}
                  onChange={(e) => handleCarCategoryChange(e.target.value)}
                  className="w-full text-sm font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
                >
                  {carCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'guides' && (
            // ภาษาของไกด์ (Language Spoken)
            <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl px-3.5 py-2.5 border border-slate-200 flex items-center gap-3">
              <span className="text-xl shrink-0">🗣️</span>
              <div className="flex-1">
                <label htmlFor="travel-guide-lang" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Language Spoken
                </label>
                <select
                  id="travel-guide-lang"
                  value={effectiveGuideLanguage}
                  onChange={(e) => handleGuideLanguageChange(e.target.value)}
                  className="w-full text-sm font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
                >
                  {guideLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'all' && (
            // โหมด All-in-One: Checkboxes เลือกบริการ
            <div className="flex-1 bg-slate-50 rounded-xl px-3.5 py-2 border border-slate-200 flex flex-col justify-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                บริการที่สนใจค้นหา
              </span>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServices.accommodations}
                    onChange={(e) =>
                      setSelectedServices((prev) => ({ ...prev, accommodations: e.target.checked }))
                    }
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>ที่พัก</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServices.cars}
                    onChange={(e) =>
                      setSelectedServices((prev) => ({ ...prev, cars: e.target.checked }))
                    }
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>รถเช่า</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServices.guides}
                    onChange={(e) =>
                      setSelectedServices((prev) => ({ ...prev, guides: e.target.checked }))
                    }
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>ไกด์</span>
                </label>
              </div>
            </div>
          )}

          {/* ปุ่ม Search หลัก */}
          <Button
            type="submit"
            variant="navy"
            size="md"
            className="px-6 py-3 font-bold rounded-xl whitespace-nowrap gap-2 shrink-0 cursor-pointer"
          >
            <span>🔍</span>
            <span>{defaultButtonLabel}</span>
          </Button>
        </div>
      </form>

      {/* ข้อความแจ้งเตือนสถานะการค้นหา */}
      {searchFeedback && (
        <div className="mx-5 mb-3 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800 flex items-center gap-2 animate-fade-in">
          <span>✨</span>
          <span>{searchFeedback}</span>
        </div>
      )}

      {/* 3. ทางลัดระบบจองเต็มรูปแบบ (Future Booking Links) */}
      {showBookingLinks && !hideTabs && (
        <div className="px-3.5 sm:px-5 py-3 bg-slate-50/80 rounded-b-2xl border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-bold text-slate-700">ทางลัดระบบจอง:</span>
            <span>ส่งค่าค้นหาใน {provinceNameTh} ตรงสู่ระบบจองหลัก</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavigateToService('accommodations')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <span>🏨 จองที่พัก</span>
              <span className="text-slate-400 font-normal">↗</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigateToService('cars')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <span>🚗 จองรถเช่า</span>
              <span className="text-slate-400 font-normal">↗</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigateToService('guides')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <span>🧭 จองไกด์นำเที่ยว</span>
              <span className="text-slate-400 font-normal">↗</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
