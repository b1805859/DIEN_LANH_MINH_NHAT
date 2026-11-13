export type ServiceDetail = {
  introduction?: string;
  needsTitle?: string;
  procedureTitle?: string;
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
  'thao-di-doi-may-lanh': {
    introduction:
      'Bạn cho biết model máy, địa chỉ tháo máy và nơi chuyển đến nếu cần di dời. Minh Nhật khảo sát điều kiện tiếp cận, thống nhất hạng mục tháo, vận chuyển và lắp lại nếu có, rồi báo giá trước khi thực hiện.',
    needsTitle: 'Khi nào cần tháo dỡ, di dời máy lạnh?',
    procedureTitle: 'Quy trình tháo dỡ và di dời',
    symptoms: [
      'Tháo máy khi chuyển nhà hoặc trả mặt bằng',
      'Chuyển máy sang phòng khác hoặc địa chỉ mới',
      'Di chuyển dàn nóng, dàn lạnh để sửa chữa nhà',
      'Tháo máy để cất giữ hoặc thay thiết bị khác',
    ],
    inspection:
      'Kiểm tra hoạt động và tình trạng máy trước khi tháo; khảo sát vị trí, đường ống và nguồn điện. Kỹ thuật viên xử lý môi chất theo tình trạng thiết bị, ngắt nguồn, tháo các bộ phận và bảo vệ đầu ống, dây điện, thiết bị. Nếu có di dời, thống nhất cách vận chuyển; phần lắp lại và vật tư tại vị trí mới được khảo sát, báo giá riêng theo phạm vi công việc.',
    faqs: [
      {
        question: 'Có nhận tháo máy mà chưa lắp lại ngay không?',
        answer:
          'Có. Bạn cho biết cần tháo để cất giữ hay chuyển đến nơi khác. Kỹ thuật viên kiểm tra, thống nhất cách bảo vệ thiết bị và bàn giao các bộ phận sau khi tháo.',
      },
      {
        question: 'Di dời máy lạnh có bao gồm lắp lại không?',
        answer:
          'Phạm vi công việc được xác nhận trước khi làm. Bạn có thể yêu cầu tháo và di chuyển, hoặc thêm phần lắp lại tại nơi mới. Vật tư, đường ống và điều kiện tiếp cận tại nơi mới cần được khảo sát để báo giá.',
      },
      {
        question: 'Cần cung cấp thông tin gì trước khi tháo máy?',
        answer:
          'Gửi ảnh dàn nóng, dàn lạnh, model máy, thông tin tầng lắp đặt và địa chỉ chuyển đến nếu có. Những thông tin này giúp chuẩn bị dụng cụ và phương án tiếp cận phù hợp.',
      },
    ],
  },
  'lap-dat-may-lanh': {
    introduction:
      'Bạn gửi model máy, công suất và ảnh vị trí dự kiến. Minh Nhật khảo sát nơi đặt dàn nóng, dàn lạnh, đường ống và nguồn điện; trao đổi vật tư, hạng mục thi công và chi phí trước khi lắp.',
    needsTitle: 'Các nhu cầu lắp đặt máy lạnh',
    procedureTitle: 'Quy trình lắp đặt và chạy thử',
    symptoms: [
      'Lắp máy lạnh mới cho nhà ở hoặc cửa hàng',
      'Lắp lại máy đã sử dụng tại vị trí mới',
      'Thay máy lạnh cũ bằng thiết bị khác',
      'Khảo sát vị trí dàn nóng, dàn lạnh và đường ống',
    ],
    inspection:
      'Khảo sát vị trí, khả năng chịu tải của giá đỡ, đường ống, thoát nước và nguồn cấp phù hợp với thiết bị. Thống nhất vật tư rồi lắp dàn nóng, dàn lạnh và các đấu nối; kiểm tra độ kín, hút chân không theo yêu cầu lắp đặt của máy, kiểm tra thoát nước và chạy thử. Hướng dẫn sử dụng, bàn giao sau khi kiểm tra vận hành.',
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
      {
        question: 'Có lắp lại máy lạnh đã qua sử dụng không?',
        answer:
          'Có thể lắp lại sau khi kiểm tra tình trạng máy và điều kiện tại nơi lắp. Kỹ thuật viên trao đổi riêng các vấn đề cần xử lý và vật tư cần bổ sung trước khi thực hiện.',
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
  've-sinh-may-giat': {
    introduction:
      'Bạn gửi model máy, loại cửa trên hoặc cửa trước và tình trạng cần vệ sinh. Minh Nhật kiểm tra máy, trao đổi phạm vi tháo lắp và báo giá trước khi làm sạch; chạy thử cấp, xả nước sau khi hoàn tất.',
    needsTitle: 'Khi nào cần vệ sinh máy giặt?',
    procedureTitle: 'Quy trình vệ sinh máy giặt',
    symptoms: [
      'Lồng giặt có mùi hoặc xuất hiện cặn bẩn',
      'Quần áo bám cặn sau khi giặt',
      'Gioăng cửa, khay nước giặt hoặc lọc cặn bị bẩn',
      'Máy cần làm sạch định kỳ theo tình trạng sử dụng',
    ],
    inspection:
      'Kiểm tra hoạt động của máy và khu vực đặt máy, thống nhất mức độ tháo lắp phù hợp với model. Ngắt nguồn, che chắn khu vực làm việc, làm sạch lồng giặt cùng các bộ phận tiếp cận được như khay chứa, gioăng cửa và lọc cặn. Lắp lại, kiểm tra độ kín, cấp và xả nước, chạy thử rồi bàn giao.',
    faqs: [
      {
        question: 'Có vệ sinh máy giặt cửa trên và cửa trước không?',
        answer:
          'Minh Nhật nhận kiểm tra và vệ sinh cả hai loại. Bạn gửi model hoặc ảnh nhãn máy để xác nhận phạm vi hỗ trợ và cách tháo lắp phù hợp trước khi hẹn lịch.',
      },
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
