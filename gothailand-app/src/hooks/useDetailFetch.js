import { useState, useEffect } from 'react';

/**
 * รูปแบบการ fetch-by-id-or-slug ที่ใช้ร่วมกันระหว่างหน้า *DetailPage
 * ของที่พัก/รถ/ไกด์: ใช้ข้อมูลจาก router `state` ก่อนถ้ามี (มาจากการคลิกการ์ด)
 * ถ้าไม่มีให้ fetch ด้วย id/slug พร้อมติดตามสถานะ loading/error
 */
export function useDetailFetch({ initialEntity, id, fetchFn, errorLogLabel, errorText }) {
  const [entity, setEntity] = useState(initialEntity || null);
  const [loading, setLoading] = useState(!initialEntity && !!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!entity && id) {
      fetchFn(id)
        .then((fetched) => {
          if (active && fetched) setEntity(fetched);
        })
        .catch((err) => {
          if (active) {
            console.error(errorLogLabel, err);
            setError(errorText);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, entity]);

  return { entity, loading, error };
}
