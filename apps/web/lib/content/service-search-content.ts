export type ServiceSearchContent = {
  preparation: string;
  costFactors: string;
  related: string[];
};

// Scope and estimate inputs, not unverified price promises or warranty periods.
export const serviceSearchContent: Record<string, ServiceSearchContent> = {
  'sua-may-lanh': {
    preparation: 'Gửi model, mã lỗi và mô tả máy không lạnh, chảy nước hay tự ngắt. Cho biết lần sửa gần nhất và chụp vị trí dàn nóng để chuẩn bị kiểm tra tại nhà.',
    costFactors: 'Chi phí phụ thuộc nguyên nhân, linh kiện, công kiểm tra và điều kiện tiếp cận. Hỏi rõ phí khảo sát nếu chưa đồng ý sửa; vệ sinh, xử lý rò và nạp gas là các hạng mục cần được phân biệt trong báo giá.',
    related: ['ve-sinh-may-lanh'],
  },
  've-sinh-may-lanh': {
    preparation: 'Cho biết số lượng máy, model, vị trí dàn nóng và thời điểm vệ sinh gần nhất. Dọn đồ khỏi khu vực bên dưới dàn lạnh; thông báo trước nếu máy đang có lỗi hoặc chảy nước.',
    costFactors: 'Loại máy, số lượng, mức độ bẩn, khả năng tiếp cận dàn nóng và phạm vi tháo lắp ảnh hưởng báo giá. Cần xác nhận làm sạch bộ phận nào, kiểm tra thoát nước ra sao và có khoản tiếp cận vị trí khó hay không.',
    related: ['sua-may-lanh', 'lap-dat-may-lanh'],
  },
  'lap-dat-may-lanh': {
    preparation: 'Gửi công suất, model, ảnh nơi đặt dàn lạnh và dàn nóng. Cho biết đường ống có sẵn hay làm mới, tầng lắp đặt, nguồn điện và lối tiếp cận.',
    costFactors: 'Cần tách công lắp với ống đồng, bảo ôn, dây điện, ống thoát nước, giá đỡ và vật tư khác. Chiều dài tuyến ống, khoan tường và phương án làm việc trên cao cần khảo sát trước khi thống nhất.',
    related: ['thao-di-doi-may-lanh', 'sua-may-lanh'],
  },
  'thao-di-doi-may-lanh': {
    preparation: 'Cung cấp địa chỉ tháo và nơi lắp lại nếu có, model, tầng lắp đặt cùng ảnh hai vị trí. Thông báo tình trạng máy trước khi tháo và nhu cầu vận chuyển hay cất giữ.',
    costFactors: 'Tháo máy, bảo vệ thiết bị, vận chuyển và lắp lại là các phần cần xác nhận riêng. Vật tư dùng lại được hay phải thay phụ thuộc tình trạng và yêu cầu tại nơi lắp mới.',
    related: ['lap-dat-may-lanh', 've-sinh-may-lanh'],
  },
  'sua-may-giat': {
    preparation: 'Gửi model cửa trên/cửa trước, mã lỗi, chương trình xảy ra lỗi và tình trạng cấp hoặc xả nước. Cho biết máy có vừa di chuyển hoặc thay đổi vị trí đặt không.',
    costFactors: 'Nguyên nhân điện, cơ, cấp/xả nước và điều khiển có phạm vi xử lý khác nhau. Báo giá cần chỉ rõ công sửa, linh kiện và phần vệ sinh nếu có; không thể kết luận thay linh kiện chỉ từ dấu hiệu không vắt.',
    related: ['ve-sinh-may-giat', 'sua-dien-nuoc'],
  },
  've-sinh-may-giat': {
    preparation: 'Chụp model, cho biết loại cửa và tình trạng mùi hoặc cặn trên quần áo. Thông báo nếu máy không xả, không vắt hoặc báo lỗi để phân biệt yêu cầu vệ sinh và sửa chữa.',
    costFactors: 'Mức tháo lắp, thiết kế máy, tình trạng lồng và các bộ phận tiếp cận được ảnh hưởng phạm vi làm sạch. Cần thống nhất việc tháo lồng, làm sạch gioăng, khay chứa và kiểm tra sau lắp lại trước khi thực hiện.',
    related: ['sua-may-giat', 'sua-dien-nuoc'],
  },
  'sua-tu-lanh': {
    preparation: 'Gửi model, ngăn nào yếu lạnh, ảnh vị trí rò nước hoặc mô tả tiếng ồn. Thông báo tủ có vừa di chuyển, sửa hoặc thay linh kiện không; chuẩn bị phương án bảo quản thực phẩm khi cần ngừng máy.',
    costFactors: 'Bộ phận điều khiển, quạt, xả đá, độ kín cửa và hệ thống làm lạnh cần chẩn đoán riêng. Chi phí phụ thuộc nguyên nhân, linh kiện và khả năng xử lý; kết quả kiểm tra phải có trước quyết định thay thế.',
    related: ['sua-may-giat', 'sua-lap-may-nuoc-uong-nong-lanh'],
  },
  'sua-dien-nuoc': {
    preparation: 'Chụp thiết bị, vị trí rò hoặc khu vực cần sửa, cho biết đường nổi hay âm tường và nguồn cấp tiếp cận được. Khi có dấu hiệu điện bất thường, dừng sử dụng và tránh chạm vào vùng ẩm ướt.',
    costFactors: 'Vị trí sự cố, phần đường ống hoặc dây dẫn tiếp cận được, công tháo mở và vật tư ảnh hưởng phương án. Hỏi rõ phạm vi hoàn trả bề mặt sau thi công và các hạng mục ngoài báo giá ban đầu.',
    related: ['sua-lap-may-nuoc-nong-lanh-tam', 'sua-may-giat'],
  },
  'sua-lap-may-nuoc-uong-nong-lanh': {
    preparation: 'Gửi model, ảnh nhãn máy, loại bình úp/bình âm hoặc có bộ lọc và chức năng đang gặp lỗi. Mô tả vòi nào rò, bên nóng hay bên lạnh không hoạt động.',
    costFactors: 'Cấu tạo làm nóng/lạnh, bộ lọc, vòi, bình chứa và loại linh kiện ảnh hưởng báo giá. Các yêu cầu vệ sinh, thay lõi, di dời hoặc lắp mới cần xác nhận phạm vi riêng theo model.',
    related: ['sua-dien-nuoc', 'sua-tu-lanh'],
  },
  'sua-lap-may-nuoc-nong-lanh-tam': {
    preparation: 'Gửi model trực tiếp/gián tiếp, ảnh vị trí lắp, tình trạng áp lực nước và biểu hiện báo bất thường. Không tự mở vỏ hoặc bỏ qua bộ phận chống giật để tiếp tục dùng.',
    costFactors: 'Nguồn điện, đường nước, bộ phận bảo vệ, vị trí lắp và linh kiện theo model cần được khảo sát. Giá công, vật tư cấp/xả nước và các thay đổi đấu nối nên được trình bày riêng trước thi công.',
    related: ['sua-dien-nuoc', 'sua-lap-may-nuoc-uong-nong-lanh'],
  },
};
