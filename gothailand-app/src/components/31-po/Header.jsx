export default function Header({ onRefresh, loading }) {
  return (
    <div className="flex justify-center sm:justify-end items-center pt-2">
      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
      >
        <span>
          {loading
            ? "⏳ กำลังดึงข้อมูล..."
            : "🔄 ดึงข้อมูลจาก MongoDB อีกครั้ง"}
        </span>
      </button>
    </div>
  );
}

