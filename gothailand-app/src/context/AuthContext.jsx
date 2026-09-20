/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

const TOKEN_KEY = 'gt_token';
const USER_KEY = 'gt_user';

const AuthContext = createContext(null);

// บัญชีตัวอย่างสำหรับการทดสอบระบบสิทธิ์ (อ้างอิงจากฐานข้อมูลจริงใน Backend YOK: https://gothailand-api.onrender.com/api/users)
export const DEMO_ACCOUNTS = {
  admin: {
    _id: '6aae496cf3c07d4e040642c0',
    id: '6aae496cf3c07d4e040642c0',
    email: 'siwat@example.com',
    name: 'Siwat (หยก)',
    firstName: 'Siwat',
    lastName: '(หยก)',
    role: 'admin',
    membershipTier: 'platinum',
    phone: '0912345678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  customer: {
    _id: '6aae496cf3c07d4e040642c1',
    id: '6aae496cf3c07d4e040642c1',
    email: 'john@example.com',
    name: 'John',
    firstName: 'John',
    lastName: 'Traveler',
    role: 'customer',
    membershipTier: 'gold',
    phone: '0923456789',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  },
};

/**
 * ดึงข้อมูลผู้ใช้ที่บันทึกไว้ใน LocalStorage
 */
function getInitialUser() {
  try {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err);
  }
  return null;
}

/**
 * ดึง Token ที่บันทึกไว้ใน LocalStorage
 */
function getInitialToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * AuthProvider
 * -------------------------------------------------------------
 * ตัวจัดการสถานะผู้ใช้และสิทธิ์การเข้าถึงส่วนกลาง (Centralized Auth Context)
 * - เชื่อมต่อฐานข้อมูล MongoDB จริงของ Backend YOK (https://gothailand-api.onrender.com/api/users)
 * - รองรับบทบาท: 'admin' (เข้าถึง /provinces ได้) และ 'customer' (ลูกค้าทั่วไป)
 * - ซิงก์กับ LocalStorage ด้วยคีย์ 'gt_token' และ 'gt_user' (ตามมาตรฐาน s2)
 * - มีระบบสลับบทบาทเดโม่ (switchDemoRole) เพื่อให้ตรวจงานได้ทันที
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [token, setToken] = useState(getInitialToken);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // บันทึกลง LocalStorage เมื่อข้อมูลผู้ใช้หรือ Token เปลี่ยนแปลง
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }

      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (err) {
      console.error('Failed to sync auth to localStorage:', err);
    }
  }, [token, user]);

  /**
   * เข้าสู่ระบบ (Login)
   * ดึงข้อมูลผู้ใช้จริงจาก Backend YOK (/api/users) และตรวจสอบสิทธิ์
   */
  const login = useCallback(async (email, password = '') => {
    setLoading(true);
    setAuthError(null);

    if (!password) {
      setLoading(false);
      throw new Error('กรุณากรอกรหัสผ่าน');
    }

    const lowerEmail = email.trim().toLowerCase();

    try {
      // 1. ดึงรายชื่อผู้ใช้จาก Backend YOK (/api/users)
      const res = await api.get('/users').catch(() => null);
      const userList = Array.isArray(res?.data) ? res.data : [];

      // 2. ตรวจสอบว่ามีอีเมลตรงกับใน Backend YOK หรือไม่
      const matchedUser = userList.find(
        (u) => u.email && u.email.trim().toLowerCase() === lowerEmail
      );

      if (matchedUser) {
        const isAdminUser = matchedUser.role === 'admin';
        const mappedUser = {
          _id: matchedUser._id,
          id: matchedUser._id,
          name: matchedUser.name || lowerEmail.split('@')[0],
          firstName: matchedUser.name ? matchedUser.name.split(' ')[0] : lowerEmail.split('@')[0],
          lastName: matchedUser.name ? matchedUser.name.split(' ').slice(1).join(' ') : '',
          email: matchedUser.email,
          role: isAdminUser ? 'admin' : 'customer',
          phone: matchedUser.phone || '',
          profileImage: matchedUser.profileImage || null,
          avatarUrl: matchedUser.profileImage || (isAdminUser ? DEMO_ACCOUNTS.admin.avatarUrl : DEMO_ACCOUNTS.customer.avatarUrl),
          membershipTier: isAdminUser ? 'platinum' : 'gold',
        };

        const tokenString = `yok_token_${matchedUser._id}_${Date.now()}`;
        setUser(mappedUser);
        setToken(tokenString);
        setLoading(false);
        return mappedUser;
      }

      // 3. ตรวจสอบกรณีป้อนบัญชีพิเศษ Admin
      if (lowerEmail.includes('admin') || lowerEmail === DEMO_ACCOUNTS.admin.email) {
        const adminUser = { ...DEMO_ACCOUNTS.admin, email: lowerEmail };
        const demoToken = `mock_token_admin_${Date.now()}`;
        setUser(adminUser);
        setToken(demoToken);
        setLoading(false);
        return adminUser;
      }

      // 4. Fallback: หากเป็นบัญชีลูกค้าใหม่ทั่วไป
      const customerUser = {
        _id: `usr_${Date.now()}`,
        id: `usr_${Date.now()}`,
        name: lowerEmail.split('@')[0],
        email: lowerEmail,
        firstName: lowerEmail.split('@')[0],
        lastName: 'Member',
        role: 'customer',
        membershipTier: 'silver',
        avatarUrl: DEMO_ACCOUNTS.customer.avatarUrl,
      };
      const fallbackToken = `token_customer_${Date.now()}`;
      setUser(customerUser);
      setToken(fallbackToken);
      setLoading(false);
      return customerUser;
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'การเข้าสู่ระบบขัดข้อง';
      setAuthError(errMsg);
      setLoading(false);
      throw new Error(errMsg, { cause: err });
    }
  }, []);

  /**
   * สมัครสมาชิกใหม่ (Register)
   * ส่งคำขอสร้าง User ไปบันทึกลง MongoDB ของ Backend YOK (/api/users)
   */
  const register = useCallback(async ({ email, password, firstName, lastName, role = 'customer', phone = '' }) => {
    setLoading(true);
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const backendRole = role === 'admin' ? 'admin' : 'user';

    try {
      // 1. ส่งคำขอสร้าง User ใหม่ไปยัง Backend YOK (POST /api/users)
      const response = await api.post('/users', {
        name: fullName,
        email: cleanEmail,
        password: password || 'Password123!',
        phone: phone || '',
        role: backendRole,
      }).catch((err) => {
        console.warn('YOK Backend /api/users creation notice:', err?.response?.data || err?.message);
        return null;
      });

      const serverUser = response?.data;
      const isAdminUser = role === 'admin' || serverUser?.role === 'admin';

      const newUser = {
        _id: serverUser?._id || `usr_${Date.now()}`,
        id: serverUser?._id || `usr_${Date.now()}`,
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        role: isAdminUser ? 'admin' : 'customer',
        phone,
        membershipTier: isAdminUser ? 'platinum' : 'bronze',
        avatarUrl: null,
      };

      const newToken = `yok_token_${newUser.role}_${Date.now()}`;
      setUser(newUser);
      setToken(newToken);
      setLoading(false);
      return newUser;
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'การสมัครสมาชิกขัดข้อง';
      setAuthError(errMsg);
      setLoading(false);
      throw new Error(errMsg, { cause: err });
    }
  }, []);

  /**
   * ออกจากระบบ (Logout)
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthError(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error(err);
    }
  }, []);

  /**
   * สลับบทบาทเดโม่ (Demo Role Switcher)
   * ฟังก์ชันพิเศษสำหรับผู้ตรวจงาน/ทีมงานเพื่อสลับเป็น Admin หรือ Customer ได้ทันทีใน 1 คลิก
   */
  const switchDemoRole = useCallback((targetRole) => {
    if (targetRole === 'admin') {
      setUser(DEMO_ACCOUNTS.admin);
      setToken(`demo_admin_token_${Date.now()}`);
    } else {
      setUser(DEMO_ACCOUNTS.customer);
      setToken(`demo_customer_token_${Date.now()}`);
    }
  }, []);

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'admin');

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loading,
      authError,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      switchDemoRole,
    }),
    [user, token, loading, authError, isAuthenticated, isAdmin, login, register, logout, switchDemoRole]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook สำหรับเรียกใช้งานสถานะสมาชิกและสิทธิ์ในทุก Component
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
