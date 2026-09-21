/**
 * userService.js
 * -------------------------------------------------------------
 * จัดการการเชื่อมต่อ API /users (CRUD ผู้ใช้) กับ Backend YOK โดยตรง
 * รองรับทั้ง GET, POST, PUT/PATCH, DELETE
 */
import { yokApi } from './api';

/**
 * ดึงรายชื่อผู้ใช้ทั้งหมด (GET /api/users)
 * @returns {Promise<Array>} รายชื่อผู้ใช้ทั้งหมด
 */
export async function getAllUsers() {
  try {
    const response = await yokApi.get('/users');
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('❌ [userService] ดึงรายชื่อ users ไม่สำเร็จ:', err.message);
    throw new Error(err?.response?.data?.message || 'ไม่สามารถดึงรายชื่อผู้ใช้จากเซิร์ฟเวอร์ได้');
  }
}

/**
 * ดึงข้อมูลผู้ใช้รายบุคคล (GET /api/users/:id)
 * @param {string} userId - ไอดีของผู้ใช้
 */
export async function getUserById(userId) {
  try {
    const response = await yokApi.get(`/users/${userId}`);
    return response.data;
  } catch (err) {
    // กรณีที่ endpoint /users/:id ไม่มี ให้ค้นหาจาก getAllUsers()
    const all = await getAllUsers().catch(() => []);
    const found = all.find((u) => u._id === userId || u.id === userId);
    if (found) return found;
    throw new Error(err?.response?.data?.message || 'ไม่พบข้อมูลผู้ใช้');
  }
}

/**
 * เพิ่มผู้ใช้ใหม่ (POST /api/users)
 * @param {Object} userData - { name, email, password, phone, role }
 */
export async function createUser(userData) {
  try {
    const payload = {
      name: userData.name?.trim(),
      email: userData.email?.trim().toLowerCase(),
      password: userData.password || 'Password123!',
      phone: userData.phone || '',
      role: userData.role || 'user',
    };

    const response = await yokApi.post('/users', payload);
    return response.data;
  } catch (err) {
    console.error('❌ [userService] สร้าง user ไม่สำเร็จ:', err.response?.data || err.message);
    throw new Error(err?.response?.data?.message || err?.response?.data?.error || 'ไม่สามารถสร้างผู้ใช้ใหม่ได้');
  }
}

/**
 * แก้ไขข้อมูลผู้ใช้ (PUT / PATCH /api/users/:id)
 * @param {string} userId - ไอดีผู้ใช้
 * @param {Object} updateData - ข้อมูลที่ต้องการแก้ไข
 */
export async function updateUser(userId, updateData) {
  const payload = { ...updateData };
  if (payload.email) payload.email = payload.email.trim().toLowerCase();
  if (payload.name) payload.name = payload.name.trim();

  // ลบ field ที่ไม่ควรส่งไปอัปเดตถ้าว่าง
  if (!payload.password) delete payload.password;

  try {
    // ลอง PUT ก่อน
    const response = await yokApi.put(`/users/${userId}`, payload);
    return response.data;
  } catch (putErr) {
    // ถ้า PUT ไม่ผ่าน ลอง PATCH
    try {
      const patchRes = await yokApi.patch(`/users/${userId}`, payload);
      return patchRes.data;
    } catch (patchErr) {
      console.error('❌ [userService] อัปเดต user ไม่สำเร็จ:', patchErr.response?.data || patchErr.message);
      throw new Error(
        patchErr?.response?.data?.message ||
        putErr?.response?.data?.message ||
        'ไม่สามารถบันทึกการแก้ไขข้อมูลผู้ใช้ได้'
      );
    }
  }
}

/**
 * ลบผู้ใช้ (DELETE /api/users/:id)
 * @param {string} userId - ไอดีผู้ใช้ที่ต้องการลบ
 */
export async function deleteUser(userId) {
  try {
    const response = await yokApi.delete(`/users/${userId}`);
    return response.data;
  } catch (err) {
    console.error('❌ [userService] ลบ user ไม่สำเร็จ:', err.response?.data || err.message);
    throw new Error(err?.response?.data?.message || 'ไม่สามารถลบผู้ใช้ได้');
  }
}

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
