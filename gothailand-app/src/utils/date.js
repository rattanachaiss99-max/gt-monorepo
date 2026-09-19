// Helper จัดการวันที่ที่ใช้ร่วมกันระหว่าง widget ค้นหา/จองของที่พัก รถ และไกด์

/**
 * คืนค่าช่วงวันที่เริ่มต้นโดยอิงจากวันนี้ เป็น string รูปแบบ 'YYYY-MM-DD'
 * เช่น getDefaultDateRange(1, 2) -> { start: พรุ่งนี้, end: มะรืนนี้ }
 */
export function getDefaultDateRange(startOffsetDays = 1, endOffsetDays = 2) {
  const today = new Date();
  const toISODate = (offsetDays) =>
    new Date(today.getTime() + 86400000 * offsetDays).toISOString().split('T')[0];
  return { start: toISODate(startOffsetDays), end: toISODate(endOffsetDays) };
}

/** จัดรูปแบบ string 'YYYY-MM-DD' ให้อ่านง่ายเช่น "Fri, Sep 18" ถ้าแปลงไม่ได้จะคืนค่าเดิม */
export function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** จำนวนวันเต็มระหว่างสอง string 'YYYY-MM-DD' อย่างน้อยที่สุด 1 วัน */
export function calculateDateSpan(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 1;
  try {
    const d1 = new Date(startDateStr);
    const d2 = new Date(endDateStr);
    const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / 86400000);
    return diffDays > 0 ? diffDays : 1;
  } catch {
    return 1;
  }
}
