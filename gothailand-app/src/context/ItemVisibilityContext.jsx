/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const ItemVisibilityContext = createContext(null);

const STORAGE_KEY = 'gt_item_visibility';

/**
 * ItemVisibilityProvider
 * -------------------------------------------------------------
 * Context จัดการสถานะการเปิด/ปิดการแสดงผล (Active / Hidden) ของบริการท่องเที่ยว
 * (ที่พัก Accommodations, รถเช่า Cars, ไกด์นำเที่ยว Guides)
 * 
 * - รองรับ Admin สลับเปิด/ปิดด้วยรูปตา (Eye Icon 👁️ / 🙈)
 * - บันทึกสถานะลงใน localStorage อย่างถาวร
 * - รองรับโหมด "Admin Preview Customer View" เพื่อให้ Admin ตรวจสอบมุมมองจริงที่ลูกค้าเห็น
 */
export function ItemVisibilityProvider({ children }) {
  // เก็บ Map ของ itemId -> boolean (true = ซ่อน / hidden)
  // key รูปแบบ: `${serviceType}:${id}` เช่น "accommodations:acc-123" หรือ "cars:car-01"
  const [hiddenItemsMap, setHiddenItemsMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // โหมดจำลองมุมมองลูกค้าสำหรับ Admin (true = ซ่อนรายการที่ปิดไว้เหมือนที่ลูกค้าเห็น)
  const [adminCustomerPreview, setAdminCustomerPreview] = useState(false);

  // ซิงก์ลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenItemsMap));
    } catch (err) {
      console.error('Failed to save item visibility to localStorage:', err);
    }
  }, [hiddenItemsMap]);

  /**
   * รวบรวมคีย์ทั้งหมดที่อาจเป็นตัวแทนของบริการนี้ (เช่น _id, id, slug)
   * ป้องกันปัญหาการไม่ซิงก์กันระหว่าง route /provinces (ใช้ _id) กับ /accommodations (ใช้ id)
   */
  const extractCandidateKeys = (serviceType, itemOrId, fallbackIds = []) => {
    if (!itemOrId) return [];
    const ids = [];
    if (typeof itemOrId === 'object' && itemOrId !== null) {
      if (itemOrId.id !== undefined && itemOrId.id !== null && itemOrId.id !== '') ids.push(String(itemOrId.id));
      if (itemOrId._id !== undefined && itemOrId._id !== null && itemOrId._id !== '') ids.push(String(itemOrId._id));
      if (itemOrId.slug !== undefined && itemOrId.slug !== null && itemOrId.slug !== '') ids.push(String(itemOrId.slug));
    } else {
      ids.push(String(itemOrId));
    }
    if (Array.isArray(fallbackIds)) {
      fallbackIds.forEach((f) => {
        if (f !== undefined && f !== null && f !== '') ids.push(String(f));
      });
    } else if (fallbackIds !== undefined && fallbackIds !== null && fallbackIds !== '') {
      ids.push(String(fallbackIds));
    }
    return [...new Set(ids)].map((id) => `${serviceType}:${id}`);
  };

  /**
   * ตรวจสอบว่าบริการนี้เปิดแสดงผลต่อลูกค้าหรือไม่
   * รองรับทั้งการส่ง ID เดี่ยว, Object ของบริการ, หรืออาเรย์ของ Fallback IDs
   * @param {string} serviceType - 'accommodations' | 'cars' | 'guides'
   * @param {string|number|object} itemOrId - ID, slug หรือ Object ของบริการ
   * @param {Array<string|number>} fallbackIds - รหัสอ้างอิงสำรองเพิ่มเติม
   * @returns {boolean} true = เปิดแสดงผลปกติ, false = ถูก Admin ซ่อนไว้
   */
  const isItemVisible = useCallback((serviceType, itemOrId, fallbackIds = []) => {
    const keys = extractCandidateKeys(serviceType, itemOrId, fallbackIds);
    if (keys.length === 0) return true;
    // ถ้ามีคีย์ใดคีย์หนึ่งถูกบันทึกว่าซ่อนอยู่ ให้ถือว่ารายการนี้ถูกซ่อน
    return !keys.some((key) => Boolean(hiddenItemsMap[key]));
  }, [hiddenItemsMap]);

  /**
   * สลับเปิด/ปิดการแสดงผลด้วยรูปตา (Toggle Visibility)
   * ซิงก์คีย์ทั้งหมดของรายการพร้อมกัน (_id, id, slug) เพื่อให้มีผลร่วมกันทุก route
   */
  const toggleItemVisibility = useCallback((serviceType, itemOrId, fallbackIds = []) => {
    const keys = extractCandidateKeys(serviceType, itemOrId, fallbackIds);
    if (keys.length === 0) return;

    setHiddenItemsMap((prev) => {
      const next = { ...prev };
      const isCurrentlyHidden = keys.some((key) => Boolean(next[key]));

      keys.forEach((key) => {
        if (isCurrentlyHidden) {
          delete next[key]; // ยกเลิกการซ่อน
        } else {
          next[key] = true; // ซ่อน
        }
      });
      return next;
    });
  }, []);

  /**
   * กำหนดสถานะแสดงผลตรงๆ
   */
  const setItemVisibility = useCallback((serviceType, itemOrId, isVisible, fallbackIds = []) => {
    const keys = extractCandidateKeys(serviceType, itemOrId, fallbackIds);
    if (keys.length === 0) return;

    setHiddenItemsMap((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        if (isVisible) {
          delete next[key];
        } else {
          next[key] = true;
        }
      });
      return next;
    });
  }, []);

  /**
   * คืนค่ารายการทั้งหมดกลับมาแสดงผลปกติ (Reset All Hidden)
   */
  const resetAllVisibility = useCallback(() => {
    setHiddenItemsMap({});
  }, []);

  // จำนวนรายการที่ถูกซ่อนทั้งหมด
  const totalHiddenCount = useMemo(() => {
    return Object.keys(hiddenItemsMap).length;
  }, [hiddenItemsMap]);

  const value = useMemo(
    () => ({
      hiddenItemsMap,
      isItemVisible,
      toggleItemVisibility,
      setItemVisibility,
      resetAllVisibility,
      totalHiddenCount,
      adminCustomerPreview,
      setAdminCustomerPreview,
      toggleCustomerPreview: () => setAdminCustomerPreview((prev) => !prev),
    }),
    [
      hiddenItemsMap,
      isItemVisible,
      toggleItemVisibility,
      setItemVisibility,
      resetAllVisibility,
      totalHiddenCount,
      adminCustomerPreview,
    ]
  );

  return (
    <ItemVisibilityContext.Provider value={value}>
      {children}
    </ItemVisibilityContext.Provider>
  );
}

/**
 * Custom Hook สำหรับใช้งาน ItemVisibilityContext
 */
export function useItemVisibility() {
  const context = useContext(ItemVisibilityContext);
  if (!context) {
    throw new Error('useItemVisibility must be used within an ItemVisibilityProvider');
  }
  return context;
}

export default ItemVisibilityContext;
