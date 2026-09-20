import { useCart } from '../../context/CartContext';

/**
 * CartNavbarButton
 * -------------------------------------------------------------
 * ปุ่มไอคอนตะกร้าสินค้าบน Header / Navigation Bar ส่วนกลาง
 * แสดง Badge ตัวเลขนับจำนวนสินค้าในตะกร้าแบบ Real-time
 * เมื่อคลิกจะทำการสลับเปิด-ปิด Slide-over Cart Drawer
 */
export default function CartNavbarButton() {
  const { totalItemsCount, toggleDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={toggleDrawer}
      className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all duration-200 flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-slate-200"
      aria-label={`ตะกร้าท่องเที่ยว (${totalItemsCount} รายการ)`}
      title="ดูตะกร้าท่องเที่ยวของคุณ"
    >
      <span className="text-xl leading-none">🛒</span>
      <span className="hidden md:inline-block text-xs font-bold text-slate-700">
        ตะกร้า
      </span>

      {totalItemsCount > 0 && (
        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black text-slate-950 bg-amber-400 border border-amber-300 rounded-full shadow-xs animate-scale-in">
          {totalItemsCount > 99 ? '99+' : totalItemsCount}
        </span>
      )}
    </button>
  );
}
