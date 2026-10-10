export type ServiceDetail = {
  symptoms: string[];
  inspection: string;
  faqs: Array<{ question: string; answer: string }>;
};

// Service-specific editorial content; no prices or unverified performance claims.
export const serviceDetails: Record<string, ServiceDetail> = {
  'sua-may-lanh': {
    symptoms: [
      'Máy lạnh không lạnh hoặc lạnh yếu',
      'Dàn lạnh chảy nước',
      'Máy báo mã lỗi',
      'Máy kêu lớn, rung bất thường',
      'Máy tự ngắt khi đang chạy',
    ],
    inspection:
      'Ghi nhận mã lỗi và thời điểm xảy ra, kiểm tra nguồn cấp, luồng gió, đường thoát nước và hoạt động dàn nóng. Kỹ thuật viên xác định nguyên nhân, trao đổi phương án sửa rồi chạy thử sau khi hoàn tất.',
    faqs: [
      {
        question: 'Máy lạnh không lạnh có phải lúc nào cũng thiếu gas?',
        answer:
          'Không. Lưới lọc bẩn, luồng gió bị cản, cài đặt hoặc lỗi linh kiện đều có thể ảnh hưởng khả năng làm lạnh. Cần kiểm tra thực tế trước khi quyết định nạp gas.',
      },
      {
        question: 'Cần cung cấp gì khi máy lạnh báo lỗi hoặc tự ngắt?',
        answer:
          'Bạn có thể ghi lại mã lỗi, nhãn máy và thời điểm máy tự ngắt. Những thông tin này giúp kỹ thuật viên chuẩn bị kiểm tra; không cần tự tháo vỏ máy.',
      },
      {
        question: 'Máy lạnh chảy nước hoặc kêu lớn được kiểm tra thế nào?',
        answer:
          'Kỹ thuật viên kiểm tra đường thoát nước, tình trạng dàn lạnh, quạt và vị trí lắp đặt để phân biệt lỗi vệ sinh, lắp đặt hay linh kiện, sau đó trao đổi hướng xử lý.',
      },
    ],
  },
  've-sinh-may-lanh': {
    symptoms: ['Gió yếu, lưới lọc bám bụi', 'Có mùi khi bật máy', 'Dàn lạnh cần làm sạch định kỳ'],
    inspection:
      'Kiểm tra vận hành trước khi vệ sinh, che chắn khu vực làm việc, làm sạch các bộ phận phù hợp và kiểm tra thoát nước, luồng gió sau khi hoàn tất.',
    faqs: [
      {
        question: 'Vệ sinh máy lạnh gồm những hạng mục nào?',
        answer:
          'Hạng mục được thống nhất sau khi kiểm tra, thường gồm lưới lọc, dàn trao đổi nhiệt, quạt và đường thoát nước. Khả năng tiếp cận dàn nóng được khảo sát riêng.',
      },
      {
        question: 'Vệ sinh có xử lý được mọi lỗi không lạnh không?',
        answer:
          'Không. Vệ sinh phù hợp khi bụi bẩn cản luồng gió; lỗi điện, linh kiện hoặc môi chất cần được chẩn đoán riêng.',
      },
    ],
  },
  'thao-lap-may-lanh': {
    symptoms: ['Lắp máy mới', 'Di dời máy sang phòng khác', 'Tháo máy khi chuyển nhà'],
    inspection:
      'Khảo sát vị trí dàn nóng, dàn lạnh, đường ống và nguồn cấp. Thống nhất phương án thi công, kiểm tra độ kín và chạy thử trước bàn giao.',
    faqs: [
      {
        question: 'Có thể dùng lại đường ống cũ không?',
        answer:
          'Cần kiểm tra kích thước, tình trạng và mức độ phù hợp với máy trước khi quyết định. Kỹ thuật viên sẽ trao đổi những vật tư có thể dùng lại.',
      },
      {
        question: 'Cần chuẩn bị gì trước khi lắp đặt?',
        answer:
          'Cung cấp model máy, ảnh vị trí dự kiến và thông tin tầng lắp đặt. Dọn lối tiếp cận để kỹ thuật viên khảo sát và bảo vệ khu vực thi công.',
      },
    ],
  },
  'sua-may-giat': {
    symptoms: [
      'Máy không vắt',
      'Không cấp hoặc không xả nước',
      'Máy rung, kêu lớn',
      'Hiển thị mã lỗi',
    ],
    inspection:
      'Ghi nhận chương trình đang chạy và mã lỗi, kiểm tra cấp/xả nước, khóa cửa, cân bằng máy và bộ phận liên quan trước khi đề xuất sửa chữa.',
    faqs: [
      {
        question: 'Máy giặt không vắt cần kiểm tra gì?',
        answer:
          'Kỹ thuật viên kiểm tra tải đồ, khả năng xả nước, khóa cửa và hệ thống điều khiển. Không thể xác định linh kiện cần thay chỉ từ dấu hiệu không vắt.',
      },
      {
        question: 'Máy rung mạnh có nhất thiết phải thay bộ giảm xóc?',
        answer:
          'Không. Vị trí đặt máy, cân bằng chân máy và tải đồ cũng có thể gây rung. Cần kiểm tra trước khi đề xuất thay linh kiện.',
      },
    ],
  },
  'sua-tu-lanh': {
    symptoms: [
      'Ngăn mát yếu lạnh',
      'Ngăn đông không đông đá',
      'Tủ rò nước',
      'Tủ phát tiếng ồn bất thường',
    ],
    inspection:
      'Kiểm tra nhiệt độ các ngăn, độ kín cửa, thông gió, thoát nước và chu trình làm lạnh để xác định nhóm nguyên nhân.',
    faqs: [
      {
        question: 'Tủ lạnh yếu lạnh có phải hỏng máy nén?',
        answer:
          'Không nhất thiết. Cửa không kín, đường gió bị cản hoặc các bộ phận điều khiển cũng có thể gây yếu lạnh. Kết luận cần dựa trên kiểm tra.',
      },
      {
        question: 'Cần gửi thông tin gì khi yêu cầu sửa tủ lạnh?',
        answer:
          'Gửi model, ảnh nhãn thiết bị, ngăn nào yếu lạnh và mô tả tiếng ồn hoặc vị trí nước rò. Kỹ thuật viên sẽ trao đổi lịch kiểm tra phù hợp.',
      },
    ],
  },
  'sua-dien-nuoc': {
    symptoms: [
      'Rò rỉ đường nước',
      'Vòi hoặc van hoạt động bất thường',
      'Ổ cắm, công tắc cần kiểm tra',
      'Lắp hoặc thay thiết bị dân dụng',
    ],
    inspection:
      'Khảo sát vị trí và tình trạng đường điện nước, cô lập khu vực cần thi công, thống nhất vật tư và kiểm tra lại sau khi sửa.',
    faqs: [
      {
        question: 'Có hỗ trợ tìm vị trí nước rò không?',
        answer:
          'Kỹ thuật viên khảo sát biểu hiện rò, các điểm nối và đường ống có thể tiếp cận để trao đổi cách kiểm tra phù hợp với hiện trạng.',
      },
      {
        question: 'Có thể báo phương án chỉ qua ảnh không?',
        answer:
          'Ảnh giúp nhận diện thiết bị và chuẩn bị kiểm tra. Các hạng mục liên quan đường âm tường hoặc nguồn điện cần khảo sát thực tế trước khi thống nhất.',
      },
    ],
  },
  'nap-gas-may-lanh': {
    symptoms: [
      'Máy lạnh yếu sau khi được kiểm tra',
      'Nghi ngờ rò rỉ môi chất',
      'Cần kiểm tra sau khi tháo lắp',
    ],
    inspection:
      'Xác định loại môi chất theo nhãn máy, đo kiểm vận hành và kiểm tra rò rỉ trước khi thống nhất việc bổ sung môi chất.',
    faqs: [
      {
        question: 'Có nên nạp gas định kỳ dù máy vẫn lạnh tốt?',
        answer:
          'Không nên quyết định chỉ theo thời gian. Cần dựa trên tình trạng vận hành và kết quả kiểm tra của kỹ thuật viên.',
      },
      {
        question: 'Nếu hệ thống rò rỉ thì chỉ nạp thêm gas có đủ không?',
        answer:
          'Cần xác định và xử lý nguyên nhân rò rỉ trước. Bổ sung môi chất đơn thuần không giải quyết được điểm rò.',
      },
    ],
  },
  've-sinh-may-giat': {
    symptoms: ['Lồng giặt có mùi', 'Cặn bám trên quần áo', 'Gioăng cửa hoặc lọc cặn cần vệ sinh'],
    inspection:
      'Kiểm tra tình trạng máy, thống nhất mức độ tháo lắp, làm sạch lồng giặt và bộ phận phù hợp rồi kiểm tra cấp/xả nước và chạy thử.',
    faqs: [
      {
        question: 'Có phải máy nào cũng cần tháo lồng giặt?',
        answer:
          'Mức độ tháo lắp phụ thuộc thiết kế, tình trạng máy và hạng mục đã thống nhất. Kỹ thuật viên sẽ khảo sát trước khi thực hiện.',
      },
      {
        question: 'Chế độ tự vệ sinh có thay thế mọi công việc vệ sinh không?',
        answer:
          'Chế độ tự vệ sinh hỗ trợ chăm sóc lồng giặt theo hướng dẫn hãng. Gioăng, khay chứa và lọc cặn vẫn cần được kiểm tra phù hợp.',
      },
    ],
  },
  'sua-lap-may-nuoc-uong-nong-lanh': {
    symptoms: [
      'Máy không làm nóng hoặc lạnh',
      'Nước rò tại vòi hoặc bình chứa',
      'Cần lắp đặt hoặc di dời máy',
    ],
    inspection:
      'Kiểm tra nguồn cấp, bình chứa, vòi và chức năng nóng/lạnh; trao đổi phương án sửa, vệ sinh hoặc lắp đặt theo model thiết bị.',
    faqs: [
      {
        question: 'Máy có điện nhưng nước không lạnh cần kiểm tra gì?',
        answer:
          'Kỹ thuật viên kiểm tra cài đặt, thông gió và cụm làm lạnh theo cấu tạo thiết bị. Cần biết model để chuẩn bị kiểm tra phù hợp.',
      },
      {
        question: 'Có hỗ trợ máy nước nóng lạnh có bộ lọc không?',
        answer:
          'Hãy gửi model và ảnh thiết bị để Minh Nhật xác nhận phạm vi hỗ trợ, loại linh kiện và phương án trước khi hẹn lịch.',
      },
    ],
  },
  'sua-lap-may-nuoc-nong-lanh-tam': {
    symptoms: [
      'Nước không nóng hoặc nóng không ổn định',
      'Nước rò tại thiết bị',
      'Thiết bị chống giật báo bất thường',
    ],
    inspection:
      'Kiểm tra nguồn cấp, áp lực nước, đấu nối và bộ phận bảo vệ theo thiết kế của máy trước khi đề xuất sửa hoặc lắp đặt.',
    faqs: [
      {
        question: 'Cần cung cấp gì để đặt lịch sửa máy nước nóng?',
        answer:
          'Gửi model, loại máy trực tiếp hoặc gián tiếp và mô tả tình trạng. Không cần tự mở vỏ hay thử lại nhiều lần khi máy báo bất thường.',
      },
      {
        question: 'Lắp máy mới có cần kiểm tra nguồn điện và nước không?',
        answer:
          'Có. Kỹ thuật viên cần khảo sát điều kiện lắp đặt và các bộ phận bảo vệ trước khi thống nhất phương án phù hợp với thiết bị.',
      },
    ],
  },
};
