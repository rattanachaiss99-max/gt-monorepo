import Button from './Button';

// Dynamically load all accommodation images from the assets folder using Vite
const accommodationImages = import.meta.glob(
  '../../assets/accommodations/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
);

/**
 * Helper to resolve image asset by accommodation ID
 */
function getImageForAccommodation(id) {
  if (!id) return null;
  return (
    accommodationImages[`../../assets/accommodations/${id}.jpg`] ||
    accommodationImages[`../../assets/accommodations/${id}.png`] ||
    accommodationImages[`../../assets/accommodations/${id}.webp`] ||
    null
  );
}

/**
 * AccommodationCard Component
 * Displays accommodation details with photo, tags, pricing, and action buttons.
 * Strictly adheres to API data schema without mock data.
 *
 * @param {Object} props
 * @param {Object} props.accommodation - Accommodation data item from API
 * @param {string} [props.imageSrc] - Optional image override
 * @param {Function} [props.onViewDetails] - Callback when "View Details" is clicked
 * @param {Function} [props.onBookNow] - Callback when "Book Now" is clicked
 */
export default function AccommodationCard({
  accommodation,
  imageSrc,
  onViewDetails,
  onBookNow,
}) {
  if (!accommodation) return null;

  const {
    id,
    name,
    category,
    description,
    location,
    rating_avg,
    special_options,
    base_price_per_night,
    rooms,
  } = accommodation;

  // Resolve image from local assets or override
  const resolvedImage =
    imageSrc ||
    getImageForAccommodation(id) ||
    accommodation.pictures?.[0] ||
    '';

  // Extract map coordinates if available
  const lat = location?.map_coordinates?.lat;
  const lng = location?.map_coordinates?.lng;
  const hasCoordinates = lat !== undefined && lng !== undefined;
  const mapUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location?.address_label || name || 'Thailand'
    )}`;

  // Guest info strictly derived from data schema (rooms[0].max_guests)
  const firstRoomGuests = rooms?.[0]?.max_guests;
  const adultCount = firstRoomGuests?.adults;
  const childCount = firstRoomGuests?.children;

  return (
    <article className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row md:h-[340px] group">
      {/* Left Column: Image with Overlays (Fixed uniform dimensions) */}
      <div className="relative w-full h-64 sm:h-72 md:h-full md:w-[360px] lg:w-[380px] shrink-0 overflow-hidden bg-slate-100">
        {resolvedImage ? (
          <img
            src={resolvedImage}
            alt={name || 'Accommodation'}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              // Graceful fallback if image cannot be loaded
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full min-h-[240px] bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
            <svg
              className="w-12 h-12 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Gradient shadow overlay for bottom text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        {/* Top-Left Category Badge */}
        {category && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {category}
            </span>
          </div>
        )}

        {/* Bottom-Left Location Label */}
        {location?.address_label && (
          <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
            <span className="text-[11px] font-bold tracking-wider text-white/95 uppercase drop-shadow-sm block truncate">
              {location.address_label}
            </span>
          </div>
        )}
      </div>

      {/* Right Column: Accommodation Details */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
        <div className="space-y-2.5">
          {/* Header Row: Title & Rating Badge */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight leading-snug truncate">
              {name}
            </h3>

            {typeof rating_avg === 'number' && (
              <div
                className="bg-slate-900 text-white text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shrink-0 shadow-2xs"
                title={`Rating: ${rating_avg.toFixed(1)} / 5`}
              >
                <span>{rating_avg.toFixed(1)}</span>
                <span className="text-amber-400 text-xs">★</span>
              </div>
            )}
          </div>

          {/* Location & "Show on map" link */}
          {location?.address_label && (
            <div className="flex items-center flex-wrap gap-1.5 text-slate-500 text-sm">
              {/* Map pin icon */}
              <span className="text-red-500 shrink-0 text-base" aria-hidden="true">
                📍
              </span>
              <span className="truncate max-w-[280px]">{location.address_label}</span>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm ml-1 transition-colors inline-flex items-center gap-0.5"
                title="View on Google Maps"
              >
                Show on map
              </a>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 pt-0.5">
              {description}
            </p>
          )}

          {/* Special Options Badges */}
          {Array.isArray(special_options) && special_options.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1.5">
              {special_options.map((option, index) => (
                <span
                  key={index}
                  className="bg-sky-50 text-sky-950 border border-sky-100/80 text-xs font-medium px-3 py-1 rounded-full transition-colors hover:bg-sky-100/70"
                >
                  {option}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          {/* Price & Guest Info */}
          <div>
            {/* Display adult count if provided by schema (no mock nights) */}
            {adultCount && (
              <p className="text-xs text-slate-500 font-medium mb-1">
                {adultCount} adult{adultCount > 1 ? 's' : ''}
                {childCount ? `, ${childCount} ${childCount > 1 ? 'children' : 'child'}` : ''}
              </p>
            )}

            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                ฿{Number(base_price_per_night || 0).toLocaleString()}
              </span>
              <span className="text-slate-500 text-sm font-normal">/ night</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:self-end">
            <Button
              variant="outline"
              onClick={() => onViewDetails?.(accommodation)}
            >
              View Details
            </Button>

            <Button
              variant="primary"
              onClick={() => onBookNow?.(accommodation)}
            >
              Book Now <span>→</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
