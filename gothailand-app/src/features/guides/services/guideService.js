/**
 * guideService.js
 * -------------------------------------------------------------
 * Service สำหรับจัดการข้อมูลมัคคุเทศก์ / ไกด์นำเที่ยว (Tourist Guide Service)
 * เชื่อมต่อกับ Central API Client (`api.js`) ตามสถาปัตยกรรมของโปรเจกต์
 * อ้างอิงโครงสร้างข้อมูลตาม DataSchema.md
 */
import api from "../../../services/api";

// ข้อมูลไกด์สำรอง (Fallback Seed Data) กรณีที่เครือข่ายออฟไลน์หรือ Render Server กำลังตื่น
const FALLBACK_GUIDES = [
  {
    _id: "6aae496bf3c07d4e0406425c",
    id: "6aae496bf3c07d4e0406425c",
    name: "Somchai Jaidee",
    nickname: "Chai",
    gender: "Male",
    guide_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    phone: "081-100-8014",
    email: "chai.somchai@gothailand-guide.com",
    line_id: "@guide_chai_chia",
    province: "Chiang Mai",
    daily_fee: 1600,
    pricePerDay: 1600,
    overtime_rate_perhour: 240,
    license_number: "TG-50-1001",
    license_category: "General",
    scope_type: "Inbound & Domestic",
    scope_description: "Certified professional tourist guide authorized for cultural, heritage, and nature tourism in Chiang Mai and Northern Thailand.",
    permitted_regions: ["Northern Thailand"],
    issue_date: "2021-01-10T00:00:00.000Z",
    expiry_date: "2028-01-10T00:00:00.000Z",
    verified: true,
    language: ["Thai", "English"],
    languages: ["Thai", "English"],
    service_areas: [
      "Doi Suthep",
      "Wat Chedi Luang",
      "Nimmanhaemin",
      "Doi Inthanon",
      "Sticky Waterfalls",
      "Mae Rim Valley"
    ],
    base_location: "Mueang Chiang Mai District, Chiang Mai",
    max_guest: 8,
    guide_service_duration_per_day: 8,
    status: "Available",
    rating_avg: 4.8,
    rating: 4.8,
    total_reviews: 24,
    reviews: 24,
    years_experience: 5,
    total_travelers: 420,
    description: "มัคคุเทศก์ท้องถิ่นเชียงใหม่ มีใบอนุญาตถูกต้อง ประสบการณ์กว่า 5 ปี ชำนาญเส้นทางวัดโบราณ ประวัติศาสตร์ล้านนา คาเฟ่ลับ และจุดชมวิวบนดอยอินทนนท์ เป็นกันเอง สื่อสารภาษาอังกฤษคล่องแคล่ว",
    specialized_services: [
      {
        service_id: "svc-50-1-1",
        title: "Lanna Heritage & Ancient Temples",
        description: "สำรวจวัดโบราณไม้สักทอง พิธีกรรมล้านนา และเรียนรู้ประวัติศาสตร์อาณาจักรล้านนา 700 ปี",
        image_url: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=80"
      },
      {
        service_id: "svc-50-1-2",
        title: "Northern Street Food & Night Bazaar",
        description: "พาชิมข้าวซอยสูตรโบราณ ไส้อั่วสมุนไพร และเดินชมตลาดคนเดินท่าแพแบบคนท้องถิ่น",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    _id: "6aae496bf3c07d4e0406425d",
    id: "6aae496bf3c07d4e0406425d",
    name: "Nattaporn Srisuk",
    nickname: "Ploy",
    gender: "Female",
    guide_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    phone: "089-555-1234",
    email: "ploy.nattaporn@gothailand-guide.com",
    line_id: "@guide_ploy_bkk",
    province: "Bangkok",
    daily_fee: 2200,
    pricePerDay: 2200,
    overtime_rate_perhour: 300,
    license_number: "TG-10-2045",
    license_category: "General",
    scope_type: "Inbound & Domestic",
    scope_description: "Expert in royal heritage, Grand Palace, canal tours, and street food across Bangkok.",
    permitted_regions: ["Central Thailand"],
    issue_date: "2020-05-15T00:00:00.000Z",
    expiry_date: "2027-05-15T00:00:00.000Z",
    verified: true,
    language: ["Thai", "English", "Mandarin"],
    languages: ["Thai", "English", "Mandarin"],
    service_areas: [
      "Grand Palace & Wat Phra Kaew",
      "Wat Arun",
      "Yaowarat (Chinatown)",
      "Chao Phraya River Cruise",
      "Talad Noi",
      "Chatuchak Market"
    ],
    base_location: "Phra Nakhon, Bangkok",
    max_guest: 10,
    guide_service_duration_per_day: 8,
    status: "Available",
    rating_avg: 4.9,
    rating: 4.9,
    total_reviews: 48,
    reviews: 48,
    years_experience: 6,
    total_travelers: 650,
    description: "ไกด์สาวกรุงเทพฯ สื่อสาร 3 ภาษา (ไทย, อังกฤษ, จีน) เชี่ยวชาญวัดพระแก้ว พระบรมมหาราชวัง ล่องเรือคลองบางกอกน้อย และทัวร์สตรีทฟู้ดเยาวราชยามค่ำคืน การันตีรีวิว 4.9 ดาว",
    specialized_services: [
      {
        service_id: "svc-10-1-1",
        title: "Grand Palace & Royal Heritage Walk",
        description: "เจาะลึกสถาปัตยกรรมไทยโบราณในพระบรมมหาราชวังและวัดพระศรีรัตนศาสดาราม",
        image_url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80"
      },
      {
        service_id: "svc-10-1-2",
        title: "Chao Phraya Sunset Canal Exploration",
        description: "นั่งเรือหางยาวชมวิถีชีวิตริมสายน้ำเจ้าพระยา แวะไหว้พระวัดอรุณราชวรารามยามพระอาทิตย์ตก",
        image_url: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    _id: "6aae496bf3c07d4e0406425e",
    id: "6aae496bf3c07d4e0406425e",
    name: "Kittisak Thongdee",
    nickname: "Kit",
    gender: "Male",
    guide_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    phone: "084-777-9876",
    email: "kit.islandguide@gothailand-guide.com",
    line_id: "@guide_kit_phuket",
    province: "Phuket",
    daily_fee: 2500,
    pricePerDay: 2500,
    overtime_rate_perhour: 350,
    license_number: "TG-83-3088",
    license_category: "Specific Region",
    scope_type: "Marine & Island Tourism",
    scope_description: "Marine tour leader specializing in Andaman islands, scuba safety, and Phuket Old Town Sino-Portuguese architecture.",
    permitted_regions: ["Southern Thailand"],
    issue_date: "2019-11-20T00:00:00.000Z",
    expiry_date: "2026-11-20T00:00:00.000Z",
    verified: true,
    language: ["Thai", "English"],
    languages: ["Thai", "English"],
    service_areas: [
      "Phuket Old Town",
      "Promthep Cape",
      "Phi Phi Islands",
      "Phang Nga Bay",
      "Similan Islands"
    ],
    base_location: "Mueang Phuket, Phuket",
    max_guest: 12,
    guide_service_duration_per_day: 8,
    status: "Available",
    rating_avg: 4.9,
    rating: 4.9,
    total_reviews: 62,
    reviews: 62,
    years_experience: 8,
    total_travelers: 920,
    description: "ไกด์ชำนาญทะเลอันดามัน มีใบรับรองดำน้ำและการปฐมพยาบาลทางน้ำ พาเที่ยวหมู่เกาะพีพี อ่าวพังงา และย่านตึกเก่าชิโนโปรตุกีสภูเก็ต พร้อมบริการถ่ายรูปสวยตลอดทริป",
    specialized_services: [
      {
        service_id: "svc-83-1-1",
        title: "Andaman Secret Islands & Snorkeling",
        description: "ทริปดำน้ำดูปะการังน้ำตื้นและจุดชมวิวหาดทรายขาวที่ซ่อนอยู่ในทะเลอันดามัน",
        image_url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    _id: "6aae496bf3c07d4e0406425f",
    id: "6aae496bf3c07d4e0406425f",
    name: "Arunee Raksasat",
    nickname: "Nok",
    gender: "Female",
    guide_photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    phone: "086-333-7890",
    email: "nok.arunee@gothailand-guide.com",
    line_id: "@guide_nok_ayutthaya",
    province: "Phra Nakhon Si Ayutthaya",
    daily_fee: 1800,
    pricePerDay: 1800,
    overtime_rate_perhour: 250,
    license_number: "TG-14-1102",
    license_category: "Local",
    scope_type: "Historical & Cultural Heritage",
    scope_description: "Ayutthaya World Heritage expert historian and certified storyteller.",
    permitted_regions: ["Central Thailand"],
    issue_date: "2018-03-01T00:00:00.000Z",
    expiry_date: "2027-03-01T00:00:00.000Z",
    verified: true,
    language: ["Thai", "English", "Japanese"],
    languages: ["Thai", "English", "Japanese"],
    service_areas: [
      "Wat Mahathat",
      "Wat Chaiwatthanaram",
      "Ayutthaya Historical Park",
      "Wat Phra Si Sanphet",
      "Bang Pa-In Royal Palace"
    ],
    base_location: "Phra Nakhon Si Ayutthaya",
    max_guest: 15,
    guide_service_duration_per_day: 8,
    status: "Available",
    rating_avg: 4.9,
    rating: 4.9,
    total_reviews: 55,
    reviews: 55,
    years_experience: 9,
    total_travelers: 1100,
    description: "นักประวัติศาสตร์ท้องถิ่นอยุธยา มรดกโลก สื่อสารภาษาญี่ปุ่นและอังกฤษได้ดีเยี่ยม เล่าเรื่องสนุก มีเกร็ดประวัติศาสตร์สมัยกรุงศรีอยุธยาที่น่าสนใจและหาฟังยาก",
    specialized_services: [
      {
        service_id: "svc-14-1-1",
        title: "UNESCO World Heritage Historical Cycling Tour",
        description: "ปั่นจักรยานลัดเลาะโบราณสถาน ชมเศียรพระพุทธรูปในรากไม้ และวัดไชยวัฒนาราม",
        image_url: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];

/**
 * ดึงรายการไกด์ทั้งหมดจาก API
 * @param {Object} [params] - Query parameters เช่น { province, search, status }
 */
export const getGuides = async (params = {}) => {
  try {
    const response = await api.get("/guides", { params, timeout: 10000 });
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    return FALLBACK_GUIDES;
  } catch (error) {
    console.warn("⚠️ [GuideService] ไม่สามารถดึงข้อมูลไกด์จาก API ได้ ใช้ Fallback ข้อมูลสำรอง:", error.message);
    return FALLBACK_GUIDES;
  }
};

/**
 * ดึงข้อมูลไกด์รายคนตาม ID หรือ Slug
 * @param {string} id - _id, id หรือ slug
 */
export const getGuideById = async (id) => {
  try {
    const response = await api.get(`/guides/${id}`, { timeout: 8000 });
    if (response.data && (response.data.name || response.data._id)) {
      return response.data;
    }
  } catch {
    // หาก route /guides/:id ส่งกลับ 404 ให้ลองค้นหาจากรายการรวม
  }

  const all = await getGuides();
  const normalizedId = String(id).toLowerCase().trim();
  const found = (all || []).find((g) => {
    const gid = String(g._id || g.id || "").toLowerCase();
    const gNameSlug = String(g.name || "").toLowerCase().replace(/\s+/g, "-");
    return gid === normalizedId || gNameSlug === normalizedId || gid.includes(normalizedId);
  });

  if (found) return found;
  throw new Error(`ไม่พบข้อมูลไกด์รหัส "${id}"`);
};

export default {
  getGuides,
  getGuideById,
};
