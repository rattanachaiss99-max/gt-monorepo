// ตัวช่วยหารูปที่พักจาก local assets ที่ใช้ร่วมกัน
// (เดิมโค้ด glob + logic ค้นหานี้ซ้ำกันอยู่ใน AccommodationCard,
// AccommodationDetail, BrowseByProperty และ GetInspired)
const accommodationImages = import.meta.glob(
  '../../../assets/accommodations/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
);

export const ACCOMMODATION_ASSET_KEYS = [
  'siam-heritage-sanctuary',
  'skyline-executive-suites',
  'ayutthaya-heritage-riverside',
  'river-kwai-jungle-raft',
  'hua-hin-royal-beachfront',
  'four-seasons-samui-cove',
  'railay-cliff-beach-villas',
  'amanpuri-retreat-villas',
  'lanna-riverside-boutique',
  'emerald-jungle-retreat',
  'doi-mist-mountain-lodge',
  'khaoyai-vineyard-villas',
  'mekong-riverside-retreat',
  'isan-ricefield-homestay',
];

const CATEGORY_FALLBACK = {
  'Luxury Resort': 'lanna-riverside-boutique',
  'Private Villa': 'amanpuri-retreat-villas',
  'Luxury Hotel': 'skyline-executive-suites',
  'Bed & Breakfast': 'doi-mist-mountain-lodge',
  'Guest House': 'isan-ricefield-homestay',
  'Budget Hotel': 'ayutthaya-heritage-riverside',
};

/** แปลง asset key ที่กำหนดไว้ (เช่น 'siam-heritage-sanctuary') เป็น URL รูปที่ import มาแล้ว */
export function getAssetUrl(name) {
  if (!name) return '';
  return (
    accommodationImages[`../../../assets/accommodations/${name}.jpg`] ||
    accommodationImages[`../../../assets/accommodations/${name}.png`] ||
    accommodationImages[`../../../assets/accommodations/${name}.webp`] ||
    ''
  );
}

/** หารูปในเครื่องที่ตรงกับที่พักมากที่สุด (จับคู่ด้วย id, name หรือ category) */
export function getImageForAccommodation(accommodation) {
  if (!accommodation) return null;
  const id = accommodation.id || '';

  // 1. จับคู่ ID ตรงตัว
  const directMatch = getAssetUrl(id);
  if (directMatch) return directMatch;

  // 2. จับคู่ ID บางส่วน
  const matchedKey = ACCOMMODATION_ASSET_KEYS.find(
    (k) =>
      id.includes(k) ||
      (accommodation.name && accommodation.name.toLowerCase().includes(k.replace(/-/g, ' ')))
  );
  if (matchedKey) return getAssetUrl(matchedKey);

  // 3. Fallback ตามหมวดหมู่
  const catKey = CATEGORY_FALLBACK[accommodation.category];
  if (catKey && getAssetUrl(catKey)) return getAssetUrl(catKey);

  // 4. Fallback แบบกำหนดแน่นอนจาก _id ที่เป็นตัวเลข หรือความยาวของ id
  const numericId = typeof accommodation._id === 'number' ? accommodation._id : (id.length || 0);
  const fallbackKey = ACCOMMODATION_ASSET_KEYS[Math.abs(numericId) % ACCOMMODATION_ASSET_KEYS.length];
  return getAssetUrl(fallbackKey);
}
