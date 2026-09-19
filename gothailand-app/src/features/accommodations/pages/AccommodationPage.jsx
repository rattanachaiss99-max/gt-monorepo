import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AccommodationHero,
  FilterSidebar,
  AccommodationList,
  BrowseByProperty,
  GetInspired,
} from '../components';

const API_ENDPOINT = 'https://gothailand-api.onrender.com/api/accommodations';

const SEARCH_ALIASES = {
  // Thai provinces & popular locations
  'เชียงใหม่': 'chiang mai',
  'เชียงราย': 'chiang rai',
  'กรุงเทพ': 'bangkok',
  'กทม': 'bangkok',
  'ภูเก็ต': 'phuket',
  'กระบี่': 'krabi',
  'พัทยา': 'chonburi',
  'ชลบุรี': 'chonburi',
  'หัวหิน': 'prachuap khiri khan',
  'อยุธยา': 'phra nakhon si ayutthaya',
  'กาญจนบุรี': 'kanchanaburi',
  'สมุย': 'surat thani',
  'เกาะสมุย': 'surat thani',
  'สุราษฎร์ธานี': 'surat thani',
  'แม่ฮ่องสอน': 'mae hong son',
  'ปาย': 'mae hong son',
  'เขาใหญ่': 'nakhon ratchasima',
  'โคราช': 'nakhon ratchasima',
  'นครราชสีมา': 'nakhon ratchasima',
  'ขอนแก่น': 'khon kaen',
  'อุดรธานี': 'udon thani',
  'อุบลราชธานี': 'ubon ratchathani',
  'พังงา': 'phang nga',
  'สงขลา': 'songkhla',
  'หาดใหญ่': 'songkhla',
  'ระยอง': 'rayong',
  'เกาะเสม็ด': 'rayong',
  'ตราด': 'trat',
  'เกาะช้าง': 'trat',
  'เกาะกูด': 'trat',
  'ภาคกลาง': 'central',
  'ภาคเหนือ': 'north',
  'ภาคอีสาน': 'isan',
  'ภาคใต้': 'south',
  'ภาคตะวันออก': 'east',
  'ภาคตะวันตก': 'west',
  // Common English nicknames
  'bkk': 'bangkok',
  'pattaya': 'chonburi',
  'samui': 'surat thani',
  'ayutthaya': 'phra nakhon si ayutthaya',
  'huahin': 'prachuap khiri khan',
  'hua hin': 'prachuap khiri khan',
  'khaoyai': 'nakhon ratchasima',
  'khao yai': 'nakhon ratchasima',
};

const normalizeText = (text) =>
  (text || '')
    .toString()
    .toLowerCase()
    .replace(/[\s\-_,.]/g, '');

function matchesSearch(item, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) return true;
  const q = rawQuery.toLowerCase().trim();
  const qNorm = normalizeText(q);

  // Targets to match
  const searchTargets = [q, qNorm];
  for (const [alias, mapped] of Object.entries(SEARCH_ALIASES)) {
    if (q.includes(alias) || alias.includes(q)) {
      searchTargets.push(mapped);
      searchTargets.push(normalizeText(mapped));
    }
  }

  // Multi-word token support
  const tokens = q.split(/\s+/).filter(Boolean);

  const fields = [
    item.name,
    item.location?.city,
    item.location?.district,
    item.location?.address_label,
    item.region,
    item.description,
    item.descriptionExtra,
    item.category,
    ...(item.categories || []),
    ...(item.facilities || []),
    ...(item.special_options || []),
  ].filter(Boolean);

  const fieldTexts = fields.map((f) => f.toString().toLowerCase());
  const fieldNorms = fields.map((f) => normalizeText(f));

  // Match if any search target matches any field (supports "chiangmai" matching "Chiang Mai")
  const anyTargetMatched = searchTargets.some((target) =>
    fieldTexts.some((f) => f.includes(target)) ||
    fieldNorms.some((fn) => fn.includes(target))
  );

  if (anyTargetMatched) return true;

  // If multi-word, verify each token matches something
  if (tokens.length > 1) {
    const allTokensMatch = tokens.every((token) => {
      const tokenNorm = normalizeText(token);
      return (
        fieldTexts.some((f) => f.includes(token)) ||
        fieldNorms.some((fn) => fn.includes(tokenNorm))
      );
    });
    if (allTokensMatch) return true;
  }

  return false;
}

/**
 * AccommodationPage
 * -------------------------------------------------------------
 * หน้าระบบที่พักท่องเที่ยว (Accommodation Experience)
 *  - Page 1: Landing Page (Hero, Browse by property, Get inspired)
 *  - Page 2: Search Results & Listing Page (Filter sidebar, Accommodation List, Pagination)
 * นำพาผู้ใช้เชื่อมต่อระหว่างหน้า 1 และ 2 ตามต้นแบบใน Canva
 * -------------------------------------------------------------
 */
export default function AccommodationPage() {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // View Mode: 'landing' (Page 1) or 'results' (Page 2)
  const [viewMode, setViewMode] = useState('landing');

  const handleViewAccommodation = (item) => {
    const slugId = item.slug || item.id || item._id;
    navigate(`/accommodations/${slugId}`, { state: { accommodation: item } });
  };

  // Search & Filter States
  const [selectedRegion, setSelectedRegion] = useState('central'); // default ภาคกลาง
  const [selectedProvince, setSelectedProvince] = useState(''); // filter by province
  const [pageSize, setPageSize] = useState(10); // default 10 / page
  const [searchTerm, setSearchTerm] = useState('');
  const [checkIn, setCheckIn] = useState('2026-09-18');
  const [checkOut, setCheckOut] = useState('2026-09-19');
  const [guestCount, setGuestCount] = useState(2);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedSpecialOptions, setSelectedSpecialOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  // Fetch real accommodation data from API
  useEffect(() => {
    window.scrollTo(0, 0);
    let ignore = false;
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_ENDPOINT, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        if (!ignore) {
          setAccommodations(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (!ignore && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch accommodations');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [reloadKey]);

  // Compute facet counts dynamically from accommodations list
  const {
    optionCounts,
    categoryCounts,
    facilityCounts,
    regionCounts,
    regionProvinces,
    destinationCounts,
  } = useMemo(() => {
    const optCounts = {};
    const catCounts = {};
    const facCounts = {};
    const regCounts = {};
    const regProvsMap = {};
    const destCounts = {};

    accommodations.forEach((item) => {
      // Count regions & provinces
      const reg = item.region;
      const city = item.location?.city;

      if (reg) {
        regCounts[reg] = (regCounts[reg] || 0) + 1;
        if (city) {
          if (!regProvsMap[reg]) regProvsMap[reg] = {};
          regProvsMap[reg][city] = (regProvsMap[reg][city] || 0) + 1;
          destCounts[city] = (destCounts[city] || 0) + 1;
        }
      }

      // Count special options
      if (Array.isArray(item.special_options)) {
        item.special_options.forEach((opt) => {
          optCounts[opt] = (optCounts[opt] || 0) + 1;
        });
      }

      // Count categories
      if (item.category) {
        catCounts[item.category] = (catCounts[item.category] || 0) + 1;
      }
      if (Array.isArray(item.categories)) {
        item.categories.forEach((cat) => {
          if (cat !== item.category) {
            catCounts[cat] = (catCounts[cat] || 0) + 1;
          }
        });
      }

      // Count facilities
      if (Array.isArray(item.facilities)) {
        item.facilities.forEach((fac) => {
          facCounts[fac] = (facCounts[fac] || 0) + 1;
        });
      }
    });

    // Format sorted provinces per region (higher count first)
    const sortedRegionProvinces = {};
    Object.entries(regProvsMap).forEach(([reg, citiesObj]) => {
      sortedRegionProvinces[reg] = Object.entries(citiesObj)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    });

    return {
      optionCounts: optCounts,
      categoryCounts: catCounts,
      facilityCounts: facCounts,
      regionCounts: regCounts,
      regionProvinces: sortedRegionProvinces,
      destinationCounts: destCounts,
    };
  }, [accommodations]);

  // Toggles for checkboxes
  const handleToggleSpecialOption = (option) => {
    setSelectedSpecialOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleToggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleToggleFacility = (fac) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setSelectedRegion('central');
    setSelectedProvince('');
    setPageSize(10);
    setSearchTerm('');
    setCheckIn('2026-09-18');
    setCheckOut('2026-09-19');
    setGuestCount(2);
    setMaxPrice(20000);
    setSelectedSpecialOptions([]);
    setSelectedCategories([]);
    setSelectedFacilities([]);
    setSortBy('recommended');
  };

  // User Actions: Transitions from Page 1 (Landing) to Page 2 (Results)
  const handleSearchSubmit = () => {
    // When submitting search from hero, if a destination keyword is typed, search across all regions
    if (searchTerm.trim()) {
      setSelectedRegion('all');
      setSelectedProvince('');
    }
    setViewMode('results');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleSelectPropertyType = (category) => {
    setSelectedRegion('all');
    setSelectedProvince('');
    setSelectedCategories([category]);
    setViewMode('results');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleSelectDestination = (city, region) => {
    if (region) setSelectedRegion(region);
    setSelectedProvince(city);
    setSelectedCategories([]);
    setViewMode('results');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Filter and Sort accommodations
  const { filteredAccommodations, activeRegionDisplay, activeProvinceDisplay } = useMemo(() => {
    let list = [...accommodations];

    // 1. Search term filter (with smart normalization e.g. "chiangmai" matching "Chiang Mai", Thai aliases, etc.)
    const hasSearchTerm = Boolean(searchTerm && searchTerm.trim());
    if (hasSearchTerm) {
      list = list.filter((item) => matchesSearch(item, searchTerm));
    }

    // 2. Region filter
    // If a search keyword produces results, but the currently selected region would filter ALL of them out,
    // gracefully relax region to 'all' so user search results are not hidden
    let effectiveRegion = selectedRegion;
    if (hasSearchTerm && effectiveRegion && effectiveRegion !== 'all') {
      const inCurrentRegion = list.filter((item) => item.region === effectiveRegion);
      if (inCurrentRegion.length === 0 && list.length > 0) {
        effectiveRegion = 'all';
      }
    }

    if (effectiveRegion && effectiveRegion !== 'all') {
      list = list.filter((item) => item.region === effectiveRegion);
    }

    // 3. Province filter
    let effectiveProvince = selectedProvince;
    if (hasSearchTerm && effectiveProvince) {
      const inCurrentProvince = list.filter(
        (item) => item.location?.city === effectiveProvince
      );
      if (inCurrentProvince.length === 0 && list.length > 0) {
        effectiveProvince = '';
      }
    }

    if (effectiveProvince) {
      list = list.filter((item) => item.location?.city === effectiveProvince);
    }

    // 4. Price filter
    if (maxPrice < 20000) {
      list = list.filter(
        (item) => Number(item.base_price_per_night || 0) <= maxPrice
      );
    }

    // 5. Guest count filter (strictly based on rooms[].max_guests.adults)
    if (guestCount) {
      const minGuests = Number(guestCount);
      list = list.filter((item) => {
        if (!Array.isArray(item.rooms) || item.rooms.length === 0) return true;
        return item.rooms.some(
          (room) => Number(room.max_guests?.adults || 0) >= minGuests
        );
      });
    }

    // 6. Special Options filter (e.g. Breakfast Included, Private Pool)
    if (selectedSpecialOptions.length > 0) {
      list = list.filter((item) => {
        const itemOptions = Array.isArray(item.special_options)
          ? item.special_options
          : [];
        return selectedSpecialOptions.every((opt) => itemOptions.includes(opt));
      });
    }

    // 7. Category filter
    if (selectedCategories.length > 0) {
      list = list.filter((item) => {
        const cats = [item.category, ...(item.categories || [])].filter(Boolean);
        return selectedCategories.some((selectedCat) => cats.includes(selectedCat));
      });
    }

    // 8. Facilities filter
    if (selectedFacilities.length > 0) {
      list = list.filter((item) => {
        const itemFacs = Array.isArray(item.facilities) ? item.facilities : [];
        return selectedFacilities.every((f) => itemFacs.includes(f));
      });
    }

    // 9. Sort
    if (sortBy === 'price_asc') {
      list.sort(
        (a, b) =>
          Number(a.base_price_per_night || 0) - Number(b.base_price_per_night || 0)
      );
    } else if (sortBy === 'price_desc') {
      list.sort(
        (a, b) =>
          Number(b.base_price_per_night || 0) - Number(a.base_price_per_night || 0)
      );
    } else if (sortBy === 'rating_desc') {
      list.sort((a, b) => Number(b.rating_avg || 0) - Number(a.rating_avg || 0));
    }

    return {
      filteredAccommodations: list,
      activeRegionDisplay: effectiveRegion,
      activeProvinceDisplay: effectiveProvince,
    };
  }, [
    accommodations,
    selectedRegion,
    selectedProvince,
    searchTerm,
    maxPrice,
    guestCount,
    selectedSpecialOptions,
    selectedCategories,
    selectedFacilities,
    sortBy,
  ]);

  return (
    <div className="pb-16 font-sans">
      {/* 1. Full-Width Hero Section with Floating Search Bar */}
      <AccommodationHero
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        checkIn={checkIn}
        onCheckInChange={setCheckIn}
        checkOut={checkOut}
        onCheckOutChange={setCheckOut}
        guestCount={guestCount}
        onGuestCountChange={setGuestCount}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* PAGE 1: Landing Page (Browse by property type + Get inspired) */}
      {viewMode === 'landing' && (
        <div>
          {/* Section: Browse by property type */}
          <BrowseByProperty
            categoryCounts={categoryCounts}
            onSelectCategory={handleSelectPropertyType}
          />

          {/* Section: Get inspired for your next trip */}
          <GetInspired
            destinationCounts={destinationCounts}
            onSelectDestination={handleSelectDestination}
          />
        </div>
      )}

      {/* PAGE 2: Search Results & Filters Listing View */}
      {viewMode === 'results' && (
        <div>
          {/* Back Navigation to Landing Page */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setViewMode('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <span>←</span>
              <span>Back to explore stays</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Search results mode
            </span>
          </div>

          {/* 2-Column Grid: Filter Sidebar (Left) + Accommodation List (Right) */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <FilterSidebar
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              selectedProvince={selectedProvince}
              onSelectProvince={setSelectedProvince}
              regionCounts={regionCounts}
              regionProvinces={regionProvinces}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              selectedSpecialOptions={selectedSpecialOptions}
              onToggleSpecialOption={handleToggleSpecialOption}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              selectedFacilities={selectedFacilities}
              onToggleFacility={handleToggleFacility}
              onResetFilters={handleResetFilters}
              optionCounts={optionCounts}
              categoryCounts={categoryCounts}
              facilityCounts={facilityCounts}
              totalCount={accommodations.length}
            />

            <AccommodationList
              accommodations={filteredAccommodations}
              loading={loading}
              error={error}
              selectedRegion={activeRegionDisplay}
              selectedProvince={activeProvinceDisplay}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onRetry={() => setReloadKey((prev) => prev + 1)}
              onResetFilters={handleResetFilters}
              onViewDetails={handleViewAccommodation}
              onBookNow={handleViewAccommodation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
