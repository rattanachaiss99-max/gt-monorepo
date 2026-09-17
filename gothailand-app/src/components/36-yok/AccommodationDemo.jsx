import { useState, useEffect } from 'react';
import AccommodationCard from './AccommodationCard';
import Button from './Button';

const API_ENDPOINT = 'https://gothailand-api.onrender.com/api/accommodations';

export default function AccommodationDemo() {
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(API_ENDPOINT, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (!ignore) {
          setAccommodation(Array.isArray(data) && data.length > 0 ? data[0] : null);
          setError(null);
        }
      } catch (err) {
        if (!ignore && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch accommodation');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 pb-16 font-sans">
      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col md:flex-row gap-6 animate-pulse">
          <div className="md:w-[380px] h-64 md:h-80 bg-slate-200 rounded-2xl shrink-0" />
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
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl text-center space-y-3">
          <p className="font-semibold text-lg">Unable to load accommodation</p>
          <p className="text-sm text-red-600">{error}</p>
          <Button variant="primary" onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      )}

      {/* Single Accommodation Card */}
      {!loading && !error && accommodation && (
        <AccommodationCard accommodation={accommodation} />
      )}
    </section>
  );
}
