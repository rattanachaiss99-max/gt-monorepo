import reactLogo from "../../assets/react.svg";
import viteLogo from "../../assets/vite.svg";

export default function Header({ count, onIncrement, onRefresh, loading }) {
  return (
    <header className="flex flex-col items-center text-center space-y-4 pt-4">
      {/* Logos */}
      <div className="flex items-center gap-6">
        <a
          href="https://vite.dev"
          target="_blank"
          rel="noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
        </a>
        <span className="text-2xl text-slate-300 font-bold">+</span>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
          className="hover:scale-110 transition-transform"
        >
          <img
            src={reactLogo}
            className="h-16 w-16 animate-spin [animation-duration:10s]"
            alt="React logo"
          />
        </a>
        <span className="text-2xl text-slate-300 font-bold">+</span>
        <span className="text-4xl filter drop-shadow-sm">🍃</span>
      </div>

      {/* Title & Description */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Vite + React + Tailwind CSS
      </h1>
      <p className="text-slate-600 text-sm max-w-xl">
        Go Thailand (Sprint 3) — ทดสอบดึงข้อมูลแผนที่ SVG จาก{" "}
        <strong>MongoDB Atlas</strong> ผ่าน Express REST API
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onIncrement}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          count is {count}
        </button>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>
            {loading
              ? "⏳ กำลังดึงข้อมูล..."
              : "🔄 ดึงข้อมูลจาก MongoDB อีกครั้ง"}
          </span>
        </button>
      </div>
    </header>
  );
}
