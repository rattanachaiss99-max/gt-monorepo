# 🇹🇭 Go Thailand — Sprint 3 (Demo: MongoDB Map Connector)

> **เว็บแอปพลิเคชันท่องเที่ยวไทยครบวงจร — JSD13 ทีม 8**  
> โปรเจกต์ตัวอย่างสำหรับ Demo: แสดงการเชื่อมต่อระหว่าง **Vite + React 19 + Tailwind CSS** และ **Express 4 + Mongoose 8** เพื่อดึงข้อมูลและเรนเดอร์แผนที่ SVG ทั้ง 77 จังหวัดสดจาก **MongoDB Atlas**

---

## 📂 โครงสร้างโปรเจกต์ที่คลีนและกระชับ (Clean Monorepo)

```text
go-thailand-s3/
├── README.md                      # เอกสารสรุปการใช้งานและ Demo ฉบับนี้
│
├── gothailand-app/                # 🌐 ฝั่งหน้าบ้าน (Frontend: Vite + React + Tailwind)
│   ├── src/
│   │   ├── App.jsx                # หน้าจอหลักแสดงผลแผนที่ SVG และข้อมูล 77 จังหวัด
│   │   ├── main.jsx               # Entry Point ของ React 19
│   │   ├── index.css              # Tailwind CSS v4 (@import "tailwindcss")
│   │   └── assets/                # react.svg, vite.svg
│   ├── .env                       # VITE_API_URL=http://localhost:5000
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── gothailand-backend/            # ⚙️ ฝั่งหลังบ้าน (Backend: Express + MongoDB Atlas)
    ├── src/
    │   ├── app.js                 # Express Application & CORS Middleware
    │   ├── config/db.js           # เชื่อมต่อ Mongoose กับ MongoDB Atlas Cluster
    │   ├── models/
    │   │   └── ProvinceKnowledge.js # Mongoose Schema สำหรับคอลเลกชัน 'provinceknowledges'
    │   └── routes/
    │       ├── provinceRoutes.js  # GET /api/provinces (ส่งข้อมูล 77 จังหวัดและเวกเตอร์ SVG)
    │       └── healthRoutes.js    # GET / (Health Check)
    ├── .env                       # MONGODB_URI (Cluster ของ Sprint 2) & PORT=5000
    ├── server.js                  # Entry Point เริ่มต้นเซิร์ฟเวอร์ (Port 5000)
    └── package.json
```

---

## 🚀 วิธีการรันเพื่อ Demo (Step-by-Step)

เปิด Terminal 2 หน้าต่าง:

### หน้าต่างที่ 1: รัน Backend (Express + MongoDB)

```powershell
cd C:\WorkFile\web\go-thailand-s3\gothailand-backend
npm run dev
```

- **สถานะเซิร์ฟเวอร์:** รันอยู่ที่ `http://localhost:5000`
- **สถานะ Database:** จะแสดง `✅ MongoDB Connected: ac-d7hbbcc-shard-00-00.ms885cg.mongodb.net` และ `📂 Database Name: gothailand_user`
- **ทดสอบ Endpoint:** `http://localhost:5000/api/provinces` (ส่ง JSON 77 จังหวัด)

---

### หน้าต่างที่ 2: รัน Frontend (Vite + React)

```powershell
cd C:\WorkFile\web\go-thailand-s3\gothailand-app
npm run dev
```

- **เปิดหน้าเว็บที่:** `http://localhost:5173`

---
