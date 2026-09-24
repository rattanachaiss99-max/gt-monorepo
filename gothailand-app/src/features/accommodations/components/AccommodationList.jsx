import { useState } from 'react';
import AccommodationCard from './AccommodationCard';
import Button from './Button';
import { useAuth } from '../../../context/AuthContext';
import { useItemVisibility } from '../../../context/ItemVisibilityContext';
import ItemVisibilityBadge from '../../../components/common/ItemVisibilityBadge';

/**
 * ตัวสร้างเลขหน้า pagination อัจฉริยะพร้อมจุดไข่ปลา (ellipsis)
 * ตัวอย่าง: [1, 2, 3, 4, 5, '...', 54] หรือ [1, '...', 10, 11, 12, '...', 54]
 */
function getPaginationItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // ใกล้หน้าแรก
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }

  // ใกล้หน้าสุดท้าย
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }

  // อยู่ตรงกลาง
  return [1, '...', current - 1, current, current + 1, '...', total];
}

const REGION_LABELS = {
  central: 'ภาคกลาง',
  north: 'ภาคเหนือ',
  isan: 'ภาคอีสาน',
  south: 'ภาคใต้',
  east: 'ภาคตะวันออก',
  west: 'ภาคตะวันตก',
  all: 'ทุกภาค',
};

/**
 * AccommodationList Component
 * -------------------------------------------------------------
 * รายการที่พักฝั่งขวา พร้อมตัวเลือก Sort และเลือกขนาดหน้า (Page size)
 *  - เลือกว่าจะแสดงหน้าละกี่ที่พัก (default: 10, 20, 30, 50)
 *  - ระบบเลื่อนหน้าอัจฉริยะ (Ellipsis pagination) ไม่ล้นการ์ด
 * -------------------------------------------------------------
 */
export default function AccommodationList({
  accommodations = [],
  loading = false,
  error = null,
  selectedRegion = 'central',
  selectedProvince = '',
  currentPage: controlledPage,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  sortBy = 'recommended',
  onSortChange,
  onRetry,
  onResetFilters,
  onViewDetails,
  onBookNow,
}) {
  const [localPage, setLocalPage] = useState(1);
  const isControlled = controlledPage !== undefined;
  const currentPage = isControlled ? controlledPage : localPage;

  const [prevAccommodations, setPrevAccommodations] = useState(accommodations);
  const [prevSort, setPrevSort] = useState(sortBy);
  const [prevPageSize, setPrevPageSize] = useState(pageSize);

  // สิทธิ์ Admin และสถานะเปิด/ปิดการแสดงผล
  const { isAdmin } = useAuth();
  const { isItemVisible, adminCustomerPreview } = useItemVisibility();

  // รีเซ็ตกลับหน้า 1 ในกรณี uncontrolled เมื่อข้อมูลหรือการตั้งค่าเปลี่ยน
  if (
    !isControlled &&
    (prevAccommodations !== accommodations ||
      prevSort !== sortBy ||
      prevPageSize !== pageSize)
  ) {
    setPrevAccommodations(accommodations);
    setPrevSort(sortBy);
    setPrevPageSize(pageSize);
    setLocalPage(1);
  }

  const totalCount = accommodations.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // ตัดข้อมูลตามหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const displayedAccommodations = accommodations.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const paginationItems = getPaginationItems(currentPage, totalPages);

  // กำหนดข้อความชื่อสถานที่ที่จะแสดง
  const locationLabel = selectedProvince
    ? selectedProvince
    : selectedRegion !== 'all'
    ? REGION_LABELS[selectedRegion] || 'Thailand'
    : 'Thailand';

  return (
    <section className="w-full max-w-full min-w-0 space-y-5">
      {/* แถบควบคุมด้านบน: จำนวนผลลัพธ์, ตัวเลือกขนาดหน้า, & การเรียงลำดับ */}
      <div className="w-full max-w-full min-w-0 bg-white rounded-2xl border border-slate-200/80 px-3 sm:px-5 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-2xs overflow-hidden">
        <div className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 min-w-0">
          {loading ? (
            <span className="text-slate-400">Loading stays...</span>
          ) : (
            <span className="leading-snug">
              Showing{' '}
              {totalCount > pageSize ? (
                <>
                  <span className="font-bold text-slate-900 font-serif text-sm sm:text-base md:text-lg">
                    {startIndex + 1}–{endIndex}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold text-slate-900 font-serif text-sm sm:text-base md:text-lg">
                    {totalCount}
                  </span>{' '}
                  stays in {locationLabel}
                </>
              ) : (
                <>
                  <span className="font-bold text-slate-900 font-serif text-sm sm:text-base md:text-lg">
                    {totalCount}
                  </span>{' '}
                  {totalCount === 1 ? 'stay' : 'stays'} in {locationLabel}
                </>
              )}
            </span>
          )}
        </div>

        {/* ตัวควบคุม: ขนาดหน้า & การเรียงลำดับ */}
        <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 text-xs sm:text-sm pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 min-w-0">
          {/* ตัวเลือกขนาดหน้า */}
          <div className="flex items-center gap-1.5 shrink-0">
            <label
              htmlFor="page-size-select"
              className="text-slate-500 font-medium whitespace-nowrap text-xs sm:text-sm"
            >
              Per page:
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2 sm:px-2.5 py-1.5 font-semibold text-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer transition-colors"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={30}>30 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>

          {/* ตัวเลือกการเรียงลำดับ */}
          <div className="flex items-center gap-1.5 min-w-0 shrink">
            <label
              htmlFor="sort-select"
              className="text-slate-500 font-medium whitespace-nowrap text-xs sm:text-sm shrink-0"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-1.5 font-semibold text-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer transition-colors max-w-[150px] xs:max-w-none truncate"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* สถานะกำลังโหลด (Skeleton) */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 sm:p-5 flex flex-row gap-3 sm:gap-5 animate-pulse min-h-[145px] xs:min-h-[175px] sm:min-h-[200px] lg:min-h-[230px]"
            >
              <div className="w-[32%] xs:w-[35%] sm:w-[38%] lg:w-[320px] xl:w-[350px] min-w-0 bg-slate-200 rounded-xl sm:rounded-2xl shrink-0 self-stretch" />
              <div className="flex-1 space-y-2 sm:space-y-3 py-1 min-w-0 flex flex-col justify-between">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="h-4 sm:h-6 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 sm:h-4 bg-slate-200 rounded-md w-1/3" />
                  <div className="h-6 sm:h-10 bg-slate-100 rounded-md w-full hidden xs:block" />
                </div>
                <div className="pt-2 sm:pt-3 border-t border-slate-100 flex justify-between items-end">
                  <div className="h-5 sm:h-7 w-16 sm:w-24 bg-slate-200 rounded-md" />
                  <div className="flex gap-1.5">
                    <div className="h-6 sm:h-8 w-16 sm:w-20 bg-slate-200 rounded-xl" />
                    <div className="h-6 sm:h-8 w-6 sm:w-8 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* สถานะข้อผิดพลาด */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-900 p-8 rounded-3xl text-center space-y-3">
          <div className="text-3xl">⚠️</div>
          <h3 className="font-bold text-lg">Unable to load accommodations</h3>
          <p className="text-sm text-red-700 max-w-md mx-auto">{error}</p>
          <div className="pt-2">
            <Button variant="primary" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* สถานะไม่มีข้อมูล */}
      {!loading && !error && totalCount === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="text-4xl">🏝️</div>
          <h3 className="text-xl font-bold font-serif text-slate-900">
            No stays match your criteria
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search location, price range, or clearing some of your active filters to discover more stays.
          </p>
          <div className="pt-2">
            <Button variant="outline" onClick={onResetFilters}>
              Reset all filters
            </Button>
          </div>
        </div>
      )}

      {/* รายการการ์ดที่พัก (แบ่งหน้าแล้ว) */}
      {!loading && !error && displayedAccommodations.length > 0 && (
        <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-5 overflow-hidden">
          {displayedAccommodations.map((item) => {
            const accId = item.id || item._id || item.slug;
            const isVisible = isItemVisible('accommodations', item, [item.id, item._id, item.slug]);

            const isHiddenForAdmin = isAdmin && !adminCustomerPreview && !isVisible;

            return (
              <div key={accId} className="relative group w-full max-w-full min-w-0 overflow-hidden">
                <ItemVisibilityBadge
                  serviceType="accommodations"
                  item={item}
                  itemId={accId}
                  fallbackIds={[item.id, item._id, item.slug]}
                  variant="card"
                />
                <div className={`w-full max-w-full min-w-0 overflow-hidden ${isHiddenForAdmin ? 'opacity-65 grayscale-25 ring-2 ring-rose-400/80 rounded-2xl sm:rounded-3xl transition-all' : 'transition-all'}`}>
                  <AccommodationCard
                    accommodation={item}
                    onViewDetails={onViewDetails}
                    onBookNow={onBookNow}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ตัวควบคุม Pagination อัจฉริยะ (เลย์เอาต์แบบ ellipsis ป้องกันล้นจอ) */}
      {!loading && !error && totalPages > 1 && (
        <div className="w-full max-w-full min-w-0 bg-white rounded-2xl border border-slate-200/80 px-3 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-2xs mt-6 overflow-hidden">
          <div className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
            Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-900">{endIndex}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalCount}</span> stays
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center min-w-0 max-w-full">
            {/* ปุ่มหน้าก่อนหน้า */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 xs:px-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
            >
              <span>←</span>
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* เลขหน้า (ตัวเลข + จุดไข่ปลา) */}
            {paginationItems.map((item, index) => {
              if (item === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center text-slate-400 font-bold text-xs sm:text-sm select-none"
                  >
                    …
                  </span>
                );
              }

              const pageNum = Number(item);
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0a192f] text-white shadow-sm ring-2 ring-[#0a192f]/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* ปุ่มหน้าถัดไป */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 xs:px-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
            >
              <span className="hidden sm:inline">Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
