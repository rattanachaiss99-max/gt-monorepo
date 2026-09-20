import { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

/**
 * CartDrawer Component (Slide-over Travel Cart)
 * -------------------------------------------------------------
 * สไลด์โอเวอร์ตะกร้าท่องเที่ยวส่วนกลาง รองรับทั้ง 3 บริการ:
 * 1. CREATE: แสดงรายการที่เพิ่งเพิ่ม พร้อม badge ประเภท
 * 2. UPDATE: ปุ่ม [+] [-] ปรับจำนวน และคำนวณราคารวมทันที
 * 3. DELETE: ปุ่ม [🗑️] ลบรายชิ้น หรือปุ่ม Clear Cart ทั้งหมด
 */
export default function CartDrawer() {
  const {
    items,
    totalItemsCount,
    subtotal,
    grandTotal,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    toastMessage,
    dismissToast,
  } = useCart();

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const drawerRef = useRef(null);

  // ปิด Drawer เมื่อกดปุ่ม Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // ป้องกันการ scroll ของหน้าพื้นหลังเมื่อเปิด Drawer
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const getServiceBadge = (type) => {
    switch (type) {
      case 'accommodation':
        return {
          icon: '🏨',
          label: 'ที่พัก',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'car':
        return {
          icon: '🚗',
          label: 'รถเช่า',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'guide':
        return {
          icon: '🧭',
          label: 'ไกด์นำเที่ยว',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      default:
        return {
          icon: '🌟',
          label: 'บริการ',
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
        };
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      const confirmLogin = window.confirm(
        '💡 คุณยังไม่ได้เข้าสู่ระบบ\n\n' +
        'กรุณาเข้าสู่ระบบก่อนดำเนินการยืนยันการจองทริป เพื่อบันทึกประวัติการจองและรับเอกสารยืนยัน\n' +
        '(รายการสินค้าในตะกร้าของคุณจะยังคงอยู่ ไม่สูญหาย)\n\n' +
        'กด "ตกลง" เพื่อไปยังหน้าเข้าสู่ระบบทันที'
      );
      if (confirmLogin) {
        closeDrawer();
        navigate('/login?redirect=cart');
      }
      return;
    }

    const customerName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.name || user.email);
    const roleBadge = user.role === 'admin' ? '👑 ผู้ดูแลระบบ (Admin)' : '👤 สมาชิก (Customer)';

    alert(
      `🎉 ขอบคุณ คุณ ${customerName} ที่ร่วมเดินทางกับ Go Thailand!\n\n` +
      `📋 สรุปรายการจองทริป:\n` +
      `• ผู้จอง: ${customerName} (${user.email})\n` +
      `• สถานะบัญชี: ${roleBadge}\n` +
      `• รายการบริการ: ${totalItemsCount} รายการ\n` +
      `• ยอดชำระรวม: ฿${grandTotal.toLocaleString()}\n\n` +
      `✅ บันทึกการจองสำเร็จ! เจ้าหน้าที่จะส่งรายละเอียดและ Voucher ไปยัง ${user.email} เรียบร้อยแล้ว`
    );

    clearCart();
    closeDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop สีมืด */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* แผง Drawer Slide-over จากฝั่งขวา */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          ref={drawerRef}
          aria-label="ตะกร้าท่องเที่ยว"
          className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left"
        >
          {/* ส่วนหัว Drawer Header */}
          <div className="px-5 py-4 bg-[#0a192f] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🛒</span>
              <div>
                <h2 className="font-serif text-lg font-bold text-white leading-tight">
                  ตะกร้าท่องเที่ยว (My Trip Cart)
                </h2>
                <p className="text-xs text-amber-400 font-medium">
                  {totalItemsCount} รายการในทริปของคุณ
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-lg leading-none"
              title="ปิดตะกร้า"
              aria-label="ปิดตะกร้า"
            >
              ✕
            </button>
          </div>

          {/* แถบแจ้งเตือน Toast Message ภายใน Drawer */}
          {toastMessage && (
            <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 font-medium animate-fade-in">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>{toastMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={dismissToast}
                className="text-slate-400 hover:text-slate-600 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* รายการสินค้าในตะกร้า (Scrollable Content Area) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              // กรณีตะกร้าว่างเปล่า (Empty State)
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl mb-4 shadow-inner">
                  🛒
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-800 mb-1">
                  ยังไม่มีรายการในตะกร้าของคุณ
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs mb-6">
                  เลือกที่พักท่องเที่ยว รถเช่า หรือไกด์นำเที่ยวที่คุณชื่นชอบ แล้วกด &quot;เพิ่มลงตะกร้า&quot; ได้ทันที
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
                  <NavLink
                    to="/accommodations"
                    onClick={closeDrawer}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors text-center"
                  >
                    🏨 ค้นหาที่พัก
                  </NavLink>
                  <NavLink
                    to="/cars"
                    onClick={closeDrawer}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors text-center"
                  >
                    🚗 จองรถเช่า
                  </NavLink>
                  <NavLink
                    to="/guides"
                    onClick={closeDrawer}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors text-center"
                  >
                    🧭 หาไกด์นำเที่ยว
                  </NavLink>
                </div>
              </div>
            ) : (
              // รายการสินค้าที่มีในตะกร้า
              items.map((item) => {
                const badge = getServiceBadge(item.type);
                const durationLabel =
                  item.type === 'accommodation'
                    ? `${item.dates?.durationDays || 1} คืน`
                    : item.type === 'car'
                    ? `${item.dates?.durationDays || 1} วัน`
                    : item.details?.duration || `${item.dates?.durationDays || 1} วัน`;

                return (
                  <div
                    key={item.cartItemId}
                    className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-shadow relative group"
                  >
                    <div className="flex items-start gap-3">
                      {/* รูปภาพสินค้า */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            {badge.icon}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      {/* ข้อมูลรายละเอียด */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900 truncate">
                            {item.title}
                          </h4>
                          {/* ปุ่ม DELETE Item in Cart */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer shrink-0"
                            title="ลบรายการนี้"
                            aria-label={`ลบ ${item.title}`}
                          >
                            🗑️
                          </button>
                        </div>

                        {item.subtitle && (
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {item.subtitle}
                          </p>
                        )}

                        {item.location && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                            <span>📍</span>
                            <span>{item.location}</span>
                          </p>
                        )}

                        {/* วันที่และระยะเวลา */}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                          {item.dates?.startDate && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              📅 {item.dates.startDate}
                              {item.dates.endDate ? ` - ${item.dates.endDate}` : ''}
                            </span>
                          )}
                          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                            ⏱️ {durationLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* แถบราคาและปุ่ม UPDATE Quantity Stepper */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {/* ปุ่มปรับจำนวน (UPDATE Item in Cart) */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.type === 'accommodation' ? 'ห้อง:' : item.type === 'car' ? 'คัน:' : 'ไกด์:'}
                        </span>
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:bg-slate-300 font-bold transition-colors cursor-pointer text-sm"
                            title="ลดจำนวน"
                            aria-label="ลดจำนวน"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:bg-slate-300 font-bold transition-colors cursor-pointer text-sm"
                            title="เพิ่มจำนวน"
                            aria-label="เพิ่มจำนวน"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* ยอดรวมแต่ละชิ้น (Item Total) */}
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">
                          ฿{item.unitPrice?.toLocaleString()} {item.priceUnitLabel}
                        </div>
                        <div className="font-serif text-base font-bold text-slate-900">
                          ฿{item.itemTotal?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ส่วนท้าย Drawer Footer (Checkout Summary & Actions) */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>ยอดรวมย่อย ({totalItemsCount} รายการ):</span>
                  <span className="font-semibold text-slate-800">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>ภาษีและค่าบริการ (รวมภาษีมูลค่าเพิ่ม):</span>
                  <span className="text-emerald-700 font-medium">รวมอยู่ในราคาแล้ว</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span className="font-serif text-base">ยอดชำระทั้งสิ้น:</span>
                  <span className="font-serif text-xl sm:text-2xl text-[#0a192f] text-amber-600">
                    ฿{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* สถานะการเข้าสู่ระบบสำหรับการ Checkout */}
              {isAuthenticated ? (
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#0a192f] text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {user?.firstName ? user.firstName.charAt(0).toUpperCase() : '👤'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        จองในนาม: {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {user?.email} • {user?.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0 border border-emerald-200">
                    พร้อมจอง
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">💡</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-amber-900">ยังไม่ได้เข้าสู่ระบบ</p>
                      <p className="text-[10px] text-amber-700">เข้าสู่ระบบเพื่อบันทึกประวัติการจอง</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      navigate('/login?redirect=cart');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-[#0a192f] text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              )}

              {/* ปุ่มดำเนินการหลัก */}
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleCheckout}
                  className="w-full justify-center py-3 font-bold text-sm sm:text-base rounded-xl shadow-md cursor-pointer"
                >
                  <span>ยืนยันการจองทริป</span>
                  <span>→</span>
                </Button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer underline transition-colors"
                  >
                    ล้างตะกร้าทั้งหมด (Clear Cart)
                  </button>

                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer transition-colors"
                  >
                    เลือกดูบริการต่อ →
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
