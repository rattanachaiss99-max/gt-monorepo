/**
 * carService.js
 * -------------------------------------------------------------
 * Service สำหรับจัดการข้อมูลรถเช่าท่องเที่ยว (Car Rental Service)
 * เชื่อมต่อกับ Central API Client (`api.js`) สอดคล้องตามมาตรฐานของ Monorepo
 */
import api from "../../../services/api";

// Fallback ข้อมูลรถเช่าจากระบบฐานข้อมูล กรณีที่เครือข่ายออฟไลน์หรือ Render Server หลับ
// ดึงรูปสำรองจาก public/images/cars ภายใน repo นี้
const FALLBACK_CARS = [
  {
    _id: "6aae322ab765e237f6e50d05",
    slug: "toyota-yaris",
    brand: "Toyota",
    model: "Yaris",
    name: "Toyota Yaris 1.2 Sport",
    category: "Economy",
    price: 1200,
    pricePerDay: 1200,
    rating: 4.8,
    reviewCount: 42,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    luggageCapacity: "2 Large Bags",
    description: "Compact and fuel-efficient eco car, ideal for city driving and agile maneuverability.",
    mainImage: "/images/cars/toyota-yaris.jpg",
    galleryImages: [
      "/images/cars/toyota-yaris.jpg",
      "/images/cars/toyota-yaris-rear.jpg",
      "/images/cars/toyota-yaris-interior.jpg"
    ],
    availableLocations: [
      "Bangkok (BKK) Suvarnabhumi Airport",
      "Don Mueang Airport (DMK)",
      "Chiang Mai International Airport (CNX)",
      "Nan Nakhon Airport (NNT)",
      "Phra Nakhon Si Ayutthaya Heritage Center"
    ],
    isAvailable: true
  },
  {
    _id: "6aae322ab765e237f6e50d06",
    slug: "honda-city",
    brand: "Honda",
    model: "City",
    name: "Honda City 1.0 Turbo RS",
    category: "Sedan",
    price: 1300,
    pricePerDay: 1300,
    rating: 4.9,
    reviewCount: 56,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    luggageCapacity: "3 Large Bags",
    description: "Comfortable and stylish sedan featuring a responsive turbocharged engine and spacious interior.",
    mainImage: "/images/cars/honda-city.jpg",
    galleryImages: [
      "/images/cars/honda-city.jpg",
      "/images/cars/honda-city-rear.jpg",
      "/images/cars/honda-city-interior.jpg"
    ],
    availableLocations: [
      "Bangkok (BKK) Suvarnabhumi Airport",
      "Don Mueang Airport (DMK)",
      "Phuket International Airport (HKT)",
      "Krabi International Airport (KBV)",
      "Surat Thani Airport (URT) / Koh Samui"
    ],
    isAvailable: true
  },
  {
    _id: "6aae322ab765e237f6e50d07",
    slug: "toyota-fortuner",
    brand: "Toyota",
    model: "Fortuner",
    name: "Toyota Fortuner Leader 2.4G",
    category: "SUV",
    price: 2500,
    pricePerDay: 2500,
    rating: 4.9,
    reviewCount: 38,
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    luggageCapacity: "4 Large Bags",
    description: "Tough 7-seater SUV built for mountain terrain, provincial road trips and scenic highway cruising.",
    mainImage: "/images/cars/toyota-fortuner.jpg",
    galleryImages: [
      "/images/cars/toyota-fortuner.jpg",
      "/images/cars/toyota-fortuner-rear.jpg",
      "/images/cars/toyota-fortuner-interior.jpg"
    ],
    availableLocations: [
      "Bangkok (BKK) Suvarnabhumi Airport",
      "Chiang Mai International Airport (CNX)",
      "Chiang Rai International Airport (CEI)",
      "Nakhon Ratchasima / Khao Yai",
      "Kanchanaburi City Center",
      "Phuket International Airport (HKT)"
    ],
    isAvailable: true
  },
  {
    _id: "6aae322ab765e237f6e50d08",
    slug: "mazda-2",
    brand: "Mazda",
    model: "2",
    name: "Mazda 2 1.3 SP Sports",
    category: "Economy",
    price: 1100,
    pricePerDay: 1100,
    rating: 4.7,
    reviewCount: 29,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    luggageCapacity: "2 Large Bags",
    description: "Agile hatchback with signature Jinba Ittai handling and premium Japanese cabin aesthetics.",
    mainImage: "/images/cars/mazda-2.jpg",
    galleryImages: [
      "/images/cars/mazda-2.jpg",
      "/images/cars/mazda-2-rear.jpg"
    ],
    availableLocations: [
      "Bangkok (BKK) Suvarnabhumi Airport",
      "Don Mueang Airport (DMK)",
      "Chiang Mai International Airport (CNX)",
      "Khon Kaen Airport (KKC)",
      "Udon Thani International Airport (UTH)"
    ],
    isAvailable: true
  },
  {
    _id: "6aae322ab765e237f6e50d09",
    slug: "nissan-almera",
    brand: "Nissan",
    model: "Almera",
    name: "Nissan Almera 1.0L Turbo VL",
    category: "Sedan",
    price: 1000,
    pricePerDay: 1000,
    rating: 4.6,
    reviewCount: 22,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    luggageCapacity: "3 Large Bags",
    description: "Modern eco sedan providing class-leading rear legroom and efficient turbocharged performance.",
    mainImage: "/images/cars/nissan-almera.jpg",
    galleryImages: [
      "/images/cars/nissan-almera.jpg",
      "/images/cars/nissan-almera-rear.jpg"
    ],
    availableLocations: [
      "Bangkok (BKK) Suvarnabhumi Airport",
      "Don Mueang Airport (DMK)",
      "Pattaya / U-Tapao Airport (UTP)",
      "Rayong City Center",
      "Hua Hin Airport (HHQ)"
    ],
    isAvailable: true
  },
  {
    _id: "6aae322ab765e237f6e50d0a",
    slug: "toyota-majesty",
    brand: "Toyota",
    model: "Majesty",
    name: "Toyota Majesty 2.8 Grande Premium",
    category: "MPV",
    price: 3500,
    pricePerDay: 3500,
    rating: 4.9,
    reviewCount: 45,
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    luggageCapacity: "5 Large Bags",
    description: "Premium VIP passenger van with plush captain seats and whisper-quiet ride for family and executive touring.",
    mainImage: "/images/cars/toyota-majesty.jpg",
    galleryImages: [
      "/images/cars/toyota-majesty.jpg",
      "/images/cars/toyota-majesty-interior.jpg"
    ],
    availableLocations: [
      "Bangkok (BKK) Suvarnabhumi Airport",
      "Phuket International Airport (HKT)",
      "Chiang Mai International Airport (CNX)",
      "Pattaya / U-Tapao Airport (UTP)",
      "Nakhon Ratchasima / Khao Yai"
    ],
    isAvailable: true
  },
  {
    _id: "6aae322ab765e237f6e50d0b",
    slug: "bmw-5-series",
    brand: "BMW",
    model: "530e",
    name: "BMW 530e M Sport",
    category: "Luxury",
    price: 4800,
    pricePerDay: 4800,
    rating: 5.0,
    reviewCount: 31,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Hybrid",
    luggageCapacity: "3 Large Bags",
    description: "High-end executive saloon pairing plug-in hybrid dynamics with unparalleled luxury and prestige.",
    mainImage: "/images/cars/bmw-5-series.jpg",
    galleryImages: [
      "/images/cars/bmw-5-series.jpg",
      "/images/cars/bmw-5-series-interior.jpg"
    ],
    availableLocations: [
      "Bangkok (BKK) Suvarnabhumi Airport",
      "Phuket International Airport (HKT)",
      "Hua Hin Airport (HHQ)",
      "Pattaya / U-Tapao Airport (UTP)"
    ],
    isAvailable: true
  },
  {
    _id: "6aae322ab765e237f6e50d0c",
    slug: "byd-atto-3",
    brand: "BYD",
    model: "Atto 3",
    name: "BYD Atto 3 Extended Range",
    category: "SUV",
    price: 1600,
    pricePerDay: 1600,
    rating: 4.8,
    reviewCount: 64,
    seats: 5,
    transmission: "Automatic",
    fuelType: "Electric",
    luggageCapacity: "3 Large Bags",
    description: "All-electric smart crossover offering zero-emission travel, cutting-edge infotainment and great range.",
    mainImage: "/images/cars/byd-atto-3.jpg",
    galleryImages: [
      "/images/cars/byd-atto-3.jpg",
      "/images/cars/byd-atto-3-interior.jpg"
    ],
    availableLocations: [
      "Bangkok (BKK) Suvarnabhumi Airport",
      "Don Mueang Airport (DMK)",
      "Chiang Mai International Airport (CNX)",
      "Khon Kaen Airport (KKC)",
      "Trat Airport (TDX) / Koh Chang"
    ],
    isAvailable: true
  }
];

/**
 * ฟังก์ชัน normalizeCar (รักษา interface เดิมไว้ ไม่ดัดแปลง URL รูปภาพจาก API)
 */
export const normalizeCar = (car) => car;

/**
 * ดึงรายการรถเช่าทั้งหมดจาก API
 */
export const getCars = async () => {
  try {
    const response = await api.get("/cars", { timeout: 10000 });
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    return FALLBACK_CARS;
  } catch (error) {
    console.warn("⚠️ [CarService] ไม่สามารถดึงข้อมูลรถจาก API ได้ ใช้ Fallback ข้อมูลสำรอง:", error.message);
    return FALLBACK_CARS;
  }
};

/**
 * ดึงข้อมูลรถเช่ารายคันตาม ID หรือ Slug
 */
export const getCarById = async (id) => {
  try {
    const response = await api.get(`/cars/${id}`, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.warn(`⚠️ [CarService] ไม่พบรถ id/slug "${id}" จาก API ค้นหาใน Fallback:`, error.message);
    const found = FALLBACK_CARS.find(c => c._id === id || c.slug === id || c.id === id);
    if (found) return found;
    throw error;
  }
};

export default {
  getCars,
  getCarById,
  normalizeCar
};
