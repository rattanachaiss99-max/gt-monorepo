import AccommodationDemo from "../../../components/36-yok/AccommodationDemo";

export default function AccommodationPage() {
  return (
    <section>
      {/* ส่วนหัวของหน้า */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          🏨 บริการที่พักท่องเที่ยว
        </h1>
        {/* <p className="text-sm text-slate-500 mt-1">
          text-2
        </p> */}
      </div>

      <AccommodationDemo />
    </section>
  );
}
