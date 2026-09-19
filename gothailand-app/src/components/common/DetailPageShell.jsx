import { Link } from 'react-router-dom';
import Button from './Button';

/**
 * Shared loading/error/breadcrumb shell for *DetailPage components
 * (accommodations, cars, guides). Renders `children` once `entity` resolves.
 */
export default function DetailPageShell({
  loading,
  error,
  entity,
  loadingText,
  notFoundTitle,
  notFoundText,
  notFoundBackLabel,
  breadcrumbListPath,
  breadcrumbListLabel,
  breadcrumbBackLabel,
  onBack,
  entityName,
  children,
}) {
  if (loading) {
    return (
      <div className="bg-[#fcfbf9] min-h-[70vh] flex flex-col items-center justify-center text-slate-600 px-4">
        <div className="w-10 h-10 border-4 border-[#0a192f] border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <p className="font-serif text-lg font-bold text-slate-800">{loadingText}</p>
        <p className="text-xs text-slate-400 mt-1">กรุณารอสักครู่ ระบบกำลังดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์</p>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="bg-[#fcfbf9] min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-red-100">
          ⚠️
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">{notFoundTitle}</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          {error || notFoundText}
        </p>
        <Button
          type="button"
          onClick={onBack}
          variant="navy"
          size="none"
          className="font-semibold px-6 py-2.5 text-xs uppercase tracking-wider transition"
        >
          {notFoundBackLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* แถบ Breadcrumbs และปุ่มย้อนกลับตามสไตล์ Yok */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60">
          <nav className="text-xs tracking-wide text-slate-400 flex items-center gap-2">
            <Link to="/" className="hover:text-slate-700 transition">หน้าแรก</Link>
            <span className="text-slate-300">/</span>
            <Link to={breadcrumbListPath} className="hover:text-slate-700 transition">
              {breadcrumbListLabel}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold line-clamp-1">{entityName}</span>
          </nav>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 transition cursor-pointer"
          >
            <span>←</span>
            <span>{breadcrumbBackLabel}</span>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
