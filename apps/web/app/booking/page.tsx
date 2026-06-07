import { BookingForm } from '@/components/forms/booking-form';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Đặt lịch dịch vụ điện lạnh Cần Thơ',
  description: 'Đặt lịch sửa chữa, vệ sinh, nạp gas, lắp đặt máy lạnh và dịch vụ điện nước.',
  path: '/booking',
});

export default function BookingPage() {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="text-4xl font-bold">Đặt lịch dịch vụ</h1>
      <p className="mt-4 text-slate-700">Chọn dịch vụ, khu vực, thời gian và gửi thông tin hẹn lịch.</p>
      <div className="mt-8 rounded-md border p-5">
        <BookingForm />
      </div>
    </main>
  );
}

