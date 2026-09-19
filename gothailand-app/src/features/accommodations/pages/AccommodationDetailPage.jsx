import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getAccommodationById } from '../services/accommodationService';
import AccommodationDetail from '../components/AccommodationDetail';
import DetailPageShell from '../../../components/common/DetailPageShell';
import { useDetailFetch } from '../../../hooks/useDetailFetch';

/**
 * AccommodationDetailPage (Feature Page)
 * -------------------------------------------------------------
 * หน้ารายละเอียดที่พักท่องเที่ยวหลักของระบบ:
 * - รับพารามิเตอร์ URL ผ่าน Slug (เช่น /accommodations/siam-heritage-sanctuary)
 * - ดึงข้อมูลที่พักผ่าน accommodationService
 * - แสดง Breadcrumbs นำทาง และปุ่มย้อนกลับตาม Design System ของ Yok
 * - แสดงผลคอมโพเนนต์ AccommodationDetail (แกลเลอรี สเปกห้อง และการจอง)
 */
export default function AccommodationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { entity: accommodation, loading, error } = useDetailFetch({
    initialEntity: location?.state?.accommodation,
    id,
    fetchFn: getAccommodationById,
    errorLogLabel: 'Failed to load accommodation details:',
    errorText: 'ไม่พบข้อมูลที่พักที่คุณเลือก หรือระบบเครือข่ายขัดข้อง',
  });

  return (
    <DetailPageShell
      loading={loading}
      error={error}
      entity={accommodation}
      loadingText="กำลังโหลดข้อมูลที่พัก..."
      notFoundTitle="ไม่พบข้อมูลที่พัก"
      notFoundText="ไม่พบที่พักที่คุณกำลังค้นหา อาจถูกนำออกจากระบบหรือรหัสที่พักไม่ถูกต้อง"
      notFoundBackLabel="← กลับไปหน้ารวมที่พักทั้งหมด"
      breadcrumbListPath="/accommodations"
      breadcrumbListLabel="ที่พักท่องเที่ยว"
      breadcrumbBackLabel="ย้อนกลับไปหน้ารวมที่พัก"
      onBack={() => navigate('/accommodations')}
      entityName={accommodation?.name}
    >
      <AccommodationDetail accommodation={accommodation} />
    </DetailPageShell>
  );
}
