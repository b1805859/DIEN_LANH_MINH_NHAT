import { BookingForm } from '@/components/forms/booking-form';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Đặt lịch dịch vụ điện lạnh Cần Thơ',
  description: 'Đặt lịch sửa chữa, vệ sinh, nạp gas, lắp đặt máy lạnh và dịch vụ điện nước.',
  path: '/booking',
});

export default function BookingPage() {
  return (
    <main className="container max-w-3xl py-10 sm:py-12">
      <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Đặt lịch dịch vụ</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-700">
        Chọn dịch vụ, địa chỉ, thời gian và gửi thông tin hẹn lịch.
      </p>
      <div className="mt-8 rounded-md border bg-white p-4 sm:p-5">
        <BookingForm />
      </div>
    </main>
  );
}
