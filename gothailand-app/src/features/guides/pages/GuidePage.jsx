import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  GuideHero,
  GuideCard,
  Button,
} from '../components';
import { TravelFilterSidebar, ItemVisibilityBadge } from '../../../components/common';
import { useAuth } from '../../../context/AuthContext';
import { useItemVisibility } from '../../../context/ItemVisibilityContext';
import { getGuides } from '../services/guideService';

/**
 * GuidePage (Tourist Guides Feature Main Page)
 * -------------------------------------------------------------
 * หน้ารวมรายชื่อมัคคุเทศก์ / ไกด์นำเที่ยวหลักของระบบ:
 * - ส่วนหัว: GuideHero พร้อม Floating Search Bar ค้นหาตามจังหวัด ภาษา วันที่
 * - ด้านซ้าย: GuideFilterSidebar กรองจังหวัด ราคา ภาษา ใบอนุญาต เพศ สถานะ
 * - ด้านขวา: กริดแสดงการ์ดมัคคุเทศก์ GuideCard
 * - เชื่อมต่อข้อมูลจริงจาก API https://gothailand-api.onrender.com/api/guides
 * - ดีไซน์สอดคล้องกับธีมรถเช่าและที่พัก (Navy #0a192f + Amber Gold + ฟอนต์ Serif)
 */
export default function GuidePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramProvince = searchParams.get('province') || '';
  const paramDate = searchParams.get('date') || '';
  const paramLanguage = searchParams.get('language') || 'all';

  // ข้อมูลไกด์จาก API
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ตัวกรองจาก Hero Search Bar
  const [selectedProvince, setSelectedProvince] = useState(paramProvince);
  const [tourDate, setTourDate] = useState(paramDate);
  const [selectedLanguage, setSelectedLanguage] = useState(paramLanguage);

  // ตัวกรองจาก Sidebar
  const [maxDailyRate, setMaxDailyRate] = useState(5000);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedLicenseCategory, setSelectedLicenseCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // เรียงลำดับและแบ่งหน้า
  const [sortBy, setSortBy] = useState('recommended');
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // ควบคุมการแสดงผลของ Admin (รูปตา 👁️)
  const { isAdmin } = useAuth();
  const { isItemVisible, adminCustomerPreview } = useItemVisibility();

  // ดึงข้อมูลไกด์จาก API และรีเซ็ต scroll ไปบนสุด
  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function loadGuidesData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getGuides();
        if (isMounted) {
          setGuides(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load guides:", err);
          setError("ไม่สามารถดึงข้อมูลไกด์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadGuidesData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle ภาษาใน Sidebar
  const handleToggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
    setCurrentPage(1);
  };

  // Reset ตัวกรองทั้งหมด
  const handleResetFilters = () => {
    setSelectedProvince('');
    setSelectedLanguage('all');
    setMaxDailyRate(5000);
    setSelectedLanguages([]);
    setSelectedLicenseCategory('all');
    setSelectedGender('all');
    setVerifiedOnly(false);
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

  // คำนวณจำนวนไกด์แยกตามจังหวัดและภาษา
  const { provinceCounts, languageCounts } = useMemo(() => {
    const provAcc = {};
    const langAcc = {};

    guides.forEach((g) => {
      if (g.province) {
        provAcc[g.province] = (provAcc[g.province] || 0) + 1;
      }
      const langs = Array.isArray(g.language)
        ? g.language
        : Array.isArray(g.languages)
          ? g.languages
          : [];
      langs.forEach((l) => {
        langAcc[l] = (langAcc[l] || 0) + 1;
      });
    });

    return { provinceCounts: provAcc, languageCounts: langAcc };
  }, [guides]);

  // รายชื่อจังหวัดและภาษาทั้งหมดจาก API (เรียงตัวอักษร)
  const availableProvinces = Object.keys(provinceCounts).sort();
  const availableLanguages = Object.keys(languageCounts).sort();

  // กรองและเรียงลำดับรายการไกด์
  const filteredGuides = useMemo(() => {
    return guides
      .filter((guide) => {
        const fee = guide.daily_fee || guide.pricePerDay || 0;
        const prov = (guide.province || '').toLowerCase();
        const gender = (guide.gender || '').toLowerCase();
        const licenseCat = guide.license_category || '';
        const guideLanguages = (
          Array.isArray(guide.language)
            ? guide.language
            : Array.isArray(guide.languages)
              ? guide.languages
              : []
        ).map((l) => l.toLowerCase());

        // 1. กรองราคา
        if (fee > maxDailyRate) return false;

        // 2. กรองจังหวัด (จาก Hero หรือ Sidebar)
        if (selectedProvince && selectedProvince !== 'all') {
          if (!prov.includes(selectedProvince.toLowerCase())) return false;
        }

        // 3. กรองภาษาจาก Hero Dropdown
        if (selectedLanguage && selectedLanguage !== 'all') {
          if (!guideLanguages.includes(selectedLanguage.toLowerCase())) return false;
        }

        // 4. กรองภาษาจาก Sidebar Checkboxes
        if (selectedLanguages.length > 0) {
          const matchLang = selectedLanguages.some((l) =>
            guideLanguages.includes(l.toLowerCase())
          );
          if (!matchLang) return false;
        }

        // 5. กรองประเภทใบอนุญาต
        if (selectedLicenseCategory !== 'all') {
          if (licenseCat !== selectedLicenseCategory) return false;
        }

        // 6. กรองเพศสภาพ
        if (selectedGender !== 'all') {
          if (gender !== selectedGender.toLowerCase()) return false;
        }

        // 7. กรอง Verified
        if (verifiedOnly && !guide.verified) {
          return false;
        }

        // 8. กรองการแสดงผลของ Admin (Item Visibility / รูปตา 👁️)
        const isVisible = isItemVisible('guides', guide, [guide._id, guide.slug, guide.id]);
        if ((!isAdmin || adminCustomerPreview) && !isVisible) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const feeA = a.daily_fee || a.pricePerDay || 0;
        const feeB = b.daily_fee || b.pricePerDay || 0;
        const ratingA = a.rating_avg ?? a.rating ?? 5.0;
        const ratingB = b.rating_avg ?? b.rating ?? 5.0;
        const expA = a.years_experience || 0;
        const expB = b.years_experience || 0;

        if (sortBy === 'price-asc') return feeA - feeB;
        if (sortBy === 'price-desc') return feeB - feeA;
        if (sortBy === 'rating') return ratingB - ratingA;
        if (sortBy === 'experience') return expB - expA;
        // recommended: คะแนน * รีวิว
        return (ratingB * (b.total_reviews || 1)) - (ratingA * (a.total_reviews || 1));
      });
  }, [
    guides,
    maxDailyRate,
    selectedProvince,
    selectedLanguage,
    selectedLanguages,
    selectedLicenseCategory,
    selectedGender,
    verifiedOnly,
    sortBy,
    isAdmin,
    adminCustomerPreview,
    isItemVisible,
  ]);

  // การแบ่งหน้า
  const totalPages = Math.ceil(filteredGuides.length / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedGuides = useMemo(() => {
    if (pageSize >= 999) return filteredGuides;
    const startIndex = (activePage - 1) * pageSize;
    return filteredGuides.slice(startIndex, startIndex + pageSize);
  }, [filteredGuides, activePage, pageSize]);

  // เปิดหน้ารายละเอียดไกด์
  const handleViewDetail = (guide) => {
    const guideId = guide._id || guide.id;
    navigate(`/guides/${guideId}`, {
      state: {
        guide,
        tourDate,
      },
    });
  };

  return (
    <div className="pb-16 font-sans text-slate-800">
      {/* 1. Hero Section พร้อมกล่องค้นหา Floating Search Bar */}
      <GuideHero
        selectedProvince={selectedProvince}
        onSelectedProvinceChange={(prov) => {
          setSelectedProvince(prov);
          setCurrentPage(1);
        }}
        tourDate={tourDate}
        onTourDateChange={setTourDate}
        selectedLanguage={selectedLanguage}
        onSelectedLanguageChange={(lang) => {
          setSelectedLanguage(lang);
          setCurrentPage(1);
        }}
        availableProvinces={availableProvinces}
        availableLanguages={availableLanguages}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. ส่วนแสดงผลหลัก: Filter Sidebar (ซ้าย) + Guides List (ขวา) */}
      <div className="pt-2">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* แถบตัวกรองส่วนกลาง (Shared TravelFilterSidebar) */}
          <TravelFilterSidebar
            service="guides"
            selectedProvince={selectedProvince}
            onSelectProvince={(prov) => {
              setSelectedProvince(prov);
              setCurrentPage(1);
            }}
            maxDailyRate={maxDailyRate}
            onMaxDailyRateChange={(rate) => {
              setMaxDailyRate(rate);
              setCurrentPage(1);
            }}
            selectedLanguages={selectedLanguages}
            onToggleLanguage={handleToggleLanguage}
            selectedLicenseCategory={selectedLicenseCategory}
            onSelectLicenseCategory={(cat) => {
              setSelectedLicenseCategory(cat);
              setCurrentPage(1);
            }}
            selectedGender={selectedGender}
            onSelectGender={(gen) => {
              setSelectedGender(gen);
              setCurrentPage(1);
            }}
            verifiedOnly={verifiedOnly}
            onToggleVerifiedOnly={(v) => {
              setVerifiedOnly(v);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
            provinceCounts={provinceCounts}
            languageCounts={languageCounts}
            totalCount={guides.length}
          />

          {/* รายการมัคคุเทศก์ (Guides Grid Area) */}
          <div className="flex-1 w-full space-y-6">
            {/* Header ควบคุมการเรียงลำดับและจำนวน */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
                  Available Tour Guides
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-bold text-slate-800">{filteredGuides.length}</span>{' '}
                  guides matching your travel preferences
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-slate-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 bg-slate-50 outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="recommended">Recommended ▾</option>
                    <option value="rating">Highest Rated</option>
                    <option value="experience">Most Experienced</option>
                    <option value="price-asc">Daily Fee: Low to High</option>
                    <option value="price-desc">Daily Fee: High to Low</option>
                  </select>
                </div>

                {/* Page Size selector */}
                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 border-l border-slate-200 pl-3">
                  <span className="text-slate-400">Show:</span>
                  {[6, 9, 999].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPageSize(size)}
                      className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${pageSize === size
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

            {/* Loading State (Skeleton Syle Yok) */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs animate-pulse"
                  >
                    <div className="h-60 bg-slate-200 w-full" />
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

            {/* Error State */}
            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-800">
                <p className="font-semibold text-sm mb-2">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload Guides
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredGuides.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 text-3xl flex items-center justify-center mx-auto mb-4">
                  🧭
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
                  No tour guides found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  ไม่พบมัคคุเทศก์ที่ตรงกับเงื่อนไขการค้นหาของคุณ ลองปรับลดตัวกรองราคา หรือเลือกจังหวัดและภาษาอื่นดูครับ
                </p>
                <Button variant="primary" onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Guides Grid */}
            {!loading && !error && filteredGuides.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedGuides.map((guide) => {
                  const guideId = guide._id || guide.slug || guide.id;
                  const isVisible = isItemVisible('guides', guide, [guide._id, guide.slug, guide.id]);

                  return (
                    <div key={guideId} className="relative group">
                      <ItemVisibilityBadge
                        serviceType="guides"
                        item={guide}
                        itemId={guideId}
                        fallbackIds={[guide._id, guide.slug, guide.id]}
                        variant="card"
                      />
                      <div className={!isVisible ? 'opacity-65 grayscale-25 ring-2 ring-rose-400/80 rounded-2xl sm:rounded-3xl transition-all' : 'transition-all'}>
                        <GuideCard
                          guide={guide}
                          onViewDetail={handleViewDetail}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls — Truncated (แสดงแค่หน้าใกล้เคียง + ellipsis) */}
            {!loading && totalPages > 1 && (() => {
              const delta = 2;
              const range = [];
              for (let i = Math.max(2, activePage - delta); i <= Math.min(totalPages - 1, activePage + delta); i++) {
                range.push(i);
              }
              const pages = [1, ...range, totalPages].filter((v, i, a) => a.indexOf(v) === i);

              const btnBase = 'w-8 h-8 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center';
              const btnActive = 'bg-[#0a192f] text-amber-400 shadow-2xs';
              const btnNormal = 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50';

              return (
                <div className="pt-6 flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                    disabled={activePage === 1}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    ← Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {pages.reduce((acc, page, idx) => {
                      if (idx > 0 && page - pages[idx - 1] > 1) {
                        acc.push(
                          <span key={`ellipsis-${page}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold">
                            …
                          </span>
                        );
                      }
                      acc.push(
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`${btnBase} ${activePage === page ? btnActive : btnNormal}`}
                        >
                          {page}
                        </button>
                      );
                      return acc;
                    }, [])}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
                    disabled={activePage === totalPages}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
