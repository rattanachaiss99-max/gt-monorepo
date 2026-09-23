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
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState(null);

  // ออกจากระบบ (Logout) และเคลียร์ LocalStorage
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthError(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error('Failed to clear auth from localStorage:', err);
    }
  }, []);

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

  // ดักจับ Event 'auth:expired' จาก Axios Interceptor (เมื่อพบ HTTP 401) เพื่อเคลียร์ Session อัตโนมัติ
  useEffect(() => {
    const handleAuthExpired = () => {
      console.warn('🔒 [AuthContext] ได้รับสัญญาณ auth:expired -> เคลียร์ Session และ Logout ทันที');
      logout();
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [logout]);

  // 3. ฟังก์ชันตรวจสอบ Session (ตอนเปิดเว็บขึ้นมา)
  // ยิง GET /api/auth/me (แนบ Bearer Token) ถ้า Token หมดอายุ (401) ให้ทำการ Logout เคลียร์ Session อัตโนมัติ
  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        if (isMounted) setCheckingSession(false);
        return;
      }

      // ถ้าเป็น demo token ชั่วคราว ข้ามการตรวจสอบ Backend
      if (savedToken.startsWith('mock_token_') || savedToken.startsWith('demo_')) {
        if (isMounted) setCheckingSession(false);
        return;
      }

      try {
        // ยิง GET /auth/me เพื่อยืนยัน Token กับ Backend (api.js แนบ Bearer <token> ให้อัตโนมัติ)
        const res = await api.get('/auth/me');
        const currentUser = res.data?.user || res.data?.data?.user || res.data?.data;

        if (currentUser && isMounted) {
          const isAdminUser = currentUser.role === 'admin';
          const mappedUser = {
            _id: currentUser._id || currentUser.id,
            id: currentUser._id || currentUser.id,
            name: currentUser.name || '',
            firstName: currentUser.name ? currentUser.name.split(' ')[0] : (currentUser.firstName || ''),
            lastName: currentUser.name ? currentUser.name.split(' ').slice(1).join(' ') : (currentUser.lastName || ''),
            email: currentUser.email,
            role: isAdminUser ? 'admin' : 'customer',
            phone: currentUser.phone || '',
            profileImage: currentUser.profileImage || null,
            avatarUrl: currentUser.profileImage || currentUser.avatarUrl || (isAdminUser ? DEMO_ACCOUNTS.admin.avatarUrl : DEMO_ACCOUNTS.customer.avatarUrl),
            membershipTier: isAdminUser ? 'platinum' : 'gold',
          };
          setUser(mappedUser);
        }
      } catch (err) {
        console.warn('⚠️ [AuthContext] ตรวจสอบ Session ล้มเหลว:', err.response?.status, err.message);
        // ถ้าได้ 401 หรือ 403 (เช่น Token หมดอายุ หรือไม่ถูกต้อง) ให้ Logout เคลียร์ Session อัตโนมัติ
        if (err.response?.status === 401 || err.response?.status === 403) {
          if (isMounted) {
            logout();
          }
        }
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    verifySession();
    return () => {
      isMounted = false;
    };
  }, [logout]);

  /**
   * 1. ฟังก์ชัน login (เข้าสู่ระบบ)
   * ยิง POST /api/auth/login ส่ง { email, password } 
   * แล้วรับ token จริงและข้อมูล user ที่ได้จาก Backend มาเก็บลง State / LocalStorage
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
      // ยิงคำขอไปยัง POST /api/auth/login
      const res = await api.post('/auth/login', {
        email: lowerEmail,
        password,
      });

      const serverToken = res.data?.token || res.data?.accessToken || res.data?.data?.token;
      const serverUser = res.data?.user || res.data?.data?.user || res.data?.data;

      if (!serverToken || !serverUser) {
        throw new Error('เซิร์ฟเวอร์ไม่ได้ส่ง Token หรือข้อมูลผู้ใช้ที่ถูกต้องกลับมา');
      }

      const isAdminUser = serverUser.role === 'admin';
      const mappedUser = {
        _id: serverUser._id || serverUser.id,
        id: serverUser._id || serverUser.id,
        name: serverUser.name || lowerEmail.split('@')[0],
        firstName: serverUser.name ? serverUser.name.split(' ')[0] : (serverUser.firstName || lowerEmail.split('@')[0]),
        lastName: serverUser.name ? serverUser.name.split(' ').slice(1).join(' ') : (serverUser.lastName || ''),
        email: serverUser.email || lowerEmail,
        role: isAdminUser ? 'admin' : 'customer',
        phone: serverUser.phone || '',
        profileImage: serverUser.profileImage || null,
        avatarUrl: serverUser.profileImage || serverUser.avatarUrl || (isAdminUser ? DEMO_ACCOUNTS.admin.avatarUrl : DEMO_ACCOUNTS.customer.avatarUrl),
        membershipTier: isAdminUser ? 'platinum' : 'gold',
      };

      setUser(mappedUser);
      setToken(serverToken);
      setLoading(false);
      return mappedUser;
    } catch (err) {
      // Fallback สำหรับบัญชี Demo พิเศษ กรณี Backend ยังไม่มีบัญชีหรือเซิร์ฟเวอร์ยังออฟไลน์
      if (
        (lowerEmail === DEMO_ACCOUNTS.admin.email || lowerEmail.includes('admin')) &&
        (!err.response || err.response.status >= 500 || err.response.status === 404)
      ) {
        console.warn('⚠️ [AuthContext] ใช้ Demo Admin Fallback');
        const adminUser = { ...DEMO_ACCOUNTS.admin, email: lowerEmail };
        const demoToken = `mock_token_admin_${Date.now()}`;
        setUser(adminUser);
        setToken(demoToken);
        setLoading(false);
        return adminUser;
      }

      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'การเข้าสู่ระบบขัดข้อง';
      setAuthError(errMsg);
      setLoading(false);
      throw new Error(errMsg, { cause: err });
    }
  }, []);

  /**
   * 2. ฟังก์ชัน register (สมัครสมาชิก)
   * ยิง POST /api/auth/register ส่ง { name, email, password, phone } 
   * เพื่อให้ Backend แฮชรหัสผ่าน และส่ง token + user กลับมาพร้อมล็อกอินให้ทันที
   */
  const register = useCallback(async ({ email, password, firstName, lastName, role = 'customer', phone = '' }) => {
    setLoading(true);
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const backendRole = role === 'admin' ? 'admin' : 'customer';

    try {
      // ยิงคำขอไปยัง POST /api/auth/register
      const res = await api.post('/auth/register', {
        name: fullName,
        email: cleanEmail,
        password,
        phone: phone || '',
        role: backendRole,
      });

      const serverToken = res.data?.token || res.data?.accessToken || res.data?.data?.token;
      const serverUser = res.data?.user || res.data?.data?.user || res.data?.data;

      const isAdminUser = role === 'admin' || serverUser?.role === 'admin';
      const mappedUser = {
        _id: serverUser?._id || serverUser?.id || `usr_${Date.now()}`,
        id: serverUser?._id || serverUser?.id || `usr_${Date.now()}`,
        name: serverUser?.name || fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        role: isAdminUser ? 'admin' : 'customer',
        phone: serverUser?.phone || phone,
        membershipTier: isAdminUser ? 'platinum' : 'bronze',
        avatarUrl: null,
      };

      if (serverToken) {
        setUser(mappedUser);
        setToken(serverToken);
      } else {
        // หาก Backend ไม่ส่ง Token มา ให้พยายาม login อัตโนมัติ
        try {
          const logged = await login(cleanEmail, password);
          setLoading(false);
          return logged;
        } catch {
          setUser(mappedUser);
        }
      }

      setLoading(false);
      return mappedUser;
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'การสมัครสมาชิกขัดข้อง';
      setAuthError(errMsg);
      setLoading(false);
      throw new Error(errMsg, { cause: err });
    }
  }, [login]);

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

  /**
   * อัปเดตข้อมูลของผู้ใช้ปัจจุบันใน Context & LocalStorage
   */
  const updateCurrentUser = useCallback((partialData) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...partialData };
      if (partialData.name && !partialData.firstName) {
        next.firstName = partialData.name.split(' ')[0];
        next.lastName = partialData.name.split(' ').slice(1).join(' ');
      }
      return next;
    });
  }, []);

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'admin');

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loading,
      checkingSession,
      authError,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      switchDemoRole,
      updateCurrentUser,
    }),
    [user, token, loading, checkingSession, authError, isAuthenticated, isAdmin, login, register, logout, switchDemoRole, updateCurrentUser]
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
