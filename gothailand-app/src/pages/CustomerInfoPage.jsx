import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

/**
 * CustomerInfoPage — /customerinfo
 * -------------------------------------------------------------
 * หน้าจัดการข้อมูลส่วนตัว (My Profile) และข้อมูลผู้ใช้ทั้งหมด (User Management)
 * เชื่อมต่อกับ Backend API (/api/users) โดยตรง ครบทั้ง 4 ฟังก์ชัน:
 * - GET: ดึงข้อมูลผู้ใช้ทั้งหมดที่ลงทะเบียนไว้
 * - POST: เพิ่มผู้ใช้ใหม่เข้าสู่ระบบ
 * - PUT / PATCH: แก้ไขข้อมูลผู้ใช้ (ชื่อ, เบอร์โทร, บทบาท, รหัสผ่าน)
 * - DELETE: ลบผู้ใช้ออกจากฐานข้อมูล
 */

export default function CustomerInfoPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, updateCurrentUser } = useAuth();

  // สถานะรายการผู้ใช้
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // สถานะสำหรับฟอร์มแก้ไขข้อมูลตนเอง (My Profile Edit)
  const [isEditingSelf, setIsEditingSelf] = useState(false);
  const [selfForm, setSelfForm] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [selfSubmitting, setSelfSubmitting] = useState(false);

  // สถานะสำหรับ Modal สร้างผู้ใช้ใหม่ (Create User Modal)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // สถานะสำหรับ Modal แก้ไขผู้ใช้ (Edit User Modal)
  const [editingTargetUser, setEditingTargetUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // สถานะสำหรับยืนยันการลบ (Delete Confirmation)
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // ตรวจสอบสถานะการล็อกอิน
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated) {
      navigate('/login?redirect=/customerinfo', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ตั้งค่าฟอร์มข้อมูลตนเองเมื่อ user เปลี่ยน
  useEffect(() => {
    if (user) {
      setSelfForm({
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user]);

  // ดึงรายชื่อผู้ใช้ทั้งหมดจาก API (/api/users) - สำหรับ Admin เท่านั้น
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setErrorMsg(err.message || 'ไม่สามารถโหลดรายชื่อผู้ใช้จาก API ได้');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        fetchAllUsers();
      } else {
        setLoading(false);
      }
    }
  }, [isAuthenticated, isAdmin, fetchAllUsers]);

  // แจ้งเตือนแบบลอยชั่วคราว
  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // --- 1. บันทึกการแก้ไขข้อมูลตนเอง (Update My Profile) ---
  const handleSaveSelf = async (e) => {
    e.preventDefault();
    if (!selfForm.name.trim()) {
      showNotification('กรุณาระบุชื่อ-นามสกุล', true);
      return;
    }

    setSelfSubmitting(true);
    try {
      const targetId = user?._id || user?.id;
      const payload = {
        name: selfForm.name.trim(),
        phone: selfForm.phone.trim(),
      };
      if (selfForm.password.trim()) {
        payload.password = selfForm.password.trim();
      }

      // ยิง PUT/PATCH ไปที่ /api/users/:id จริง
      if (targetId && !targetId.startsWith('usr_')) {
        await userService.updateUser(targetId, payload);
      }

      // อัปเดต state ใน AuthContext ทันที
      updateCurrentUser({
        name: payload.name,
        phone: payload.phone,
      });

      setIsEditingSelf(false);
      showNotification('อัปเดตข้อมูลส่วนตัวของคุณสำเร็จแล้ว!');
      fetchAllUsers();
    } catch (err) {
      showNotification(err.message || 'ไม่สามารถอัปเดตข้อมูลส่วนตัวได้', true);
    } finally {
      setSelfSubmitting(false);
    }
  };

  // --- 2. สร้างผู้ใช้ใหม่ (POST /api/users) ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.email.trim()) {
      showNotification('กรุณากรอกชื่อและอีเมลให้ครบถ้วน', true);
      return;
    }

    setCreateSubmitting(true);
    try {
      const created = await userService.createUser(createForm);
      showNotification(`สร้างผู้ใช้ "${created.name || createForm.name}" สำเร็จแล้ว!`);
      setIsCreateModalOpen(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user',
      });
      fetchAllUsers();
    } catch (err) {
      showNotification(err.message || 'ไม่สามารถสร้างผู้ใช้ได้', true);
    } finally {
      setCreateSubmitting(false);
    }
  };

  // --- 3. แก้ไขผู้ใช้ในตาราง (PUT/PATCH /api/users/:id) ---
  const handleOpenEdit = (target) => {
    setEditingTargetUser(target);
    setEditForm({
      name: target.name || '',
      email: target.email || '',
      phone: target.phone || '',
      role: target.role || 'user',
      password: '',
    });
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingTargetUser) return;

    setEditSubmitting(true);
    try {
      const targetId = editingTargetUser._id || editingTargetUser.id;
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        role: editForm.role,
      };
      if (editForm.password.trim()) {
        payload.password = editForm.password.trim();
      }

      await userService.updateUser(targetId, payload);
      showNotification(`อัปเดตข้อมูลของ "${editForm.name}" สำเร็จแล้ว!`);

      // ถ้าเป็นผู้ใช้ปัจจุบันที่ล็อกอินอยู่ ให้อัปเดต Context ด้วย
      if ((user?._id && user._id === targetId) || (user?.id && user.id === targetId)) {
        updateCurrentUser({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
        });
      }

      setEditingTargetUser(null);
      fetchAllUsers();
    } catch (err) {
      showNotification(err.message || 'บันทึกข้อมูลไม่สำเร็จ', true);
    } finally {
      setEditSubmitting(false);
    }
  };

  // --- 4. ลบผู้ใช้ (DELETE /api/users/:id) ---
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setDeleteSubmitting(true);
    try {
      const targetId = deletingUser._id || deletingUser.id;
      await userService.deleteUser(targetId);
      showNotification(`ลบผู้ใช้ "${deletingUser.name || deletingUser.email}" สำเร็จแล้ว!`);
      setDeletingUser(null);
      fetchAllUsers();
    } catch (err) {
      showNotification(err.message || 'ไม่สามารถลบผู้ใช้ได้', true);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // กรองผู้ใช้ตามคำค้นหา
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const name = String(u.name || '').toLowerCase();
    const email = String(u.email || '').toLowerCase();
    const phone = String(u.phone || '').toLowerCase();
    const role = String(u.role || '').toLowerCase();
    return name.includes(q) || email.includes(q) || phone.includes(q) || role.includes(q);
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] tracking-wide text-slate-400 flex items-center gap-2 mb-2">
          <Link to="/" className="hover:text-slate-700 transition">หน้าแรก</Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">ข้อมูลผู้ใช้และข้อมูลส่วนตัว</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span>👤</span>
              <span>{isAdmin ? 'ข้อมูลส่วนตัวและระบบผู้ใช้งาน (Admin Console)' : 'ข้อมูลส่วนตัวของคุณ (My Profile)'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isAdmin
                ? 'จัดการโปรไฟล์ของคุณ พร้อมระบบ CRUD ผู้ใช้งานทั้งหมดที่ลงทะเบียนในระบบโดยตรงกับ Backend API (/api/users)'
                : 'จัดการและแก้ไขข้อมูลโปรไฟล์ส่วนตัวของคุณ สำหรับใช้ในการจองที่พัก รถเช่า และไกด์นำเที่ยว'}
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchAllUsers}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔄</span>
                <span>รีเฟรช (Refresh)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>➕</span>
                <span>เพิ่มผู้ใช้ใหม่ (POST)</span>
              </button>
            </div>
          )}
        </div>

        {/* Toast Notification Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span className="font-semibold">{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="font-bold text-rose-500 hover:text-rose-700 ml-3">✕</button>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">✅</span>
              <span className="font-semibold">{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="font-bold text-emerald-500 hover:text-emerald-700 ml-3">✕</button>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 1: ข้อมูลส่วนตัวของคุณ (My Profile Card) */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0a192f] text-amber-400 flex items-center justify-center text-xl font-bold font-serif shadow-xs">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
                  {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'ผู้ใช้งาน'}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{user?.email}</span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    user?.role === 'admin'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {user?.role === 'admin' ? '👑 ผู้ดูแลระบบ (Admin)' : '👤 สมาชิกทั่วไป (Customer)'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingSelf(!isEditingSelf)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isEditingSelf
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-[#0a192f] hover:bg-slate-800 text-amber-400 shadow-sm'
              }`}
            >
              <span>{isEditingSelf ? '✕ ยกเลิกแก้ไข' : '✏️ แก้ไขข้อมูลส่วนตัว'}</span>
            </button>
          </div>

          {isEditingSelf ? (
            /* แบบฟอร์มแก้ไขข้อมูลส่วนตัว */
            <form onSubmit={handleSaveSelf} className="space-y-4 max-w-xl animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selfForm.name}
                    onChange={(e) => setSelfForm({ ...selfForm, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400 transition"
                    placeholder="เช่น สมชาย ใจดี"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เบอร์โทรติดต่อ
                  </label>
                  <input
                    type="tel"
                    value={selfForm.phone}
                    onChange={(e) => setSelfForm({ ...selfForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400 transition"
                    placeholder="08x-xxxx-xxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  รหัสผ่านใหม่ (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)
                </label>
                <input
                  type="password"
                  value={selfForm.password}
                  onChange={(e) => setSelfForm({ ...selfForm, password: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400 transition"
                  placeholder="ตั้งรหัสผ่านใหม่..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={selfSubmitting}
                  className="px-5 py-2.5 bg-[#0a192f] hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {selfSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <span>💾 บันทึกการเปลี่ยนแปลง (Save)</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingSelf(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          ) : (
            /* มุมมองแสดงข้อมูลส่วนตัว */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block mb-1">อีเมลผู้ใช้งาน:</span>
                <span className="font-semibold text-slate-900 font-mono">{user?.email}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block mb-1">เบอร์โทรติดต่อ:</span>
                <span className="font-semibold text-slate-900">{user?.phone || 'ยังไม่ได้ระบุ'}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block mb-1">รหัสอ้างอิง User ID:</span>
                <span className="font-semibold text-slate-900 font-mono truncate block" title={user?._id || user?.id}>
                  {user?._id || user?.id || '-'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: ระบบจัดการผู้ใช้ทั้งหมด (Admin Only) */}
        {/* ============================================================== */}
        {isAdmin ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                  <span>👥</span>
                  <span>รายชื่อผู้ใช้ที่ลงทะเบียนในระบบ (Database: api/users)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  ดึงข้อมูลจริงจากฐานข้อมูล MongoDB ผ่าน GET /api/users ({filteredUsers.length} คน)
                </p>
              </div>

              {/* ช่องค้นหา */}
              <div className="relative w-full sm:w-64">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อ, อีเมล หรือบทบาท..."
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* ตารางแสดงรายชื่อผู้ใช้ */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500">กำลังเชื่อมต่อและดึงข้อมูลจาก api/users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                ไม่พบข้อมูลผู้ใช้ที่ตรงกับคำค้นหา
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">ผู้ใช้งาน (Name / Email)</th>
                      <th className="py-3 px-4">เบอร์โทร</th>
                      <th className="py-3 px-4">บทบาท (Role)</th>
                      <th className="py-3 px-4">วันที่สมัคร</th>
                      <th className="py-3 px-4 text-right">การจัดการ (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((item) => {
                      const isCurrent = (user?._id && user._id === item._id) || (user?.email && user.email === item.email);
                      const isAdminRole = item.role === 'admin';
                      const displayCreated = item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-';

                      return (
                        <tr key={item._id || item.id || item.email} className={`hover:bg-slate-50/80 transition ${isCurrent ? 'bg-amber-50/40' : ''}`}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                                {item.name ? item.name.charAt(0).toUpperCase() : item.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{item.name || '-'}</span>
                                  {isCurrent && (
                                    <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-md font-bold">
                                      คุณ
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">{item.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {item.phone || '-'}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isAdminRole
                                ? 'bg-amber-100 text-amber-900 border-amber-200'
                                : 'bg-blue-50 text-blue-800 border-blue-100'
                            }`}>
                              {isAdminRole ? '👑 Admin' : '👤 Customer'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {displayCreated}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold text-[11px] transition shadow-2xs cursor-pointer"
                              title="แก้ไขผู้ใช้"
                            >
                              ✏️ แก้ไข
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingUser(item)}
                              className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg text-rose-600 font-bold text-[11px] transition shadow-2xs cursor-pointer"
                              title="ลบผู้ใช้"
                            >
                              🗑️ ลบ
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl border border-amber-200 shrink-0">
                  🧳
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base">
                    สิทธิประโยชน์บัญชีสมาชิก GoThailand (Customer Portal)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                    ข้อมูลโปรไฟล์ที่คุณกรอกไว้ข้างต้น จะถูกนำไปใช้งานและเติมให้อัตโนมัติเมื่อทำการจองที่พัก รถเช่า หรือไกด์นำเที่ยว เพื่อความรวดเร็วและสะดวกในการใช้งาน
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/my-bookings"
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#0a192f] hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>📋</span>
                  <span>ดูการจองของฉัน</span>
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition shadow-2xs flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>🏠</span>
                  <span>หน้าหลัก</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: สร้างผู้ใช้ใหม่ (POST /api/users) */}
      {/* ============================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="bg-[#0a192f] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">➕</span>
                <h3 className="font-serif font-bold text-base">เพิ่มผู้ใช้งานใหม่ (POST)</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="เช่น John Doe"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  อีเมล (Email) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    รหัสผ่าน <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="รหัสผ่าน..."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    บทบาท (Role)
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                  >
                    <option value="user">Customer (สมาชิก)</option>
                    <option value="admin">Admin (ผู้ดูแล)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  เบอร์โทรติดต่อ
                </label>
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="08x-xxxx-xxxx"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {createSubmitting ? 'กำลังส่งข้อมูล...' : 'บันทึกผู้ใช้ (POST)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: แก้ไขข้อมูลผู้ใช้ (PUT / PATCH /api/users/:id) */}
      {/* ============================================================== */}
      {editingTargetUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="bg-[#0a192f] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <h3 className="font-serif font-bold text-base">แก้ไขข้อมูลผู้ใช้ (UPDATE)</h3>
              </div>
              <button
                onClick={() => setEditingTargetUser(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  อีเมล (Email)
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    เบอร์โทรติดต่อ
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    บทบาท (Role)
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                  >
                    <option value="user">Customer (สมาชิก)</option>
                    <option value="admin">Admin (ผู้ดูแล)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  รหัสผ่านใหม่ (ปล่อยว่างถ้าไม่ต้องการเปลี่ยน)
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="รหัสผ่านใหม่..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTargetUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 bg-[#0a192f] hover:bg-slate-800 text-amber-400 font-bold rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {editSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข (UPDATE)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ยืนยันการลบผู้ใช้ (DELETE /api/users/:id) */}
      {/* ============================================================== */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200 animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-3">
              🗑️
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-1">
              ยืนยันการลบผู้ใช้?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              คุณต้องการลบผู้ใช้ <span className="font-bold text-slate-800">"{deletingUser.name || deletingUser.email}"</span> ออกจากระบบหรือไม่? การกระทำนี้จะยิงคำขอ <span className="font-mono text-rose-600 font-bold">DELETE /api/users</span> จริง
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteSubmitting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {deleteSubmitting ? 'กำลังลบ...' : 'ยืนยันลบ (DELETE)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
