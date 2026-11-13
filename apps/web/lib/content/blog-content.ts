import type { BLOG_POSTS } from '@minhnhat/shared';

type BlogSlug = (typeof BLOG_POSTS)[number]['slug'];
type Article = { sections: Array<{ id: string; title: string; paragraphs: string[] }>; services: string[] };

// Editorial guidance, not a remote diagnosis. No invented author credentials,
// completion dates, customer stories, fixed service intervals or savings claims.
export const blogContent: Record<BlogSlug, Article> = {
  'bao-lau-nen-ve-sinh-may-lanh-mot-lan': {
    sections: [
      { id: 'lich-ve-sinh', title: 'Lịch vệ sinh phụ thuộc cách sử dụng', paragraphs: [
        'Không có một lịch vệ sinh phù hợp với mọi máy lạnh. Máy chạy nhiều giờ, đặt gần đường bụi hoặc trong cửa hàng có nhu cầu làm sạch khác với máy ít sử dụng trong phòng kín. Hãy bắt đầu từ hướng dẫn bảo dưỡng của hãng cho đúng model, sau đó điều chỉnh theo lượng bụi và khả năng làm mát thực tế.',
        'Ghi lại ngày vệ sinh gần nhất, số giờ dùng và biểu hiện của máy. Khi hẹn thợ, những thông tin này hữu ích hơn việc chỉ hỏi máy đã dùng được bao nhiêu tháng. Với nhà cho thuê hoặc máy mới nhận lại, nên kiểm tra tình trạng trước khi lập lịch chăm sóc.'
      ] },
      { id: 'dau-hieu', title: 'Dấu hiệu nên kiểm tra sớm hơn lịch dự kiến', paragraphs: [
        'Lưới lọc bám nhiều bụi, gió ra yếu hoặc mùi xuất hiện khi bật máy là lý do để kiểm tra vệ sinh. Chảy nước và lạnh yếu cũng có thể liên quan đến đường thoát nước, lắp đặt hoặc linh kiện; không nên mặc định rằng rửa máy sẽ xử lý hết.',
        'Bạn có thể quan sát phần lọc tiếp cận được theo sách hướng dẫn khi đã tắt máy và ngắt nguồn an toàn. Không xịt nước vào phần điện, không đứng lên vật kê thiếu chắc chắn để tiếp cận dàn nóng và không tự tháo sâu nếu chưa biết cấu tạo máy.'
      ] },
      { id: 'hang-muc', title: 'Cần thống nhất gì khi đặt vệ sinh máy lạnh ở Cần Thơ?', paragraphs: [
        'Gửi model, số lượng máy, ảnh dàn nóng và tầng lắp đặt để Minh Nhật xác nhận khả năng tiếp cận. Hỏi rõ phạm vi làm sạch lưới lọc, quạt, dàn trao đổi nhiệt và đường thoát nước; đồng thời xác nhận phí tiếp cận vị trí khó nếu có.',
        'Sau vệ sinh, cần kiểm tra luồng gió, thoát nước và vận hành. Nếu máy vẫn lạnh yếu hoặc báo lỗi, nên tách riêng yêu cầu chẩn đoán sửa chữa thay vì tiếp tục vệ sinh hoặc nạp gas theo phỏng đoán.'
      ] },
    ], services: ['ve-sinh-may-lanh', 'sua-may-lanh'],
  },
  'dau-hieu-may-lanh-can-nap-gas': {
    sections: [
      { id: 'khong-mac-dinh', title: 'Máy lạnh yếu chưa đủ để kết luận thiếu gas', paragraphs: [
        'Phòng lâu mát có thể do lọc bẩn, luồng gió bị cản, chọn sai chế độ hoặc lỗi vận hành. Chỉ quan sát cảm giác lạnh không xác định được lượng môi chất trong hệ thống. Đóng tuyết cũng là dấu hiệu cần kiểm tra, không phải bằng chứng đủ để quyết định nạp.',
        'Nếu máy từng tháo lắp, có dấu vết bất thường ở mối nối hoặc vừa nạp nhưng nhanh yếu lạnh trở lại, hãy thông báo cho kỹ thuật viên. Không tự mở van hoặc thử xả gas để kiểm tra; công việc này cần thiết bị đo và người có chuyên môn.'
      ] },
      { id: 'kiem-tra', title: 'Vì sao cần kiểm tra rò rỉ trước khi nạp?', paragraphs: [
        'Hệ thống làm lạnh dùng môi chất trong mạch kín. Khi nghi ngờ thiếu, cần tìm nguyên nhân thay vì xem gas như vật tư phải bổ sung theo một lịch cố định. Nếu điểm rò chưa được xử lý, chỉ nạp thêm có thể khiến sự cố quay lại.',
        'Kỹ thuật viên cần đối chiếu nhãn máy, loại môi chất và thông số của hãng, kết hợp đo kiểm vận hành. Không dùng một mức áp suất chung cho mọi loại máy để kết luận lượng nạp. Phạm vi xử lý rò, vật tư và nạp bổ sung nên được giải thích riêng trong báo giá.'
      ] },
      { id: 'dat-lich', title: 'Thông tin nên gửi trước khi hẹn kiểm tra', paragraphs: [
        'Chụp nhãn model, mô tả máy lạnh yếu ở thời điểm nào, có mã lỗi hay không và lần sửa hoặc tháo lắp gần nhất. Ảnh vị trí dàn nóng giúp chuẩn bị cách tiếp cận phù hợp; ảnh không thay thế phép đo tại chỗ.',
        'Nếu được đề xuất bổ sung môi chất, hãy hỏi kỹ thuật viên về việc kiểm tra rò, xử lý điểm rò và chạy thử. Nếu chưa tìm được nguyên nhân, bạn có thể yêu cầu giải thích kết quả kiểm tra trước khi đồng ý thực hiện.'
      ] },
    ], services: ['sua-may-lanh'],
  },
  'may-lanh-khong-lanh-nguyen-nhan-do-dau': {
    sections: [
      { id: 'kiem-tra-ban-dau', title: 'Kiểm tra những điều không cần tháo máy', paragraphs: [
        'Xác nhận điều khiển đang ở chế độ làm lạnh thay vì quạt, nhiệt độ cài đặt phù hợp và cửa phòng đã đóng. Quan sát xem cửa gió có bị đồ đạc che và bộ lọc có bẩn rõ rệt không. Đối chiếu cách dùng với sách hướng dẫn đúng model.',
        'Ghi nhận máy không mát ngay từ đầu hay chỉ sau một thời gian chạy, có kêu lạ, chảy nước hoặc hiện mã lỗi không. Những khác biệt này giúp phân biệt điều kiện sử dụng với sự cố thiết bị; không cần bật tắt liên tục để thử.'
      ] },
      { id: 'nhom-nguyen-nhan', title: 'Những nhóm nguyên nhân cần kỹ thuật viên phân biệt', paragraphs: [
        'Bụi bẩn và cản gió, điều kiện tản nhiệt dàn nóng, nguồn điện, cảm biến, quạt, hệ điều khiển và mạch môi chất đều có thể ảnh hưởng khả năng làm mát. Một biểu hiện không tương ứng với duy nhất một linh kiện hỏng.',
        'Không nên thay máy nén hoặc nạp gas chỉ vì máy lạnh yếu. Kết quả kiểm tra cần chỉ ra hạng mục cần xử lý, phần vật tư liên quan và cách chạy thử sau sửa. Nếu máy còn bảo hành của hãng, hãy kiểm tra điều kiện trước khi thuê sửa ngoài.'
      ] },
      { id: 'hen-tho', title: 'Khi nào nên dừng dùng và hẹn kiểm tra?', paragraphs: [
        'Nếu có mùi khét, dấu hiệu điện bất thường hoặc nước gần phần điện, ngừng sử dụng và chỉ ngắt nguồn nếu có thể thao tác an toàn. Không tháo vỏ hay chạm vào dây dẫn để tìm lỗi.',
        'Để hẹn sửa máy lạnh tại Cần Thơ, gửi ảnh model, mã lỗi, địa chỉ và vị trí dàn nóng. Minh Nhật sẽ trao đổi lịch kiểm tra; phương án sửa và chi phí cần được thống nhất sau khi xác định tình trạng thực tế.'
      ] },
    ], services: ['sua-may-lanh', 've-sinh-may-lanh'],
  },
  'may-lanh-chay-nuoc-phai-lam-sao': {
    sections: [
      { id: 'xu-ly-ban-dau', title: 'Bảo vệ khu vực rò nước trước', paragraphs: [
        'Dừng máy nếu nước đang nhỏ vào đồ điện, tường có ổ cắm hoặc có dấu hiệu điện bất thường. Chỉ ngắt nguồn tại vị trí khô ráo, an toàn; không chạm tay ướt vào thiết bị. Di chuyển đồ dễ hỏng khỏi vùng rò nếu có thể.',
        'Chụp lại vị trí nước chảy và thời điểm xuất hiện. Phân biệt nước nhỏ từ mặt trước dàn lạnh, từ đoạn ống hay từ ngoài tường giúp mô tả yêu cầu rõ hơn. Không tự chọc vật cứng sâu vào ống hoặc tháo máng nước.'
      ] },
      { id: 'nguyen-nhan', title: 'Nghẹt thoát nước chỉ là một khả năng', paragraphs: [
        'Ống thoát bẩn, độ dốc đường nước, máng hứng, lớp bảo ôn hoặc hiện tượng đóng tuyết đều cần được xem xét tùy vị trí rò. Nếu sự cố xuất hiện sau khi lắp hoặc di dời, nên cung cấp thông tin này để kiểm tra lại đường ống và vị trí đặt máy.',
        'Vệ sinh có thể phù hợp khi nguyên nhân là chất bẩn cản thoát nước, nhưng không thay thế sửa hạng mục lắp đặt hoặc linh kiện hỏng. Cần xác định đường nước và thử lại sau xử lý thay vì chỉ lau khô bên ngoài.'
      ] },
      { id: 'ban-giao', title: 'Cần kiểm tra gì sau khi xử lý?', paragraphs: [
        'Thống nhất hạng mục thực hiện và khoản vật tư trước khi làm. Sau xử lý, đề nghị kiểm tra thoát nước cùng vận hành làm lạnh; quan sát lại vùng từng rò trong quá trình chạy thử.',
        'Khi liên hệ Minh Nhật tại Cần Thơ, gửi ảnh dàn lạnh, đoạn ống tiếp cận được, model và thông tin lần vệ sinh hoặc lắp đặt gần nhất. Nếu nước quay lại, giữ ảnh và thông tin công việc để thuận tiện trao đổi hỗ trợ.'
      ] },
    ], services: ['sua-may-lanh', 've-sinh-may-lanh', 'lap-dat-may-lanh'],
  },
  'cac-loi-thuong-gap-o-tu-lanh': {
    sections: [
      { id: 'yeu-lanh', title: 'Ngăn mát yếu hoặc ngăn đông không đông đá', paragraphs: [
        'Kiểm tra cài đặt theo hướng dẫn hãng, cửa có đóng kín và thực phẩm có che các cửa gió không. Ghi nhận ngăn nào bị ảnh hưởng, tủ mới đưa vào sử dụng hay đang hoạt động bình thường rồi phát sinh lỗi.',
        'Độ kín cửa, thông gió, quạt, xả đá và hệ thống làm lạnh đều có thể cần kiểm tra. Không kết luận hỏng máy nén chỉ từ việc thực phẩm không đủ lạnh. Hạn chế mở cửa và chủ động bảo quản thực phẩm ở nơi phù hợp khi tủ mất khả năng làm lạnh.'
      ] },
      { id: 'nuoc-tieng-on', title: 'Rò nước, đóng tuyết và tiếng ồn bất thường', paragraphs: [
        'Chụp vị trí nước xuất hiện: trong ngăn, dưới sàn hay quanh cửa. Với tủ có chế độ xả đá tự động, đóng tuyết bất thường cần được phân biệt với cách sử dụng hoặc trục trặc xả đá. Không dùng vật nhọn cạy đá vì có thể làm hỏng chi tiết bên trong.',
        'Mô tả tiếng ồn xuất hiện liên tục hay theo chu kỳ, khi mở cửa hay lúc máy chạy. Một số âm thanh vận hành có thể bình thường tùy model; tiếng mới xuất hiện kèm rung mạnh hoặc giảm lạnh cần được kiểm tra trực tiếp.'
      ] },
      { id: 'chuan-bi', title: 'Chuẩn bị khi hẹn sửa tủ lạnh tại Cần Thơ', paragraphs: [
        'Gửi model, ảnh nhãn máy, ngăn gặp lỗi và mã lỗi nếu có. Cho biết tủ có vừa di chuyển, sửa chữa hoặc thay linh kiện không. Dọn lối tiếp cận nhưng không tự kéo tủ nặng nếu không bảo đảm an toàn.',
        'Hỏi rõ phí kiểm tra, linh kiện dự kiến và cách xác nhận vận hành sau sửa. Nếu có mùi khét hoặc rò điện, dừng sử dụng và nhờ người có chuyên môn xử lý; không tự thử nguồn nhiều lần.'
      ] },
    ], services: ['sua-tu-lanh'],
  },
  'khi-nao-can-ve-sinh-may-giat': {
    sections: [
      { id: 'dau-hieu', title: 'Mùi, cặn và bề mặt bẩn cần được kiểm tra', paragraphs: [
        'Cặn bám lên quần áo, mùi trong lồng, gioăng cửa bẩn hoặc khay nước giặt đọng chất tẩy là những biểu hiện nên kiểm tra làm sạch. Cặn cũng có thể liên quan đến lượng chất giặt, tải đồ hoặc quá trình xả; không phải mọi tình trạng đều cần tháo lồng.',
        'Lịch chăm sóc phụ thuộc model, tần suất sử dụng và hướng dẫn hãng. Ghi lại lần vệ sinh trước và loại sản phẩm đang dùng. Không trộn các chất tẩy rửa hoặc dùng hóa chất không phù hợp với máy.'
      ] },
      { id: 'tu-ve-sinh', title: 'Chế độ tự vệ sinh có giới hạn gì?', paragraphs: [
        'Chương trình vệ sinh lồng hỗ trợ chăm sóc theo thiết kế của máy. Hãy thực hiện đúng tải trống, chất làm sạch và trình tự mà hãng chỉ định. Gioăng, khay chứa và bộ lọc tiếp cận được vẫn cần chăm sóc theo hướng dẫn riêng.',
        'Máy không xả nước, không vắt, báo lỗi hoặc có tiếng cơ khí bất thường cần được chẩn đoán trước. Không chạy lặp nhiều chu trình vệ sinh với hy vọng thay thế việc sửa sự cố.'
      ] },
      { id: 'pham-vi', title: 'Thống nhất phạm vi vệ sinh trước khi tháo máy', paragraphs: [
        'Gửi ảnh nhãn model và loại máy cửa trên hoặc cửa trước. Kỹ thuật viên cần đánh giá thiết kế và tình trạng máy trước khi thống nhất tháo đến đâu, làm sạch bộ phận nào và chi phí liên quan.',
        'Sau khi lắp lại, cần kiểm tra cấp/xả nước, độ kín và vận hành. Với yêu cầu vệ sinh máy giặt ở Cần Thơ, hãy thông báo trước nếu nơi đặt chật, khó tiếp cận nguồn nước hoặc máy đang có lỗi để chuẩn bị phù hợp.'
      ] },
    ], services: ['ve-sinh-may-giat', 'sua-may-giat'],
  },
  'meo-tiet-kiem-dien-khi-su-dung-may-lanh': {
    sections: [
      { id: 'cach-dung', title: 'Điều chỉnh cách dùng trước khi nghĩ đến thay máy', paragraphs: [
        'Chọn chế độ làm lạnh và nhiệt độ dễ chịu theo nhu cầu thay vì liên tục đặt mức thấp nhất. Đóng cửa khi máy hoạt động, hạn chế nguồn nhiệt trực tiếp và sử dụng rèm phù hợp để giảm nắng vào phòng.',
        'Dùng hẹn giờ hoặc chế độ phù hợp có sẵn trên model khi cần. Không có một mức phần trăm tiết kiệm điện áp dụng cho mọi nhà: diện tích, cách nhiệt, số người, thời tiết và thời gian sử dụng đều ảnh hưởng điện năng.'
      ] },
      { id: 'luong-gio', title: 'Giữ đường gió và điều kiện tản nhiệt phù hợp', paragraphs: [
        'Không che cửa hút, cửa thổi bằng đồ đạc. Kiểm tra lọc và bảo dưỡng theo hướng dẫn hãng; bụi bẩn có thể ảnh hưởng luồng gió và trao đổi nhiệt. Không tự trèo đến dàn nóng để di chuyển hoặc vệ sinh khi vị trí không an toàn.',
        'Nếu máy chạy lâu mà phòng vẫn không mát, cần kiểm tra điều kiện phòng và tình trạng thiết bị. Nạp gas định kỳ hoặc thay linh kiện theo phỏng đoán không phải giải pháp tiết kiệm điện có cơ sở.'
      ] },
      { id: 'theo-doi', title: 'Theo dõi điện năng và chọn dịch vụ phù hợp', paragraphs: [
        'So sánh mức dùng điện trong các giai đoạn có số giờ sử dụng và điều kiện tương tự. Một hóa đơn tăng không tự xác định được thiết bị nào gây ra. Ghi lại thay đổi cài đặt, số máy sử dụng và dấu hiệu vận hành trước khi yêu cầu kiểm tra.',
        'Máy có gió yếu do bụi cần khảo sát vệ sinh; máy có lỗi hoặc lạnh bất thường cần chẩn đoán sửa chữa. Nếu dự định lắp mới tại Cần Thơ, gửi diện tích phòng, vị trí và model để trao đổi điều kiện lắp, không chỉ chọn theo giá máy.'
      ] },
    ], services: ['ve-sinh-may-lanh', 'sua-may-lanh', 'lap-dat-may-lanh'],
  },
};
