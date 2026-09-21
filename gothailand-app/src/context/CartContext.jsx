/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CART_STORAGE_KEY = 'gothailand_travel_cart_v1';

const CartContext = createContext(null);

/**
 * โหลดข้อมูลตะกร้าเริ่มต้นจาก LocalStorage
 */
function getInitialCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return [];
}

/**
 * คำนวณยอดรวมของแต่ละรายการ (Item Total)
 * itemTotal = unitPrice * quantity * (durationDays || 1)
 */
function calculateItemTotal(unitPrice, quantity, durationDays) {
  const price = Number(unitPrice) || 0;
  const qty = Math.max(1, Number(quantity) || 1);
  const days = Math.max(1, Number(durationDays) || 1);
  return price * qty * days;
}

/**
 * CartProvider
 * -------------------------------------------------------------
 * ศูนย์กลางจัดการสถานะตะกร้าสินค้าส่วนกลาง (Universal Travel Cart)
 * รองรับทั้ง 3 บริการ: Accommodations (ที่พัก), Cars (รถเช่า), Guides (ไกด์)
 * ครอบคลุม CRUD Operations:
 * 1. CREATE: addToCart(itemPayload)
 * 2. UPDATE: updateQuantity(cartItemId, newQty), updateDates(cartItemId, newDates)
 * 3. DELETE: removeFromCart(cartItemId), clearCart()
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(getInitialCart);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // ซิงก์ข้อมูลลง LocalStorage อัตโนมัติเมื่อตะกร้ามีการเปลี่ยนแปลง
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  // ซ่อน Toast แจ้งเตือนหลัง 3 วินาที
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // --- 1. [Cart] CREATE Item in Cart ---
  const addToCart = useCallback((payload, options = { openDrawer: false }) => {
    const {
      type, // 'accommodation' | 'car' | 'guide'
      itemId,
      title,
      subtitle = '',
      image = '',
      location = '',
      unitPrice = 0,
      priceUnitLabel = '/ วัน',
      quantity = 1,
      dates = {},
      details = {},
    } = payload;

    const durationDays = Math.max(1, Number(dates?.durationDays) || 1);
    const itemQty = Math.max(1, Number(quantity) || 1);
    const parsedPrice = Number(unitPrice) || 0;

    setItems((prevItems) => {
      // ตรวจสอบว่ามีรายการชนิดเดียวกันและวันเดินทางเดียวกันอยู่แล้วหรือไม่
      const existingIndex = prevItems.findIndex(
        (i) =>
          i.type === type &&
          i.itemId === itemId &&
          i.dates?.startDate === dates?.startDate &&
          i.dates?.endDate === dates?.endDate &&
          // สำหรับที่พัก: เช็ค roomName ซ้ำ
          (type !== 'accommodation' || i.details?.roomName === details?.roomName) &&
          // สำหรับรถ: เช็ค pickupLocation ซ้ำ
          (type !== 'car' || i.details?.pickupLocation === details?.pickupLocation) &&
          // สำหรับไกด์: เช็ค duration ซ้ำ
          (type !== 'guide' || i.details?.duration === details?.duration)
      );

      if (existingIndex > -1) {
        // อัปเดตเพิ่มจำนวน (Quantity) รายการเดิม
        const updated = [...prevItems];
        const existingItem = updated[existingIndex];
        const newQty = existingItem.quantity + itemQty;
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty,
          itemTotal: calculateItemTotal(existingItem.unitPrice, newQty, existingItem.dates?.durationDays),
        };
        return updated;
      }

      // สร้าง Cart Item ใหม่
      const newCartItem = {
        cartItemId: `${type}_${itemId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type,
        itemId,
        title: title || 'รายการท่องเที่ยว',
        subtitle,
        image,
        location,
        unitPrice: parsedPrice,
        priceUnitLabel,
        quantity: itemQty,
        dates: {
          startDate: dates?.startDate || '',
          endDate: dates?.endDate || '',
          durationDays,
        },
        details,
        itemTotal: calculateItemTotal(parsedPrice, itemQty, durationDays),
        createdAt: Date.now(),
      };

      return [newCartItem, ...prevItems];
    });

    setToastMessage({
      type: 'success',
      text: `เพิ่ม "${title}" ลงในตะกร้าเรียบร้อยแล้ว`,
      title,
    });

    if (options?.openDrawer) {
      setIsDrawerOpen(true);
    }
  }, []);

  // --- 3. [Cart] DELETE Item in Cart ---
  // ลบรายการเดี่ยว
  const removeFromCart = useCallback((cartItemId) => {
    setItems((prevItems) => {
      const target = prevItems.find((i) => i.cartItemId === cartItemId);
      if (target) {
        setToastMessage({
          type: 'info',
          text: `ลบ "${target.title}" ออกจากตะกร้าแล้ว`,
          title: target.title,
        });
      }
      return prevItems.filter((item) => item.cartItemId !== cartItemId);
    });
  }, []);

  // ล้างตะกร้าทั้งหมด
  const clearCart = useCallback(() => {
    setItems([]);
    setToastMessage({
      type: 'info',
      text: 'ล้างรายการในตะกร้าทั้งหมดเรียบร้อยแล้ว',
    });
  }, []);

  // --- 2. [Cart] UPDATE Item in Cart ---
  // ปรับเปลี่ยนจำนวน (Quantity)
  const updateQuantity = useCallback((cartItemId, newQuantity) => {
    const qty = Number(newQuantity);
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        return {
          ...item,
          quantity: qty,
          itemTotal: calculateItemTotal(item.unitPrice, qty, item.dates?.durationDays),
        };
      })
    );
  }, [removeFromCart]);

  // ปรับเปลี่ยนช่วงวันเดินทาง (Dates)
  const updateDates = useCallback((cartItemId, newStartDate, newEndDate, newDurationDays) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const durationDays = Math.max(1, Number(newDurationDays) || 1);
        return {
          ...item,
          dates: {
            startDate: newStartDate,
            endDate: newEndDate,
            durationDays,
          },
          itemTotal: calculateItemTotal(item.unitPrice, item.quantity, durationDays),
        };
      })
    );
  }, []);

  // Drawer Controls
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  // คำนวณสรุปยอด (Summary Calculations)
  const { totalItemsCount, subtotal, grandTotal, itemsByType } = useMemo(() => {
    let count = 0;
    let sum = 0;
    const byType = {
      accommodation: [],
      car: [],
      guide: [],
    };

    items.forEach((item) => {
      count += item.quantity || 1;
      sum += item.itemTotal || 0;
      if (byType[item.type]) {
        byType[item.type].push(item);
      }
    });

    return {
      totalItemsCount: count,
      subtotal: sum,
      grandTotal: sum,
      itemsByType: byType,
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      totalItemsCount,
      subtotal,
      grandTotal,
      itemsByType,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addToCart,
      updateQuantity,
      updateDates,
      removeFromCart,
      clearCart,
      toastMessage,
      dismissToast: () => setToastMessage(null),
    }),
    [
      items,
      totalItemsCount,
      subtotal,
      grandTotal,
      itemsByType,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addToCart,
      updateQuantity,
      updateDates,
      removeFromCart,
      clearCart,
      toastMessage,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Custom hook สำหรับเรียกใช้งานระบบตะกร้าในทุก Component
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
