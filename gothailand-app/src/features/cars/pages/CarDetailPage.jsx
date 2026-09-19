import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCarById } from '../services/carService';
import CarDetail from '../components/CarDetail';
import DetailPageShell from '../../../components/common/DetailPageShell';
import { useDetailFetch } from '../../../hooks/useDetailFetch';

/**
 * CarDetailPage (Feature Page)
 * -------------------------------------------------------------
 * หน้ารายละเอียดรถเช่าท่องเที่ยวหลักของระบบ:
 * - ดึงข้อมูลรถตาม ID หรือ Slug ผ่าน carService
 * - แสดงผล Breadcrumbs นำทาง และปุ่มย้อนกลับตาม Design System
 * - รวมคอมโพเนนต์การแสดงผล CarDetail พร้อมระบบส่งต่อไปยัง CarCheckout
 */
export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { entity: car, loading, error } = useDetailFetch({
    initialEntity: location?.state?.car,
    id,
    fetchFn: getCarById,
    errorLogLabel: 'Failed to load car details:',
    errorText: 'ไม่พบข้อมูลรถยนต์ที่เลือก หรือระบบเครือข่ายขัดข้อง',
  });

  return (
    <DetailPageShell
      loading={loading}
      error={error}
      entity={car}
      loadingText="กำลังโหลดข้อมูลรถเช่า..."
      notFoundTitle="ไม่พบข้อมูลรถยนต์"
      notFoundText="ไม่พบรถยนต์ที่คุณกำลังค้นหา อาจถูกนำออกจากระบบหรือรหัสรถไม่ถูกต้อง"
      notFoundBackLabel="← กลับไปหน้ารายการรถทั้งหมด"
      breadcrumbListPath="/cars"
      breadcrumbListLabel="รถเช่าท่องเที่ยว"
      breadcrumbBackLabel="ย้อนกลับไปหน้ารวมรถ"
      onBack={() => navigate('/cars')}
      entityName={car?.name}
    >
      <CarDetail car={car} />
    </DetailPageShell>
  );
}
