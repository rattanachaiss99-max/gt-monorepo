/* ============================================================
   components/HeroSection.jsx
   The big hero banner at the top of the home page.

   - Background: Thai beach illustration (public/images/)
   - Left      : Thailand map by region picture
                 (pic/ThailandMapByRegion.png -> public/images/,
                  the color legend is already part of the picture)
   - Center    : GoThailand logo picture
                 (pic/GoThailand_Logo.png -> public/images/,
                  the title and slogan are already in the picture)
   - Right     : (empty - the long-tail boat of the background
                 image shows through here, like in the design)
   ============================================================ */

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* background beach picture */}
      <img
        src="/images/hero-beach.jpg"                         //show hero-beach.jpg banner
        alt="Thai beach with limestone mountains and a long-tail boat"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* content laid on top of the picture */}
      <div
        /* REMARK: shifted GoThailand_Logo to the banner center -
           right column widened to mirror the 300px left column,
           so the middle (logo) column now sits exactly in the center */
        className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-[300px_1fr_300px]"
      >
        {/* ----- Left column: Thailand map by region ----- */}
        <div id="destinations" className="flex scroll-mt-24 flex-col items-center">
          <img
            src="/images/ThailandMapByRegion.png"
            alt="Map of Thailand divided into Northern, Northeastern, Central and Southern regions"
            className="w-64 rounded-xl p-2 drop-shadow-xl sm:w-72"
          />
        </div>

        {/* ----- Center column: GoThailand logo picture ----- */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/GoThailand_Logo.png"
            alt="GoThailand - Accommodation • Car Rental • Guide for private group"
            className="w-64 rounded-2xl drop-shadow-xl sm:w-80"
          />
          {/* the logo picture already shows the title and slogan,
              keep an invisible heading for screen readers / SEO */}
          <h1 className="sr-only">GoThailand - Accommodation, Car Rental, Guide</h1>
        </div>

        {/* ----- Right column: intentionally left empty so the
                boat of the background image stays visible ----- */}
        <div className="hidden md:block" />
      </div>
    </section>
  );
}
