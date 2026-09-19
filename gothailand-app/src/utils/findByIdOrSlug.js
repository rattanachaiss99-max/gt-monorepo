// ฟังก์ชันค้นหาที่ใช้ร่วมกันระหว่าง service ของที่พักและรถ เพื่อค้นหา
// route param (slug หรือ id) จาก list ที่โหลดมาแล้ว โดยไม่สนตัวพิมพ์เล็ก-ใหญ่
export function findByIdOrSlug(list, idOrSlug) {
  const normalized = String(idOrSlug).toLowerCase().trim();
  return (list || []).find(
    (item) =>
      (item.slug && String(item.slug).toLowerCase() === normalized) ||
      (item.id && String(item.id).toLowerCase() === normalized) ||
      String(item._id).toLowerCase() === normalized
  );
}
