import { useState } from 'react';
import FilterSidebarShell from './FilterSidebarShell';
import CarFilterSidebar from '../../features/cars/components/CarFilterSidebar';
import GuideFilterSidebar from '../../features/guides/components/GuideFilterSidebar';
import AccommodationFilterSidebar from '../../features/accommodations/components/FilterSidebar';

/**
 * TravelFilterSidebar (Unified Travel Filter Component)
 * -------------------------------------------------------------
 * Shared Component ส่วนกลางสำหรับแถบตัวกรอง (Filter Sidebar)
 * ใช้งานร่วมกันได้ทั้งใน:
 * 1. Route /accommodations (ที่พัก)
 * 2. Route /cars (รถเช่า)
 * 3. Route /guides (มัคคุเทศก์ / ไกด์)
 * 4. หน้าแสดงผลลัพธ์การค้นหา / ตารางส่วนกลาง (TravelSearchResultsTable)
 * 
 * คุณสมบัติ:
 * - สวิตช์โหมดอัตโนมัติตาม prop `service` ('accommodations' | 'cars' | 'guides' | 'all')
 * - โหมด 'all' (Unified Mode): ให้ผู้ใช้สลับประเภทบริการและกรองข้อมูลแบบ Multi-Service
 *   พร้อมส่งออกโครงสร้าง searchQuery สำหรับใช้งานคู่กับ TravelSearchResultsTable.jsx
 * - ดีไซน์สอดคล้องตาม Yok Design Pattern (คลีน เรียบหรู ใช้งาน FilterSidebarShell)
 */
export default function TravelFilterSidebar({
  service = 'all',
  onServiceChange,
  // Props ทั่วไป / ข้อมูลจังหวัด
  provinces = [],
  selectedProvince = '',
  onSelectProvince,
  maxPrice,
  onMaxPriceChange,
  // Callback คืนค่า Query รวมสำหรับ TravelSearchResultsTable
  onSearchQueryChange,
  onResetFilters,
  // Props เฉพาะของแต่ละฟีเจอร์ (ส่งต่อ Transparently)
  ...restProps
}) {
  // สำหรับโหมด 'all': จัดการแท็บประเภทบริการ
  const [activeTab, setActiveTab] = useState(service === 'all' ? 'all' : service);
  const currentService = service === 'all' ? activeTab : service;

  // สำหรับโหมด 'all' ที่เป็น Unified General Filters
  const [unifiedPrice, setUnifiedPrice] = useState(maxPrice || 10000);
  const [unifiedProvince, setUnifiedProvince] = useState(selectedProvince || '');
  const [selectedSort, setSelectedSort] = useState('recommended');

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (onServiceChange) {
      onServiceChange(newTab);
    }
    if (onSearchQueryChange) {
      onSearchQueryChange((prev) => ({
        ...prev,
        serviceType: newTab,
      }));
    }
  };

  // หากระบุ service เจาะจง ให้เรนเดอร์คอมโพเนนต์เฉพาะของบริการนั้น
  if (currentService === 'cars') {
    return (
      <CarFilterSidebar
        selectedLocation={selectedProvince || restProps.selectedLocation}
        onSelectLocation={onSelectProvince || restProps.onSelectLocation}
        maxPrice={maxPrice || restProps.maxPrice}
        onMaxPriceChange={onMaxPriceChange || restProps.onMaxPriceChange}
        onResetFilters={onResetFilters || restProps.onResetFilters}
        {...restProps}
      />
    );
  }

  if (currentService === 'guides') {
    return (
      <GuideFilterSidebar
        selectedProvince={selectedProvince || restProps.selectedProvince}
        onSelectProvince={onSelectProvince || restProps.onSelectProvince}
        maxDailyRate={maxPrice || restProps.maxDailyRate}
        onMaxDailyRateChange={onMaxPriceChange || restProps.onMaxDailyRateChange}
        onResetFilters={onResetFilters || restProps.onResetFilters}
        {...restProps}
      />
    );
  }

  if (currentService === 'accommodations') {
    return (
      <AccommodationFilterSidebar
        selectedProvince={selectedProvince || restProps.selectedProvince}
        onSelectProvince={onSelectProvince || restProps.onSelectProvince}
        maxPrice={maxPrice || restProps.maxPrice}
        onMaxPriceChange={onMaxPriceChange || restProps.onMaxPriceChange}
        onResetFilters={onResetFilters || restProps.onResetFilters}
        {...restProps}
      />
    );
  }

  // โหมด 'all' (Unified Multi-Service Filter)
  const hasActiveFilters = Boolean(unifiedProvince || unifiedPrice < 10000);

  const activePills = [];
  if (unifiedProvince) {
    activePills.push({
      id: 'prov',
      label: `📍 ${unifiedProvince}`,
      onRemove: () => {
        setUnifiedProvince('');
        if (onSelectProvince) onSelectProvince('');
        if (onSearchQueryChange) {
          onSearchQueryChange((prev) => ({ ...prev, provinceSlug: '' }));
        }
      },
    });
  }

  if (unifiedPrice < 10000) {
    activePills.push({
      id: 'price',
      label: `≤ ฿${unifiedPrice.toLocaleString()}`,
      onRemove: () => {
        setUnifiedPrice(10000);
        if (onMaxPriceChange) onMaxPriceChange(10000);
      },
    });
  }

  const handleResetAll = () => {
    setUnifiedProvince('');
    setUnifiedPrice(10000);
    if (onResetFilters) onResetFilters();
    if (onSelectProvince) onSelectProvince('');
    if (onMaxPriceChange) onMaxPriceChange(10000);
    if (onSearchQueryChange) {
      onSearchQueryChange({});
    }
  };

  return (
    <FilterSidebarShell
      title="ค้นหา & กรองบริการ"
      subtitleCount={restProps.totalCount || 0}
      subtitleLabel="รายการที่เปิดบริการ"
      hasActiveFilters={hasActiveFilters}
      onResetFilters={handleResetAll}
      activePills={activePills}
    >
      {/* 1. สลับประเภทบริการ (Multi-Service Pill Tabs) */}
      <div className="space-y-2.5 pb-4 border-b border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          ประเภทบริการ
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'all', label: 'ทั้งหมด', icon: '🌐' },
            { id: 'accommodations', label: 'ที่พัก', icon: '🏨' },
            { id: 'cars', label: 'รถเช่า', icon: '🚗' },
            { id: 'guides', label: 'ไกด์นำเที่ยว', icon: '🧭' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
                activeTab === tab.id
                  ? 'bg-[#0a192f] text-amber-400 border-[#0a192f] shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. ตัวกรองจังหวัด / พื้นที่ */}
      <div className="space-y-2.5 pb-4 border-b border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          จุดหมาย / จังหวัด (77 จังหวัด)
        </label>
        <select
          value={unifiedProvince}
          onChange={(e) => {
            const val = e.target.value;
            setUnifiedProvince(val);
            if (onSelectProvince) onSelectProvince(val);
            if (onSearchQueryChange) {
              onSearchQueryChange((prev) => ({ ...prev, provinceSlug: val }));
            }
          }}
          className="w-full border border-slate-200/80 rounded-xl p-2.5 text-xs text-slate-800 bg-slate-50 outline-none focus:border-[#0a192f] focus:bg-white transition cursor-pointer"
        >
          <option value="">ทุกจังหวัดทั่วประเทศ</option>
          {provinces.map((p) => (
            <option key={p.slug || p._id || p.nameTh} value={p.slug || p.nameTh}>
              {p.nameTh} ({p.nameEn || p.region})
            </option>
          ))}
        </select>
      </div>

      {/* 3. เพดานราคาสูงสุด (Max Budget Slider + Presets) */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            งบประมาณสูงสุด (THB)
          </label>
          <span className="font-bold text-slate-900 font-mono text-xs">
            ≤ ฿{unifiedPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="20000"
          step="500"
          value={unifiedPrice}
          onChange={(e) => {
            const val = Number(e.target.value);
            setUnifiedPrice(val);
            if (onMaxPriceChange) onMaxPriceChange(val);
            if (onSearchQueryChange) {
              onSearchQueryChange((prev) => ({ ...prev, maxPrice: val }));
            }
          }}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0a192f]"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>฿500</span>
          <span>฿10,000</span>
          <span>฿20,000+</span>
        </div>

        {/* ปุ่มลัดราคาด่วน (Price Presets) */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {[
            { label: '< ฿2,500', value: 2500 },
            { label: '< ฿5,000', value: 5000 },
            { label: '< ฿10,000', value: 10000 },
          ].map((preset) => {
            const isActive = unifiedPrice === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  setUnifiedPrice(preset.value);
                  if (onMaxPriceChange) onMaxPriceChange(preset.value);
                  if (onSearchQueryChange) {
                    onSearchQueryChange((prev) => ({ ...prev, maxPrice: preset.value }));
                  }
                }}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0a192f] text-amber-400 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. จัดเรียงลำดับผลลัพธ์ */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          เรียงลำดับการแสดงผล
        </label>
        <select
          value={selectedSort}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedSort(val);
            if (onSearchQueryChange) {
              onSearchQueryChange((prev) => ({ ...prev, sortBy: val }));
            }
          }}
          className="w-full border border-slate-200/80 rounded-xl p-2.5 text-xs text-slate-800 bg-slate-50 outline-none focus:border-[#0a192f] cursor-pointer"
        >
          <option value="recommended">แนะนำสำหรับคุณ</option>
          <option value="price-asc">ราคา: น้อย ➜ มาก</option>
          <option value="price-desc">ราคา: มาก ➜ น้อย</option>
          <option value="name">ชื่อ ก-ฮ (Alphabetical)</option>
        </select>
      </div>
    </FilterSidebarShell>
  );
}
