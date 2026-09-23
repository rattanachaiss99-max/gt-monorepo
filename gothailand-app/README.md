# 🇹🇭 Go Thailand Web Application

เว็บแอปพลิเคชันบริการการท่องเที่ยวประเทศไทยแบบครบวงจร (Accommodations, Car Rentals, Tour Guides, และ Province Interactive Maps) พัฒนาด้วย React 19, Vite, Tailwind CSS และเชื่อมต่อกับ MongoDB Atlas & Yok Core Services

---

## 📖 คู่มือนักพัฒนา (Developer Guide)

สำหรับโครงสร้างสถาปัตยกรรม (Architecture), มาตรฐานการออกแบบ (Design Tokens), และแนวทางการเพิ่มฟีเจอร์ใหม่โดยไม่กระทบของเดิม กรุณาอ่านเอกสารอย่างละเอียดที่:

👉 **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**

---

## 🛠️ เทคโนโลยีหลักในโปรเจกต์ (Tech Stack)

- **Frontend Core**: React 19, Vite 8, React Router 7
- **Styling**: Tailwind CSS v4, Yok Design System Tokens
- **State Management**: React Context API (`AuthContext`, `CartContext`, `ItemVisibilityContext`)
- **Icons & Graphics**: Inline SVG & Custom Icons
- **Backend / Database**: MongoDB Atlas, Express REST APIs, Yok Core Services

---

## 🚀 การเริ่มต้นใช้งาน (Getting Started)

```bash
# ติดตั้ง dependencies
npm install

# รัน Development Server
npm run dev

# คอมไพล์ Production Build
npm run build

# ตรวจสอบ Code Quality & Linter
npm run lint
```
