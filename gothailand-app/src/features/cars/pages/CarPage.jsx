import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CarHero,
  CarFilterSidebar,
  CarCard,
  Button,
} from '../components';
import { getCars } from '../services/carService';
import { getDefaultDateRange, calculateDateSpan } from '../../../utils/date';

/**
 * CarPage (Car Rentals Feature Page)
 * -------------------------------------------------------------
 * หน้ารายการจองรถเช่าท่องเที่ยวหลักของระบบ:
 * - ส่วนหัว: CarHero พร้อมกล่องค้นหาสไตล์ Yok
 * - ด้านซ้าย: CarFilterSidebar แบบคลีน ไร้ Emoji สไตล์ Yok
 * - ด้านขวา: กริดแสดงรายการรถด้วยคอมโพเนนต์ CarCard ของ Guitar
 * - เชื่อมต่อข้อมูลจริงจาก API https://gothailand-api.onrender.com/api/cars
 * - โทนสี กรมท่าเข้ม (#0a192f) + สีทอง/เหลืองอำพัน (Amber-400/500) และฟอนต์ Serif
 */
export default function CarPage() {
  const navigate = useNavigate();

  // ข้อมูลรถจาก API
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ตัวกรองจาก Hero Search Bar
  const [searchLocation, setSearchLocation] = useState('');
  const defaultRentalDates = getDefaultDateRange(1, 4);
  const [pickupDate, setPickupDate] = useState(defaultRentalDates.start);
  const [returnDate, setReturnDate] = useState(defaultRentalDates.end);
  const [heroCategory, setHeroCategory] = useState('all');

  // ตัวกรองจาก Sidebar
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [selectedTransmission, setSelectedTransmission] = useState('all');

  // เรียงลำดับและแบ่งหน้า
  const [sortBy, setSortBy] = useState('recommended');
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // ดึงข้อมูลรถจาก API และรีเซ็ตตำแหน่ง Scroll ไปบนสุด
  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;
    async function loadCarsData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCars();
        if (isMounted) {
          setCars(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load cars:", err);
          setError("Unable to load vehicles. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCarsData();
    return () => {
      isMounted = false;
    };
  }, []);

  // เมื่อเลือก Category ใน Hero ให้อัปเดตไปยัง Sidebar
  const handleHeroCategoryChange = (catId) => {
    setHeroCategory(catId);
    if (catId === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([catId]);
    }
    setCurrentPage(1);
  };

  // Toggle หมวดหมู่ใน Sidebar
  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(category);
      const next = exists ? prev.filter((c) => c !== category) : [...prev, category];
      // ซิงก์กลับไปที่ hero ถ้าเลือกแค่หนึ่งหรือไม่เลือกเลย
      if (next.length === 1) {
        setHeroCategory(next[0]);
      } else {
        setHeroCategory('all');
      }
      return next;
    });
    setCurrentPage(1);
  };

  // Toggle ชนิดเชื้อเพลิง
  const handleToggleFuelType = (fuel) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
    setCurrentPage(1);
  };

  // Reset ตัวกรองทั้งหมด
  const handleResetFilters = () => {
    setSearchLocation('');
    setHeroCategory('all');
    setSelectedCategories([]);
    setMaxPrice(5000);
    setSelectedLocation('');
    setSelectedFuelTypes([]);
    setSelectedSeats(null);
    setSelectedTransmission('all');
    setSortBy('recommended');
    setCurrentPage(1);
  };

  // Submit การค้นหาจาก Hero
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // เปลี่ยนหน้า Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // คำนวณจำนวนวันเช่า
  const rentalDays = calculateDateSpan(pickupDate, returnDate);

  // รวบรวมรายชื่อจุดรับรถทั้งหมด (Unique Locations)
  const allLocations = useMemo(() => {
    const set = new Set();
    cars.forEach((car) => {
      (car.availableLocations || []).forEach((loc) => set.add(loc));
    });
    return Array.from(set).sort();
  }, [cars]);

  // คำนวณจำนวนรถตาม Category และ Fuel Type
  const { categoryCounts, fuelCounts } = useMemo(() => {
    const catAcc = {};
    const fuelAcc = {};

    cars.forEach((car) => {
      const cat = car.category || 'Economy';
      catAcc[cat] = (catAcc[cat] || 0) + 1;

      const fuel = car.fuelType || car.fuel || 'Petrol';
      fuelAcc[fuel] = (fuelAcc[fuel] || 0) + 1;
    });

    return { categoryCounts: catAcc, fuelCounts: fuelAcc };
  }, [cars]);

  // กรองและเรียงลำดับรายการรถ
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        const carPrice = car.pricePerDay || car.price || 0;
        const carCategory = (car.category || '').toLowerCase();
        const carFuel = (car.fuelType || car.fuel || '').toLowerCase();
        const carSeats = car.seats || 5;
        const carTrans = (car.transmission || 'automatic').toLowerCase();
        const carLocations = (car.availableLocations || []).map((l) => l.toLowerCase());
        const carName = (car.name || '').toLowerCase();

        // 1. กรองราคา
        if (carPrice > maxPrice) return false;

        // 2. กรองหมวดหมู่
        if (selectedCategories.length > 0) {
          const matchCat = selectedCategories.some(
            (c) => c.toLowerCase() === carCategory
          );
          if (!matchCat) return false;
        }

        // 3. กรองสถานที่ (จาก Hero Input หรือ Sidebar Dropdown)
        const queryLoc = (searchLocation || selectedLocation).trim().toLowerCase();
        if (queryLoc) {
          const locMatched =
            carLocations.some((loc) => loc.includes(queryLoc)) ||
            carName.includes(queryLoc);
          if (!locMatched) return false;
        }

        // 4. กรองชนิดเชื้อเพลิง
        if (selectedFuelTypes.length > 0) {
          const matchFuel = selectedFuelTypes.some(
            (f) => f.toLowerCase() === carFuel
          );
          if (!matchFuel) return false;
        }

        // 5. กรองจำนวนที่นั่ง
        if (selectedSeats !== null) {
          if (selectedSeats === 5 && carSeats > 5) return false;
          if (selectedSeats === 7 && carSeats < 7) return false;
        }

        // 6. กรองระบบเกียร์
        if (selectedTransmission !== 'all') {
          if (!carTrans.includes(selectedTransmission.toLowerCase())) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.pricePerDay || a.price || 0;
        const priceB = b.pricePerDay || b.price || 0;
        const ratingA = a.rating ?? 5.0;
        const ratingB = b.rating ?? 5.0;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return ratingB - ratingA;
        // recommended: คะแนน * รีวิว
        return (ratingB * (b.reviewCount || 1)) - (ratingA * (a.reviewCount || 1));
      });
  }, [
    cars,
    maxPrice,
    selectedCategories,
    searchLocation,
    selectedLocation,
    selectedFuelTypes,
    selectedSeats,
    selectedTransmission,
    sortBy,
  ]);

  // การแบ่งหน้า
  const totalPages = Math.ceil(filteredCars.length / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedCars = useMemo(() => {
    if (pageSize >= 999) return filteredCars;
    const startIndex = (activePage - 1) * pageSize;
    return filteredCars.slice(startIndex, startIndex + pageSize);
  }, [filteredCars, activePage, pageSize]);

  // เปิดหน้ารายละเอียดรถ (แสดง slug ใน URL เช่น /cars/toyota-fortuner)
  const handleViewDetail = (car) => {
    const carId = car.slug || car._id || car.id;
    navigate(`/cars/${carId}`, {
      state: {
        car,
        pickupLocation:
          searchLocation ||
          selectedLocation ||
          car.availableLocations?.[0] ||
          'Bangkok (BKK) Suvarnabhumi Airport',
        rentalDays,
      },
    });
  };

  return (
    <div className="pb-16 font-sans text-slate-800">
      {/* 1. ส่วนหัว Hero พร้อมกล่องค้นหา Floating Search Bar (Yok Pattern) */}
      <CarHero
        searchLocation={searchLocation}
        onSearchLocationChange={setSearchLocation}
        pickupDate={pickupDate}
        onPickupDateChange={setPickupDate}
        returnDate={returnDate}
        onReturnDateChange={setReturnDate}
        selectedCategory={heroCategory}
        onSelectedCategoryChange={handleHeroCategoryChange}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. ส่วนแสดงผลหลัก: Filter Sidebar (ซ้าย) + Car List (ขวา) */}
      <div className="pt-2">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* แถบตัวกรอง (Sidebar) สไตล์ Yok */}
          <CarFilterSidebar
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            selectedFuelTypes={selectedFuelTypes}
            onToggleFuelType={handleToggleFuelType}
            selectedSeats={selectedSeats}
            onSelectSeats={setSelectedSeats}
            selectedTransmission={selectedTransmission}
            onSelectTransmission={setSelectedTransmission}
            onResetFilters={handleResetFilters}
            categoryCounts={categoryCounts}
            fuelCounts={fuelCounts}
            totalCount={cars.length}
            locations={allLocations}
          />

          {/* รายการรถยนต์ (Car List Area) */}
          <div className="flex-1 w-full space-y-6">
            {/* Header ควบคุมการเรียงลำดับและจำนวน */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
                  Available Cars
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-bold text-slate-800">{filteredCars.length}</span>{' '}
                  vehicles matching your criteria
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* ตัวเลือกการเรียงลำดับ */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-slate-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 bg-slate-50 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="recommended">Recommended ▾</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* ตัวเลือกขนาดหน้า */}
                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 border-l border-slate-200 pl-3">
                  <span className="text-slate-400">Show:</span>
                  {[6, 9, 999].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPageSize(size)}
                      className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        pageSize === size
                          ? 'bg-[#0a192f] text-amber-400'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {size === 999 ? 'All' : size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* สถานะกำลังโหลด */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs animate-pulse"
                  >
                    <div className="h-48 bg-slate-200 w-full" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                      <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                      <div className="h-8 bg-slate-100 rounded-md w-full" />
                      <div className="h-10 bg-slate-200 rounded-xl w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* สถานะข้อผิดพลาด */}
            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-800">
                <p className="font-semibold text-sm mb-2">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload Vehicles
                </Button>
              </div>
            )}

            {/* สถานะไม่มีข้อมูล */}
            {!loading && !error && filteredCars.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 text-3xl flex items-center justify-center mx-auto mb-4">
                  🚗
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
                  No vehicles found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  We couldn't find any vehicles matching your filter criteria. Try expanding your price range, clearing location or resetting filters.
                </p>
                <Button variant="primary" onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* กริดรายการรถ */}
            {!loading && !error && filteredCars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedCars.map((car) => (
                  <CarCard
                    key={car._id || car.slug || car.id}
                    car={car}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
            )}

            {/* ตัวควบคุม Pagination */}
            {!loading && totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                        activePage === page
                          ? 'bg-[#0a192f] text-amber-400 shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
                  disabled={activePage === totalPages}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
