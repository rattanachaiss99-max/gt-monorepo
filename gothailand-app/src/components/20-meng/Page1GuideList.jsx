import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  Compass,
  ShieldCheck,
  SlidersHorizontal,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';

export const Page1GuideList = ({
  guides,
  onSelectGuide,
}) => {
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedDates, setSelectedDates] = useState('15 Sep 2026');
  const [guestsCount, setGuestsCount] = useState('2 Guests');

  // Filters
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [priceMax, setPriceMax] = useState(5000);
  const [sortBy, setSortBy] = useState('recommended');

  const guideTypes = [
    'Cultural Expert',
    'Food & Culinary',
    'Adventure & Nature',
    'Photography',
  ];

  const languages = ['English', 'Mandarin', 'French', 'German', 'Thai', 'Spanish', 'Japanese', 'Korean'];

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
    setSelectedLanguage('');
    setPriceMax(5000);
    setDestinationQuery('');
  };

  const filteredGuides = useMemo(() => {
    const list = guides.filter((guide) => {
      // Price filter
      if (guide.pricePerDay > priceMax) return false;

      // Type filter (if any selected)
      if (selectedTypes.length > 0) {
        const matchesType = selectedTypes.some((type) => {
          if (type === 'Cultural Expert') {
            return (
              guide.specialties.includes('Culture') ||
              guide.specialties.includes('Cultural Expert') ||
              guide.specialties.includes('Culture & History')
            );
          }
          if (type === 'Food & Culinary') {
            return (
              guide.specialties.includes('Local Food') ||
              guide.specialties.includes('Culinary Arts') ||
              guide.specialties.includes('Food & Culinary')
            );
          }
          if (type === 'Adventure & Nature') {
            return guide.specialties.includes('Adventure & Nature');
          }
          if (type === 'Photography') {
            return guide.specialties.includes('Photography');
          }
          return false;
        });
        if (!matchesType) return false;
      }

      // Language filter
      if (selectedLanguage && !guide.languages.includes(selectedLanguage)) {
        return false;
      }

      // Search query
      if (destinationQuery.trim()) {
        const q = destinationQuery.toLowerCase();
        const inLocation = guide.location.toLowerCase().includes(q);
        const inName = guide.name.toLowerCase().includes(q);
        const inBio = guide.bio.toLowerCase().includes(q);
        if (!inLocation && !inName && !inBio) return false;
      }

      return true;
    });

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended default
    });
  }, [guides, selectedTypes, selectedLanguage, priceMax, destinationQuery, sortBy]);

  const displayedGuides = filteredGuides;

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Hero Section */}
      <div className="relative min-h-[460px] md:min-h-[500px] flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Background Image with warm overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center brightness-75 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/40 to-stone-900/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-16">
          <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-tight drop-shadow-md">
            Explore Thailand with a Local Guide
          </h1>
          <p className="mt-4 text-base sm:text-xl text-stone-200 font-light max-w-2xl mx-auto drop-shadow">
            Discover authentic experiences with trusted local experts.
          </p>

          {/* Floating Search Bar */}
          <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl max-w-4xl mx-auto border border-stone-200/80 text-stone-800">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              {/* Destination */}
              <div className="sm:col-span-4 flex items-center px-4 py-2 sm:py-2.5 rounded-lg hover:bg-stone-50 transition-colors border-b sm:border-b-0 sm:border-r border-stone-200">
                <MapPin className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-stone-600">Destination</span>
                  <input
                    id="search-destination-input"
                    type="text"
                    value={destinationQuery}
                    onChange={(e) => setDestinationQuery(e.target.value)}
                    placeholder="Destination (e.g. Bangkok)"
                    className="w-full text-sm font-medium text-stone-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="sm:col-span-3 flex items-center px-4 py-2 sm:py-2.5 rounded-lg hover:bg-stone-50 transition-colors border-b sm:border-b-0 sm:border-r border-stone-200">
                <Calendar className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-stone-600">Dates</span>
                  <input
                    id="search-dates-input"
                    type="text"
                    value={selectedDates}
                    onChange={(e) => setSelectedDates(e.target.value)}
                    placeholder="Add dates"
                    className="w-full text-sm font-medium text-stone-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="sm:col-span-2 flex items-center px-4 py-2 sm:py-2.5 rounded-lg hover:bg-stone-50 transition-colors">
                <Users className="w-5 h-5 text-stone-400 mr-2 shrink-0" />
                <div className="text-left w-full">
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-stone-600">Guests</span>
                  <select
                    id="search-guests-select"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full text-sm font-medium text-stone-900 focus:outline-none bg-transparent cursor-pointer"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3 Guests">3 Guests</option>
                    <option value="4+ Guests">4+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-3 flex justify-end">
                <button
                  id="find-guide-submit-btn"
                  className="w-full py-3.5 px-6 bg-[#d4a326] hover:bg-[#b88c1c] text-[#1c1d1f] font-semibold text-sm rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a Guide</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Listing & Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Filters */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-7">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-serif-luxury text-xl font-semibold text-stone-900">
                Filters
              </h3>
              <button
                id="filter-clear-all-btn"
                onClick={handleClearAll}
                className="text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* GUIDE TYPE */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-stone-900 uppercase mb-3">
                GUIDE TYPE
              </h4>
              <div className="space-y-2.5">
                {guideTypes.map((type) => {
                  const isChecked = selectedTypes.includes(type);
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-3 text-sm text-stone-700 hover:text-stone-900 cursor-pointer select-none"
                    >
                      <input
                        id={`filter-type-${type.replace(/\s+/g, '-').toLowerCase()}`}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleType(type)}
                        className="w-4 h-4 rounded border-stone-300 text-[#0b1a30] focus:ring-[#c99726] cursor-pointer accent-[#0b1a30]"
                      />
                      <span>{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* LANGUAGE */}
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-stone-900 uppercase mb-3">
                LANGUAGE
              </h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => {
                  const isSelected = selectedLanguage === lang;
                  return (
                    <button
                      key={lang}
                      id={`filter-lang-${lang.toLowerCase()}`}
                      onClick={() => setSelectedLanguage(isSelected ? '' : lang)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-stone-900 text-stone-900 font-semibold bg-stone-50'
                          : 'border border-stone-200 text-stone-600 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-stone-900 uppercase mb-2">
                <span>PRICE RANGE (PER DAY)</span>
              </div>
              <input
                id="filter-price-slider"
                type="range"
                min={1500}
                max={5000}
                step={250}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#c99726]"
              />
              <div className="flex justify-between text-xs text-stone-500 mt-2 font-medium">
                <span>฿1,500</span>
                <span>฿{priceMax.toLocaleString()}+</span>
              </div>
            </div>
          </div>

          {/* Right Area: Guide Cards */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <p className="text-sm sm:text-base text-stone-700 font-normal">
                Showing <strong className="font-semibold text-stone-900">{filteredGuides.length}</strong> available guides in Thailand
              </p>
              <div className="flex items-center space-x-2 text-sm text-stone-600 self-end sm:self-auto">
                <span className="text-xs uppercase tracking-wider text-stone-600">Sort by:</span>
                <div className="relative">
                  <select
                    id="sort-by-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-stone-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedGuides.map((guide) => (
                <div
                  key={guide.id}
                  id={`guide-card-${guide.id}`}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                >
                  {/* Photo with rating tag */}
                  <div className="relative h-64 overflow-hidden bg-stone-100">
                    <img
                      src={guide.avatar}
                      alt={guide.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-stone-800 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(guide.rating).toFixed(1)}</span>
                      <span className="text-stone-500 font-normal">({guide.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-serif-luxury text-2xl font-bold text-stone-900 tracking-tight">
                          {guide.id === 'narin' ? 'Niran S.' : guide.name}
                        </h4>
                        <div className="text-right">
                          <span className="font-serif-luxury text-xl font-bold text-[#b5892b]">
                            ฿{guide.pricePerDay.toLocaleString()}
                          </span>
                          <span className="text-xs text-stone-500 font-normal"> / day</span>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-stone-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400" />
                        <span>{guide.id === 'narin' ? 'Bangkok & Ayutthaya' : guide.location}</span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {guide.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-md font-medium"
                          >
                            {spec === 'Culture' ? 'Culture & History' : spec}
                          </span>
                        ))}
                        <span className="bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-md font-medium">
                          {guide.languages.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* View Profile Action */}
                    <div className="pt-2">
                      <button
                        id={`view-profile-btn-${guide.id}`}
                        onClick={() => onSelectGuide(guide)}
                        className="w-full py-2.5 px-4 rounded-lg border border-stone-400 text-stone-800 hover:bg-[#0b1a30] hover:text-white hover:border-[#0b1a30] transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer guide count summary */}
            <div className="text-center pt-8 border-t border-stone-200">
              <p className="text-xs text-stone-500">
                Displaying all <strong className="font-semibold text-stone-800">{displayedGuides.length}</strong> licensed local guides across Thailand • Fully verified & background-checked
              </p>
            </div>
          </div>
        </div>

        {/* Why Travel with a Local Guide? Section */}
        <div className="mt-24 pt-16 border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-stone-900">
              Why Travel with a Local Guide?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                <Compass className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                Authentic Experiences
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Go beyond the tourist trails and experience Thailand through the eyes of a local.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                <ShieldCheck className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                Verified Experts
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every guide is thoroughly vetted to ensure professionalism, knowledge, and safety.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                <SlidersHorizontal className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                Personalized
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tailor your itinerary on the fly. Your guide adapts to your interests and pace.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                <MessageSquare className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                Seamless Translation
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Bridge the language gap effortlessly, ensuring smooth interactions wherever you go.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
