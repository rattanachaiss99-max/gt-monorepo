import { useState } from 'react';
import AccommodationCard from './AccommodationCard';
import Button from './Button';

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
  pageSize = 10,
  onPageSizeChange,
  sortBy = 'recommended',
  onSortChange,
  onRetry,
  onResetFilters,
  onViewDetails,
  onBookNow,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevAccommodations, setPrevAccommodations] = useState(accommodations);
  const [prevSort, setPrevSort] = useState(sortBy);
  const [prevPageSize, setPrevPageSize] = useState(pageSize);

  // รีเซ็ตกลับหน้า 1 ทุกครั้งที่ list ที่กรองแล้ว, การเรียงลำดับ หรือขนาดหน้าเปลี่ยน
  // เทียบด้วย reference (ไม่ใช่ length) เพราะ parent จะสร้าง array ใหม่เสมอ
  // เมื่อฟิลเตอร์เปลี่ยน แม้ว่าจำนวนผลลัพธ์จะเท่าเดิมก็ตาม
  if (
    prevAccommodations !== accommodations ||
    prevSort !== sortBy ||
    prevPageSize !== pageSize
  ) {
    setPrevAccommodations(accommodations);
    setPrevSort(sortBy);
    setPrevPageSize(pageSize);
    setCurrentPage(1);
  }

  const totalCount = accommodations.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // ตัดข้อมูลตามหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const displayedAccommodations = accommodations.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
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
    <section className="flex-1 min-w-0 space-y-5">
      {/* แถบควบคุมด้านบน: จำนวนผลลัพธ์, ตัวเลือกขนาดหน้า, & การเรียงลำดับ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="text-sm sm:text-base font-semibold text-slate-800">
          {loading ? (
            <span className="text-slate-400">Loading stays...</span>
          ) : (
            <span>
              Showing{' '}
              {totalCount > pageSize ? (
                <>
                  <span className="font-bold text-slate-900 font-serif text-base sm:text-lg">
                    {startIndex + 1}–{endIndex}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold text-slate-900 font-serif text-base sm:text-lg">
                    {totalCount}
                  </span>{' '}
                  stays in {locationLabel}
                </>
              ) : (
                <>
                  <span className="font-bold text-slate-900 font-serif text-base sm:text-lg">
                    {totalCount}
                  </span>{' '}
                  {totalCount === 1 ? 'stay' : 'stays'} in {locationLabel}
                </>
              )}
            </span>
          )}
        </div>

        {/* ตัวควบคุม: ขนาดหน้า & การเรียงลำดับ */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm self-end md:self-auto">
          {/* ตัวเลือกขนาดหน้า */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="page-size-select"
              className="text-slate-500 font-medium whitespace-nowrap"
            >
              Show:
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer transition-colors"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={30}>30 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>

          {/* ตัวเลือกการเรียงลำดับ */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="sort-select"
              className="text-slate-500 font-medium whitespace-nowrap"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer transition-colors"
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
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 flex flex-col md:flex-row gap-6 animate-pulse"
            >
              <div className="w-full md:w-[360px] h-64 md:h-[300px] bg-slate-200 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-4 py-2">
                <div className="h-7 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                <div className="h-16 bg-slate-100 rounded-md w-full" />
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-slate-200 rounded-full" />
                  <div className="h-6 w-28 bg-slate-200 rounded-full" />
                </div>
                <div className="pt-8 flex justify-between items-end">
                  <div className="h-8 w-28 bg-slate-200 rounded-md" />
                  <div className="flex gap-2">
                    <div className="h-10 w-24 bg-slate-200 rounded-xl" />
                    <div className="h-10 w-28 bg-slate-200 rounded-xl" />
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
        <div className="space-y-5">
          {displayedAccommodations.map((item) => (
            <AccommodationCard
              key={item.id || item._id}
              accommodation={item}
              onViewDetails={onViewDetails}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      )}

      {/* ตัวควบคุม Pagination อัจฉริยะ (เลย์เอาต์แบบ ellipsis ป้องกันล้นจอ) */}
      {!loading && !error && totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs mt-6">
          <div className="text-xs sm:text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-900">{endIndex}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalCount}</span> stays
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
            {/* ปุ่มหน้าก่อนหน้า */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <span>←</span>
              <span className="hidden xs:inline">Prev</span>
            </button>

            {/* เลขหน้า (ตัวเลข + จุดไข่ปลา) */}
            {paginationItems.map((item, index) => {
              if (item === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-400 font-bold text-xs sm:text-sm select-none"
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
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <span className="hidden xs:inline">Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
