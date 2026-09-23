# 📘 คู่มือนักพัฒนา Go Thailand (Developer & Architecture Guide)

เอกสารฉบับนี้จัดทำขึ้นสำหรับทีมนักพัฒนาทุกคน เพื่ออธิบายโครงสร้างสถาปัตยกรรมของโปรเจกต์ มาตรฐานการเขียนโค้ด (Coding Standards) และแนวทางการพัฒนาฟีเจอร์ใหม่โดยไม่ส่งผลกระทบต่อระบบเดิม

---

## 1. 🏗️ ภาพรวมสถาปัตยกรรมโปรเจกต์ (Project Architecture)

โปรเจกต์นี้ใช้โครงสร้างแบบ **Feature-Driven Architecture ผสานกับ Shared Component System** เพื่อแบ่งความรับผิดชอบของโค้ดให้เป็นอิสระต่อกัน (Decoupled & Modular)

### แผนผังโฟลเดอร์ใน `src/`

```
src/
├── components/
│   └── common/                  # 🌐 Shared Components ส่วนกลางของทั้งโปรเจกต์ (ห้ามสร้างโฟลเดอร์ชื่อบุคคลที่นี่)
│       ├── TravelSearchBox.jsx          # กล่องค้นหาบริการรวม (Accommodations / Cars / Guides)
│       ├── TravelSearchResultsTable.jsx  # ตารางผลลัพธ์การค้นหาอัจฉริยะ (Responsive Desktop Table + Mobile Cards)
│       ├── TravelFilterSidebar.jsx       # แถบตัวกรองบริการรวมสไตล์ Yok Design
│       ├── ItemVisibilityBadge.jsx       # ปุ่มรูปตา (👁️ / 🙈) เปิด-ปิดการแสดงผลสำหรับ Admin
│       ├── CartDrawer.jsx               # หน้าต่างลิ้นชักตะกร้าสินค้าส่วนกลาง
│       ├── CartNavbarButton.jsx         # ปุ่มตะกร้าพร้อมตัวเลขนับจำนวนบน Header
│       ├── UserNavbarWidget.jsx         # วิดเจ็ตผู้ใช้และปุ่มสลับ Demo Role
│       ├── BookingSummaryPanel.jsx      # แผงสรุปยอดเงินและรายละเอียดการจอง
│       ├── Button.jsx                   # ปุ่มมาตรฐานของระบบ
│       ├── ScrollToTop.jsx              # ระบบเลื่อนขึ้นบนสุดอัตโนมัติเมื่อเปลี่ยนหน้า
│       └── index.js                     # รวม Export Shared Components ทั้งหมด
│
├── features/                    # 📦 Feature Modules (แยกตามประเภทโดเมนธุรกิจ)
│   ├── accommodations/          # โมดูลที่พัก (โรงแรม / รีสอร์ต / วิลล่า)
│   │   ├── components/          # คอมโพเนนต์เฉพาะของที่พัก (AccommodationCard, Detail, ฯลฯ)
│   │   ├── pages/               # หน้าของฟีเจอร์ (AccommodationPage, DetailPage)
│   │   └── services/            # API Service ของที่พัก (accommodationService.js)
│   ├── cars/                    # โมดูลรถเช่า
│   │   ├── components/          # CarCard, CarDetail, ฯลฯ
│   │   ├── pages/               # CarPage, CarDetailPage
│   │   └── services/            # carService.js
│   ├── guides/                  # โมดูลมัคคุเทศก์ / ไกด์นำเที่ยว
│   │   ├── components/          # GuideCard, GuideDetail, ฯลฯ
│   │   ├── pages/               # GuidePage, GuideDetailPage
│   │   └── services/            # guideService.js
│   ├── provinces/               # โมดูลข้อมูลจังหวัดและแผนที่ SVG
│   │   ├── components/          # ProvinceMapDemo, ProvinceSvgViewer, ProvinceTable, ฯลฯ
│   │   ├── pages/               # ProvinceMapPage
│   │   └── services/            # provinceService.js
│   └── ai/                      # โมดูล AI Travel Companion
│
├── context/                     # 🔄 Global Contexts (State กลางของระบบ)
│   ├── AuthContext.jsx          # จัดการข้อมูล User, Token, และสิทธิ์ Admin / Demo Role Switcher
│   ├── CartContext.jsx          # จัดการตะกร้ากลางของทุกบริการ (เพิ่ม, ลบ, แก้ไข, ซิงก์ LocalStorage)
│   └── ItemVisibilityContext.jsx# ระบบ Admin ซ่อน/แสดงข้อมูลบริการ (รูปตา 👁️/🙈)
│
├── layouts/                     # 🖼️ Layout Shells
│   ├── MainLayout.jsx           # Layout หลักของเว็บ (Header, Footer, Bottom Navigation บนมือถือ)
│   ├── AuthLayout.jsx           # Layout หน้า Login / Register
│   └── AdminLayout.jsx          # Layout ฝั่งระบบจัดการหลังบ้าน
│
├── pages/                       # 📄 Root Page Views & Flow Pages
│   ├── LandingPage.jsx          # หน้าแรกของเว็บไซต์
│   ├── LoginPage.jsx            # หน้าเข้าสู่ระบบ
│   ├── RegisterPage.jsx         # หน้าสมัครสมาชิก
│   ├── BookingDetailsPage.jsx   # ขั้นตอนการจอง Step 2 (กรอกข้อมูลผู้จอง/ผู้ขับ/นัดพบ)
│   ├── CheckoutPage.jsx         # ขั้นตอนการจอง Step 3 (ชำระเงิน และล้างตะกร้าอัตโนมัติ)
│   ├── BookingConfirmedPage.jsx # หน้ายืนยันการจองสำเร็จ (พร้อม Booking Ref ID)
│   ├── MyBookingsPage.jsx       # ประวัติการจองของผู้ใช้
│   └── CustomerInfoPage.jsx     # จัดการข้อมูลบัญชีผู้ใช้
│
├── routes/                      # 🚦 การจัดการเส้นทาง (Routing)
│   ├── AppRoutes.jsx            # จุดรวมเส้นทาง URL ทั้งหมดของระบบ
│   └── ProtectedRoute.jsx       # Route Guard ตรวจสอบสิทธิ์การเข้าถึง (User / Admin)
│
└── services/                    # 🔌 Core APIs & Networking
    ├── api.js                   # Axios Instance หลัก และการกำหนด Backend Base URL
    ├── yokService.js            # ฟังก์ชันเชื่อมต่อ Yok Core Services
    ├── bookingService.js        # ฟังก์ชันบันทึกการจอง (Dual-mode: API + LocalStorage)
    └── userService.js           # ฟังก์ชันจัดการผู้ใช้งาน
```

---

## 2. 🚀 ขั้นตอนการสร้างฟีเจอร์ใหม่โดยไม่กระทบของเก่า (How to Build New Features)

หากต้องการเพิ่มฟีเจอร์ใหม่ (เช่น ระบบกิจกรรม `activities`, แพ็กเกจทัวร์ `packages`, หรือโปรโมชัน `promotions`) ให้ปฏิบัติตามแนวทางต่อไปนี้เสมอ:

### ขั้นตอนที่ 1: สร้างโฟลเดอร์ Feature ใหม่ใน `src/features/`
จัดโครงสร้างภายในให้เป็นสัดส่วน:
```
src/features/your-feature/
├── components/          # คอมโพเนนต์ UI เฉพาะของฟีเจอร์นี้
│   ├── YourFeatureCard.jsx
│   └── index.js
├── pages/               # หน้า Page สำหรับผูกกับ Route
│   ├── YourFeaturePage.jsx
│   └── YourFeatureDetailPage.jsx
└── services/            # ฟังก์ชันยิง API ดึงข้อมูล
    └── yourFeatureService.js
```

### ขั้นตอนที่ 2: นำ Shared Components จาก `src/components/common` มาใช้ซ้ำ (Reuse First)
ห้ามเขียนกล่องค้นหา ตะกร้า หรือปุ่มรูปตาขึ้นมาใหม่เอง ให้เรียกใช้จากส่วนกลาง:
```jsx
// ตัวอย่างการ import คอมโพเนนต์ส่วนกลาง
import { 
  TravelSearchBox, 
  ItemVisibilityBadge, 
  Button 
} from '../../../components/common';
```

### ขั้นตอนที่ 3: เชื่อมต่อ Global Context อย่างถูกต้อง
โปรเจกต์มี 3 Context หลักที่เตรียมไว้ให้เรียกใช้:

#### 1. สิทธิ์สมาชิกและการเข้าสู่ระบบ (`useAuth`)
```jsx
import { useAuth } from '../../../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  // ...
}
```

#### 2. ระบบตะกร้าสินค้าส่วนกลาง (`useCart`)
หากบริการใหม่ของคุณสามารถกดจองหรือใส่ตะกร้าได้ ให้เรียกใช้ `addToCart`:
```jsx
import { useCart } from '../../../context/CartContext';

function MyCard({ item }) {
  const { addToCart } = useCart();

  const handleBook = () => {
    addToCart({
      type: 'your-service-type', // เช่น 'activity', 'car', 'accommodation', 'guide'
      itemId: item.id || item._id,
      title: item.name,
      subtitle: item.category,
      image: item.imageUrl,
      location: item.location,
      unitPrice: item.price,
      priceUnitLabel: '/ คน',
      quantity: 1,
      dates: { startDate: '2026-10-15', endDate: '2026-10-16', durationDays: 1 },
      details: { ...item },
    }, { openDrawer: true }); // เปิดตะกร้าทันทีที่กดใส่
  };
}
```

#### 3. ระบบซ่อน/แสดงผลข้อมูลโดย Admin (`useItemVisibility`)
เพื่อสนับสนุนให้ Admin สามารถซ่อน/แสดงบริการต่อลูกค้าได้:
```jsx
import { useItemVisibility } from '../../../context/ItemVisibilityContext';
import { ItemVisibilityBadge } from '../../../components/common';

function MyCard({ item }) {
  const { isItemVisible, adminCustomerPreview } = useItemVisibility();
  
  // รองรับ Candidate IDs ทุกรูปแบบ (_id, id, slug)
  const candidateIds = [item.id, item._id, item.slug].filter(Boolean);
  const isVisible = isItemVisible('your-service-type', item, candidateIds);

  return (
    <div className="relative group">
      {/* Badge รูปตาจะลอยอยู่มุมขวาบนของการ์ดอัตโนมัติ */}
      <ItemVisibilityBadge
        serviceType="your-service-type"
        item={item}
        itemId={item.id || item._id}
        fallbackIds={candidateIds}
        variant="card"
      />
      <div className={!isVisible ? 'opacity-65 grayscale-25 ring-2 ring-rose-400/80 rounded-2xl' : ''}>
        {/* เนื้อหาการ์ด */}
      </div>
    </div>
  );
}
```

### ขั้นตอนที่ 4: ลงทะเบียน Route ใน `src/routes/AppRoutes.jsx`
นำหน้าฟีเจอร์ใหม่ไปวางไว้ใน Layout ที่เหมาะสมใน `AppRoutes.jsx`:
```jsx
// ภายใน MainLayout สำหรับหน้าสาธารณะทั่วไป
<Route element={<MainLayout />}>
  {/* หน้าเดิม */}
  <Route path="/accommodations" element={<AccommodationPage />} />
  
  {/* เพิ่มหน้าฟีเจอร์ใหม่ที่นี่ */}
  <Route path="/activities" element={<ActivityPage />} />
  <Route path="/activities/:id" element={<ActivityDetailPage />} />
</Route>
```

---

## 3. 🎨 มาตรฐานการออกแบบ (Yok Design System Tokens)

เพื่อให้หน้าจอใหม่ดูกลมกลืนกับทั้งเว็บไซต์ ให้ยึดถือ Tailwind Classes มาตรฐานต่อไปนี้:

| องค์ประกอบ | คลาส Tailwind มาตรฐาน | คำอธิบาย |
| :--- | :--- | :--- |
| **สีกรมท่าหลัก (Navy)** | `bg-[#0a192f] text-white hover:bg-[#112240]` | แถบส่วนหัว Navbar, Header, ปุ่ม Action สำคัญ |
| **สีอำพันทอง (Amber Accent)**| `bg-amber-400 text-slate-950 font-bold hover:bg-amber-300`, `text-amber-400` | ป้าย Highlight, กรอบ Focus, Badge เด่น |
| **ขอบมนการ์ด (Cards)** | `bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-xs` | การ์ดรายการ, กรอบฟอร์ม |
| **อินพุต & ดรอปดาวน์** | `border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100` | ช่องพิมพ์และตัวเลือกทั้งหมด |
| **พื้นหลังหน้าเว็บ** | `bg-[#fcfbf9]` หรือ `bg-slate-50` | โทนสว่างสบายตา สะอาด เรียบง่าย |

---

## 4. ⚠️ ข้อควรระวังและสิ่งที่ไม่ควรทำ (Dos & Don'ts)

### ❌ สิ่งที่ไม่ควรทำ (Don'ts)
1. **ห้ามสร้างโฟลเดอร์ชื่อบุคคลหรือเลขสปรินต์ใน `src/components/` อีกต่อไป** (เช่น `20-meng`, `36-yok`, `31-po`) ให้วางใน `src/features/<ชื่อโดเมน>/` หรือ `src/components/common/` เท่านั้น
2. **ห้าม Copy คอมโพเนนต์ส่วนกลางไปดัดแปลงเป็นของตนเอง** หากต้องการเพิ่มความสามารถให้ขยาย Props ของคอมโพเนนต์เดิมใน `common/` แทน
3. **ห้าม Hardcode URL ของ API โดยตรงใน Component** ให้สร้างฟังก์ชันในโฟลเดอร์ `services/` แล้วเรียกผ่าน Axios Instance กลางเสมอ
4. **ห้ามดึงข้อมูล `localStorage` ของตะกร้าหรือสถานะสมาชิกมาจัดการเองตรงๆ** ให้เรียกใช้ฟังก์ชันผ่าน `useCart()` หรือ `useAuth()` เพื่อให้ State ซิงก์ทั้งแอป

### ✅ สิ่งที่ควรทำ (Dos)
1. **รองรับ Responsive แบบ Mobile-First เสมอ**: ตรวจสอบการแสดงผลบนหน้าจอมือถือ (`< 640px`) ด้วยเสมอ
2. **รองรับ Candidate IDs หลากหลายรูปแบบ**: ข้อมูล API จากภายนอกอาจใช้ทั้ง `_id` (numeric/MongoDB), `id` (slug), หรือ `slug` ให้ส่ง array `[item.id, item._id, item.slug]` เสมอ
3. **ตรวจสอบ Build เสมอก่อนส่งงาน**: รัน `npm run build` เพื่อยืนยันว่าไม่มี broken import หรือข้อผิดพลาดทางไวยากรณ์

---

## 5. 🛠️ คำสั่งสำหรับนักพัฒนา (Developer Commands)

```bash
# 1. รัน Development Server
npm run dev

# 2. ตรวจสอบการคอมไพล์ Production Build (แนะนำให้รันก่อน Commit ทุกครั้ง)
npm run build

# 3. ตรวจสอบข้อผิดพลาดทางไวยากรณ์ด้วย ESLint
npx eslint src/ --rule "{'no-undef': 'error'}"
```

---
*จัดทำขึ้นเพื่อให้การทำงานร่วมกันในทีม Go Thailand เป็นไปอย่างราบรื่น โค้ดสะอาด ยั่งยืน และมีคุณภาพสูงสุด* 🚀
