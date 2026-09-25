/**
 * bookingService.js
 * -------------------------------------------------------------
 * จัดการข้อมูลการจอง (Bookings) ของระบบ GoThailand
 *
 * สถาปัตยกรรม Dual-mode (Backend First with LocalStorage Fallback):
 * 1. พยายามเรียก API /bookings ของ Yok Backend (yokApi)
 * 2. ซิงค์และสำรองข้อมูลลง localStorage เสมอ เพื่อให้การทำงานต่อเนื่องแม้ Backend กำลังพัฒนา
 *    หรือเมื่อผู้ใช้ไม่มีการเชื่อมต่อเครือข่าย
 */
import { yokApi } from './api';

const STORAGE_KEY = 'gt_user_bookings';

/**
 * ดึงรายการการจองทั้งหมดที่บันทึกไว้ใน localStorage
 */
export function getLocalBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('⚠️ ไม่สามารถอ่านข้อมูล bookings จาก localStorage:', err);
    return [];
  }
}

/**
 * บันทึกรายการลง localStorage
 */
function setLocalBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.warn('⚠️ ไม่สามารถเขียนข้อมูล bookings ลง localStorage:', err);
  }
}

/**
 * บันทึกคำสั่งจองใหม่ (Save New Booking)
 * @param {Object} bookingData - ข้อมูลการจองครบถ้วน
 * @returns {Promise<Object>} ข้อมูลการจองที่บันทึกแล้ว
 */
export async function saveBooking(bookingData) {
  const newBooking = {
    id: bookingData.bookingRef || `GT-BK-${Date.now()}`,
    bookingRef: bookingData.bookingRef || `GT-BK-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    paymentStatus: 'paid',
    ...bookingData,
  };

  // 1. สำรองข้อมูลลง LocalStorage ทันที
  const currentBookings = getLocalBookings();
  const updatedBookings = [newBooking, ...currentBookings];
  setLocalBookings(updatedBookings);

  // 2. พยายามส่งไปยัง Backend API (Yok Core /bookings)
  try {
    const response = await yokApi.post('/bookings', newBooking, {
      timeout: 5000,
    });
    if (response?.data) {
      console.log('✅ [Booking API] บันทึกลง Backend สำเร็จ:', response.data);
      const serverBooking = response.data.booking || response.data;
      const mergedBooking = {
        ...newBooking,
        ...serverBooking,
        _id: serverBooking?._id || newBooking.id,
        id: serverBooking?._id || serverBooking?.id || newBooking.id,
        bookingReferenceId: response.data.bookingReferenceId || serverBooking?.bookingReferenceId || newBooking.bookingRef,
      };

      // ซิงก์ข้อมูลที่มี MongoDB _id อัปเดตกลับเข้า LocalStorage
      const syncedBookings = [
        mergedBooking,
        ...currentBookings.filter((b) => (b.bookingRef || b.id) !== newBooking.bookingRef),
      ];
      setLocalBookings(syncedBookings);

      return mergedBooking;
    }
  } catch (apiErr) {
    // หาก Backend ยังไม่พร้อมหรือส่งกลับ 404/500 ให้ทำงานต่อด้วย LocalStorage
    console.warn('⚠️ [Booking Service] บันทึก Backend ไม่สำเร็จ (ทำงานต่อด้วย LocalStorage):', apiErr.response?.data?.message || apiErr.message);
  }

  return newBooking;
}

/**
 * ดึงประวัติการจองของผู้ใช้ปัจจุบัน (ดึงตาม email หรือ userId)
 * @param {string} userIdentifier - email หรือ user id ของผู้ใช้
 * @returns {Promise<Array>} รายการการจอง
 */
export async function getUserBookings(userIdentifier) {
  let apiBookings = null;

  // 1. พยายามดึงจาก Backend API
  try {
    const response = await yokApi.get('/bookings', {
      params: {
        userId: userIdentifier,
        user: userIdentifier,
        email: userIdentifier,
      },
      timeout: 5000,
    });
    if (Array.isArray(response?.data)) {
      apiBookings = response.data;
    }
  } catch (apiErr) {
    console.info('ℹ️ [Booking Service] ดึงจาก LocalStorage แทน:', apiErr.message);
  }

  // 2. ถ้าได้ข้อมูลจาก API ให้นำมาผสานกับ LocalStorage
  const localList = getLocalBookings();

  if (apiBookings && apiBookings.length > 0) {
    if (!userIdentifier) return apiBookings;
    const cleanIdent = String(userIdentifier).toLowerCase();
    const filtered = apiBookings.filter((b) => {
      const bEmail = String(b.traveler?.email || b.userEmail || '').toLowerCase();
      const bUserId = String(b.userId?._id || b.userId || '').toLowerCase();
      return bEmail === cleanIdent || bUserId === cleanIdent;
    });
    return filtered.length > 0 ? filtered : apiBookings;
  }

  // กรองจาก LocalStorage ตาม email หรือ userId
  if (!userIdentifier) return localList;

  const cleanIdent = String(userIdentifier).toLowerCase();
  return localList.filter((b) => {
    const bEmail = String(b.traveler?.email || b.userEmail || '').toLowerCase();
    const bUserId = String(b.userId?._id || b.userId || '').toLowerCase();
    return bEmail === cleanIdent || bUserId === cleanIdent;
  });
}

/**
 * ค้นหาข้อมูลการจองด้วย Booking Reference ID
 * @param {string} bookingRef - รหัสอ้างอิง เช่น GT-CR-2026-00123
 */
export async function getBookingByRef(bookingRef) {
  const localList = getLocalBookings();
  const found = localList.find((b) => b.bookingRef === bookingRef);
  if (found) return found;

  try {
    const response = await yokApi.get(`/bookings/${bookingRef}`, { timeout: 4000 });
    return response.data;
  } catch {
    return null;
  }
}

/**
 * ยกเลิกการจอง (Cancel Booking)
 * @param {string} bookingRef
 */
export async function cancelBooking(bookingRef) {
  const localList = getLocalBookings();
  const updated = localList.map((b) =>
    b.bookingRef === bookingRef ? { ...b, status: 'cancelled' } : b
  );
  setLocalBookings(updated);

  try {
    await yokApi.patch(`/bookings/${bookingRef}`, { status: 'cancelled' });
  } catch (err) {
    console.warn('⚠️ ไม่สามารถส่งสถานะยกเลิกไปยัง API:', err.message);
  }

  return true;
}

export default {
  saveBooking,
  getUserBookings,
  getBookingByRef,
  cancelBooking,
  getLocalBookings,
};
