import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getGuideById } from '../services/guideService';
import GuideDetail from '../components/GuideDetail';
import DetailPageShell from '../../../components/common/DetailPageShell';
import { useDetailFetch } from '../../../hooks/useDetailFetch';

/**
 * GuideDetailPage (Feature Page)
 * -------------------------------------------------------------
 * หน้ารายละเอียดมัคคุเทศก์ / ไกด์นำเที่ยว:
 * - รับพารามิเตอร์ URL ผ่าน ID หรือชื่อไกด์ (เช่น /guides/6aae496bf3c07d4e0406425c)
 * - ดึงข้อมูลไกด์ผ่าน guideService พร้อมระบบ Instant State
 * - แสดงผล Breadcrumbs นำทาง และปุ่มย้อนกลับตาม Design System
 * - แสดงผลคอมโพเนนต์ GuideDetail (ประวัติ, ใบอนุญาต, พื้นที่บริการ, specialized services, widget จอง)
 * - รองรับ Scroll-to-top อัตโนมัติ (ผ่าน <ScrollToTop /> กลางของแอป)
 */
export default function GuideDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { entity: guide, loading, error } = useDetailFetch({
    initialEntity: location?.state?.guide,
    id,
    fetchFn: getGuideById,
    errorLogLabel: 'Failed to load guide details:',
    errorText: 'ไม่พบข้อมูลมัคคุเทศก์ที่คุณเลือก หรือระบบเครือข่ายขัดข้อง',
  });

  return (
    <DetailPageShell
      loading={loading}
      error={error}
      entity={guide}
      loadingText="กำลังโหลดข้อมูลมัคคุเทศก์..."
      notFoundTitle="ไม่พบข้อมูลมัคคุเทศก์"
      notFoundText="ไม่พบมัคคุเทศก์ที่คุณกำลังค้นหา อาจถูกนำออกจากระบบหรือรหัสไกด์ไม่ถูกต้อง"
      notFoundBackLabel="← กลับไปหน้ารวมไกด์ทั้งหมด"
      breadcrumbListPath="/guides"
      breadcrumbListLabel="ไกด์นำเที่ยว"
      breadcrumbBackLabel="ย้อนกลับไปหน้ารวมไกด์"
      onBack={() => navigate('/guides')}
      entityName={guide?.name}
    >
      <GuideDetail guide={guide} />
    </DetailPageShell>
  );
}
