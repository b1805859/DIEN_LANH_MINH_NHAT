-- Initialize editable content from the public website. Existing slugs and booking references are retained.

BEGIN;

INSERT INTO "services" ("id", "slug", "name", "summary", "description", "imageUrl", "imageAlt", "displayOrder", "isActive", "updatedAt")
VALUES
  ('website-service-sua-may-lanh', 'sua-may-lanh', 'Sửa chữa máy lạnh', 'Kiểm tra máy không lạnh, chảy nước, báo lỗi. Tư vấn rõ nguyên nhân trước khi sửa.', 'Sửa chữa máy lạnh tại Cần Thơ: Gửi model, mã lỗi và mô tả máy không lạnh, chảy nước hay tự ngắt. Cho biết lần sửa gần nhất và chụp vị trí dàn nóng để chuẩn bị kiểm tra tại nhà. Kỹ thuật viên kiểm tra, trao đổi phương án và báo giá trước khi làm.', '/images/redesign/sua-may-lanh-kiem-tra-bo-mach-uniform-v1.webp', 'Kỹ thuật viên dùng đồng hồ đo để kiểm tra bo mạch máy lạnh', 0, true, CURRENT_TIMESTAMP),
  ('website-service-ve-sinh-may-lanh', 've-sinh-may-lanh', 'Vệ sinh máy lạnh', 'Làm sạch dàn nóng, dàn lạnh và lưới lọc. Kiểm tra đường thoát nước sau khi vệ sinh.', 'Vệ sinh máy lạnh tại Cần Thơ: Cho biết số lượng máy, model, vị trí dàn nóng và thời điểm vệ sinh gần nhất. Dọn đồ khỏi khu vực bên dưới dàn lạnh; thông báo trước nếu máy đang có lỗi hoặc chảy nước. Kỹ thuật viên kiểm tra, trao đổi phương án và báo giá trước khi làm.', '/images/redesign/ve-sinh-may-lanh-hold-bag-v3-uniform-v1.webp', 'Kỹ thuật viên rửa dàn lạnh có túi hứng nước', 1, true, CURRENT_TIMESTAMP),
  ('website-service-sua-may-giat', 'sua-may-giat', 'Sửa chữa máy giặt', 'Kiểm tra lỗi không vắt, không xả, rung và tiếng ồn. Hỗ trợ ngay tại nhà.', 'Sửa chữa máy giặt tại Cần Thơ: Gửi model cửa trên/cửa trước, mã lỗi, chương trình xảy ra lỗi và tình trạng cấp hoặc xả nước. Cho biết máy có vừa di chuyển hoặc thay đổi vị trí đặt không. Kỹ thuật viên kiểm tra, trao đổi phương án và báo giá trước khi làm.', '/images/redesign/sua-may-giat-motor-repair-uniform-v1.webp', 'Kỹ thuật viên kiểm tra cụm truyền động phía sau máy giặt', 2, true, CURRENT_TIMESTAMP),
  ('website-service-sua-tu-lanh', 'sua-tu-lanh', 'Sửa chữa tủ lạnh', 'Xử lý yếu lạnh, không đông đá, rò nước và tiếng ồn bất thường.', 'Sửa chữa tủ lạnh tại Cần Thơ: Gửi model, ngăn nào yếu lạnh, ảnh vị trí rò nước hoặc mô tả tiếng ồn. Thông báo tủ có vừa di chuyển, sửa hoặc thay linh kiện không; chuẩn bị phương án bảo quản thực phẩm khi cần ngừng máy. Kỹ thuật viên kiểm tra, trao đổi phương án và báo giá trước khi làm.', '/images/redesign/sua-tu-lanh-rear-repair-v2-uniform-v1.webp', 'Kỹ thuật viên kiểm tra cụm máy ở phía sau tủ lạnh', 3, true, CURRENT_TIMESTAMP),
  ('website-service-sua-dien-nuoc', 'sua-dien-nuoc', 'Điện nước dân dụng', 'Kiểm tra điện nước trong nhà, sửa chỗ rò rỉ, thay vòi, van, ổ cắm và công tắc.', 'Điện nước dân dụng tại Cần Thơ: Chụp thiết bị, vị trí rò hoặc khu vực cần sửa, cho biết đường nổi hay âm tường và nguồn cấp tiếp cận được. Khi có dấu hiệu điện bất thường, dừng sử dụng và tránh chạm vào vùng ẩm ướt. Kỹ thuật viên kiểm tra, trao đổi phương án và báo giá trước khi làm.', '/images/redesign/sua-dien-nuoc-uniform-v1.webp', 'Kỹ thuật viên thao tác tại cụm đường ống nước trong nhà', 4, true, CURRENT_TIMESTAMP),
  ('website-service-thao-di-doi-may-lanh', 'thao-di-doi-may-lanh', 'Tháo dỡ, di dời máy lạnh', 'Tháo máy khi chuyển nhà, chuyển phòng hoặc trả mặt bằng. Khảo sát đường ống, bảo vệ thiết bị và thống nhất phương án di dời.', 'Bạn cho biết model máy, địa chỉ tháo máy và nơi chuyển đến nếu cần di dời. Minh Nhật khảo sát điều kiện tiếp cận, thống nhất hạng mục tháo, vận chuyển và lắp lại nếu có, rồi báo giá trước khi thực hiện.', '/images/redesign/thao-may-lanh-khoi-gia-uniform-v1.webp', 'Kỹ thuật viên nhấc dàn lạnh ra khỏi giá treo trên tường', 5, true, CURRENT_TIMESTAMP),
  ('website-service-lap-dat-may-lanh', 'lap-dat-may-lanh', 'Lắp đặt máy lạnh', 'Lắp máy mới hoặc lắp lại máy đã sử dụng. Khảo sát vị trí, đường ống, nguồn điện và chạy thử trước bàn giao.', 'Bạn gửi model máy, công suất và ảnh vị trí dự kiến. Minh Nhật khảo sát nơi đặt dàn nóng, dàn lạnh, đường ống và nguồn điện; trao đổi vật tư, hạng mục thi công và chi phí trước khi lắp.', '/images/redesign/lap-may-lanh-len-gia-uniform-v2.webp', 'Kỹ thuật viên nâng dàn lạnh lên giá treo tại vị trí lắp mới', 6, true, CURRENT_TIMESTAMP),
  ('website-service-ve-sinh-may-giat', 've-sinh-may-giat', 'Vệ sinh máy giặt', 'Làm sạch lồng giặt, lọc cặn và đường nước, hạn chế mùi và cặn bám.', 'Bạn gửi model máy, loại cửa trên hoặc cửa trước và tình trạng cần vệ sinh. Minh Nhật kiểm tra máy, trao đổi phạm vi tháo lắp và báo giá trước khi làm sạch; chạy thử cấp, xả nước sau khi hoàn tất.', '/images/redesign/ve-sinh-may-giat-uniform-v1.webp', 'Kỹ thuật viên lau gioăng cửa máy giặt cửa trước', 7, true, CURRENT_TIMESTAMP),
  ('website-service-sua-lap-may-nuoc-uong-nong-lanh', 'sua-lap-may-nuoc-uong-nong-lanh', 'Máy nước uống nóng lạnh', 'Sửa chữa, lắp đặt và kiểm tra chức năng làm nóng, làm lạnh, đường nước.', 'Máy nước uống nóng lạnh tại Cần Thơ: Gửi model, ảnh nhãn máy, loại bình úp/bình âm hoặc có bộ lọc và chức năng đang gặp lỗi. Mô tả vòi nào rò, bên nóng hay bên lạnh không hoạt động. Kỹ thuật viên kiểm tra, trao đổi phương án và báo giá trước khi làm.', '/images/redesign/sua-lap-may-nuoc-uong-nong-lanh-uniform-v1.webp', 'Kỹ thuật viên kiểm tra khoang kỹ thuật máy nước uống nóng lạnh', 8, true, CURRENT_TIMESTAMP),
  ('website-service-sua-lap-may-nuoc-nong-lanh-tam', 'sua-lap-may-nuoc-nong-lanh-tam', 'Máy nước nóng lạnh tắm', 'Kiểm tra nguồn điện, áp lực nước và thiết bị chống giật trước khi bàn giao.', 'Máy nước nóng lạnh tắm tại Cần Thơ: Gửi model trực tiếp/gián tiếp, ảnh vị trí lắp, tình trạng áp lực nước và biểu hiện báo bất thường. Không tự mở vỏ hoặc bỏ qua bộ phận chống giật để tiếp tục dùng. Kỹ thuật viên kiểm tra, trao đổi phương án và báo giá trước khi làm.', '/images/redesign/sua-lap-may-nuoc-nong-lanh-tam-uniform-v1.webp', 'Kỹ thuật viên kiểm tra đầu nối nước của máy nước nóng dùng để tắm', 9, true, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "summary" = EXCLUDED."summary",
  "description" = EXCLUDED."description", "imageUrl" = EXCLUDED."imageUrl", "imageAlt" = EXCLUDED."imageAlt",
  "displayOrder" = EXCLUDED."displayOrder", "isActive" = true, "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "categories" ("id", "slug", "name", "description", "createdAt", "updatedAt")
VALUES
  ('website-category-may-lanh', 'may-lanh', 'Máy Lạnh', 'Kinh nghiệm sử dụng, bảo trì và nhận biết lỗi máy lạnh.', TIMESTAMP '2026-01-01' + INTERVAL '0 seconds', CURRENT_TIMESTAMP),
  ('website-category-may-giat', 'may-giat', 'Máy Giặt', 'Kinh nghiệm sử dụng, bảo trì và nhận biết lỗi máy giặt.', TIMESTAMP '2026-01-01' + INTERVAL '1 seconds', CURRENT_TIMESTAMP),
  ('website-category-tu-lanh', 'tu-lanh', 'Tủ Lạnh', 'Kinh nghiệm sử dụng, bảo trì và nhận biết lỗi tủ lạnh.', TIMESTAMP '2026-01-01' + INTERVAL '2 seconds', CURRENT_TIMESTAMP),
  ('website-category-dien-nuoc', 'dien-nuoc', 'Điện Nước', 'Kinh nghiệm sử dụng, bảo trì và nhận biết lỗi điện nước.', TIMESTAMP '2026-01-01' + INTERVAL '3 seconds', CURRENT_TIMESTAMP),
  ('website-category-tiet-kiem-dien', 'tiet-kiem-dien', 'Tiết Kiệm Điện', 'Kinh nghiệm sử dụng, bảo trì và nhận biết lỗi tiết kiệm điện.', TIMESTAMP '2026-01-01' + INTERVAL '4 seconds', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "media_files" ("id", "fileName", "originalName", "mimeType", "size", "url", "altText", "visibility", "updatedAt")
VALUES
  ('website-blog-image-bao-lau-nen-ve-sinh-may-lanh-mot-lan', 've-sinh-may-lanh-hold-bag-v3-uniform-v1.webp', 've-sinh-may-lanh-hold-bag-v3-uniform-v1.webp', 'image/webp', 249200, '/images/redesign/ve-sinh-may-lanh-hold-bag-v3-uniform-v1.webp', 'Bao lâu nên vệ sinh máy lạnh một lần?', 'PUBLIC', CURRENT_TIMESTAMP),
  ('website-blog-image-dau-hieu-may-lanh-can-nap-gas', 'nap-gas-may-lanh-uniform-v1.webp', 'nap-gas-may-lanh-uniform-v1.webp', 'image/webp', 212968, '/images/redesign/nap-gas-may-lanh-uniform-v1.webp', 'Dấu hiệu máy lạnh cần nạp gas', 'PUBLIC', CURRENT_TIMESTAMP),
  ('website-blog-image-may-lanh-khong-lanh-nguyen-nhan-do-dau', 'support-condenser-uniform-v1.webp', 'support-condenser-uniform-v1.webp', 'image/webp', 87838, '/images/redesign/home-carousel/support-condenser-uniform-v1.webp', 'Máy lạnh không lạnh nguyên nhân do đâu?', 'PUBLIC', CURRENT_TIMESTAMP),
  ('website-blog-image-may-lanh-chay-nuoc-phai-lam-sao', 've-sinh-may-lanh-hold-bag-v3-uniform-v1.webp', 've-sinh-may-lanh-hold-bag-v3-uniform-v1.webp', 'image/webp', 249200, '/images/redesign/ve-sinh-may-lanh-hold-bag-v3-uniform-v1.webp', 'Máy lạnh chảy nước phải làm sao?', 'PUBLIC', CURRENT_TIMESTAMP),
  ('website-blog-image-cac-loi-thuong-gap-o-tu-lanh', 'sua-tu-lanh-rear-repair-v2-uniform-v1.webp', 'sua-tu-lanh-rear-repair-v2-uniform-v1.webp', 'image/webp', 221090, '/images/redesign/sua-tu-lanh-rear-repair-v2-uniform-v1.webp', 'Các lỗi thường gặp ở tủ lạnh', 'PUBLIC', CURRENT_TIMESTAMP),
  ('website-blog-image-khi-nao-can-ve-sinh-may-giat', 've-sinh-may-giat-uniform-v1.webp', 've-sinh-may-giat-uniform-v1.webp', 'image/webp', 200074, '/images/redesign/ve-sinh-may-giat-uniform-v1.webp', 'Khi nào cần vệ sinh máy giặt?', 'PUBLIC', CURRENT_TIMESTAMP),
  ('website-blog-image-meo-tiet-kiem-dien-khi-su-dung-may-lanh', 'sua-may-lanh-realism-v2-uniform-v1.webp', 'sua-may-lanh-realism-v2-uniform-v1.webp', 'image/webp', 129566, '/images/redesign/sua-may-lanh-realism-v2-uniform-v1.webp', 'Mẹo tiết kiệm điện khi sử dụng máy lạnh', 'PUBLIC', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "blog_posts" ("id", "slug", "title", "excerpt", "content", "status", "publishedAt", "categoryId", "featuredImageId", "updatedAt")
VALUES
  ('website-post-bao-lau-nen-ve-sinh-may-lanh-mot-lan', 'bao-lau-nen-ve-sinh-may-lanh-mot-lan', 'Bao lâu nên vệ sinh máy lạnh một lần?', 'Bao lâu nên vệ sinh máy lạnh ở nhà, phòng trọ hoặc cửa hàng? Lịch vệ sinh còn tùy mức độ sử dụng.', '## Lịch vệ sinh phụ thuộc cách sử dụng

Không có một lịch vệ sinh phù hợp với mọi máy lạnh. Máy chạy nhiều giờ, đặt gần đường bụi hoặc trong cửa hàng có nhu cầu làm sạch khác với máy ít sử dụng trong phòng kín. Hãy bắt đầu từ hướng dẫn bảo dưỡng của hãng cho đúng model, sau đó điều chỉnh theo lượng bụi và khả năng làm mát thực tế.

Ghi lại ngày vệ sinh gần nhất, số giờ dùng và biểu hiện của máy. Khi hẹn thợ, những thông tin này hữu ích hơn việc chỉ hỏi máy đã dùng được bao nhiêu tháng. Với nhà cho thuê hoặc máy mới nhận lại, nên kiểm tra tình trạng trước khi lập lịch chăm sóc.

## Dấu hiệu nên kiểm tra sớm hơn lịch dự kiến

Lưới lọc bám nhiều bụi, gió ra yếu hoặc mùi xuất hiện khi bật máy là lý do để kiểm tra vệ sinh. Chảy nước và lạnh yếu cũng có thể liên quan đến đường thoát nước, lắp đặt hoặc linh kiện; không nên mặc định rằng rửa máy sẽ xử lý hết.

Bạn có thể quan sát phần lọc tiếp cận được theo sách hướng dẫn khi đã tắt máy và ngắt nguồn an toàn. Không xịt nước vào phần điện, không đứng lên vật kê thiếu chắc chắn để tiếp cận dàn nóng và không tự tháo sâu nếu chưa biết cấu tạo máy.

## Cần thống nhất gì khi đặt vệ sinh máy lạnh ở Cần Thơ?

Gửi model, số lượng máy, ảnh dàn nóng và tầng lắp đặt để Minh Nhật xác nhận khả năng tiếp cận. Hỏi rõ phạm vi làm sạch lưới lọc, quạt, dàn trao đổi nhiệt và đường thoát nước; đồng thời xác nhận phí tiếp cận vị trí khó nếu có.

Sau vệ sinh, cần kiểm tra luồng gió, thoát nước và vận hành. Nếu máy vẫn lạnh yếu hoặc báo lỗi, nên tách riêng yêu cầu chẩn đoán sửa chữa thay vì tiếp tục vệ sinh hoặc nạp gas theo phỏng đoán.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '0 seconds', (SELECT "id" FROM "categories" WHERE "slug" = 'may-lanh'), 'website-blog-image-bao-lau-nen-ve-sinh-may-lanh-mot-lan', CURRENT_TIMESTAMP),
  ('website-post-dau-hieu-may-lanh-can-nap-gas', 'dau-hieu-may-lanh-can-nap-gas', 'Dấu hiệu máy lạnh cần nạp gas', 'Máy lạnh yếu có phải do thiếu gas? Những dấu hiệu cần để thợ kiểm tra trước khi nạp.', '## Máy lạnh yếu chưa đủ để kết luận thiếu gas

Phòng lâu mát có thể do lọc bẩn, luồng gió bị cản, chọn sai chế độ hoặc lỗi vận hành. Chỉ quan sát cảm giác lạnh không xác định được lượng môi chất trong hệ thống. Đóng tuyết cũng là dấu hiệu cần kiểm tra, không phải bằng chứng đủ để quyết định nạp.

Nếu máy từng tháo lắp, có dấu vết bất thường ở mối nối hoặc vừa nạp nhưng nhanh yếu lạnh trở lại, hãy thông báo cho kỹ thuật viên. Không tự mở van hoặc thử xả gas để kiểm tra; công việc này cần thiết bị đo và người có chuyên môn.

## Vì sao cần kiểm tra rò rỉ trước khi nạp?

Hệ thống làm lạnh dùng môi chất trong mạch kín. Khi nghi ngờ thiếu, cần tìm nguyên nhân thay vì xem gas như vật tư phải bổ sung theo một lịch cố định. Nếu điểm rò chưa được xử lý, chỉ nạp thêm có thể khiến sự cố quay lại.

Kỹ thuật viên cần đối chiếu nhãn máy, loại môi chất và thông số của hãng, kết hợp đo kiểm vận hành. Không dùng một mức áp suất chung cho mọi loại máy để kết luận lượng nạp. Phạm vi xử lý rò, vật tư và nạp bổ sung nên được giải thích riêng trong báo giá.

## Thông tin nên gửi trước khi hẹn kiểm tra

Chụp nhãn model, mô tả máy lạnh yếu ở thời điểm nào, có mã lỗi hay không và lần sửa hoặc tháo lắp gần nhất. Ảnh vị trí dàn nóng giúp chuẩn bị cách tiếp cận phù hợp; ảnh không thay thế phép đo tại chỗ.

Nếu được đề xuất bổ sung môi chất, hãy hỏi kỹ thuật viên về việc kiểm tra rò, xử lý điểm rò và chạy thử. Nếu chưa tìm được nguyên nhân, bạn có thể yêu cầu giải thích kết quả kiểm tra trước khi đồng ý thực hiện.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '1 seconds', (SELECT "id" FROM "categories" WHERE "slug" = 'may-lanh'), 'website-blog-image-dau-hieu-may-lanh-can-nap-gas', CURRENT_TIMESTAMP),
  ('website-post-may-lanh-khong-lanh-nguyen-nhan-do-dau', 'may-lanh-khong-lanh-nguyen-nhan-do-dau', 'Máy lạnh không lạnh nguyên nhân do đâu?', 'Máy vẫn chạy nhưng phòng không mát: những nguyên nhân thường gặp và cách kiểm tra ban đầu.', '## Kiểm tra những điều không cần tháo máy

Xác nhận điều khiển đang ở chế độ làm lạnh thay vì quạt, nhiệt độ cài đặt phù hợp và cửa phòng đã đóng. Quan sát xem cửa gió có bị đồ đạc che và bộ lọc có bẩn rõ rệt không. Đối chiếu cách dùng với sách hướng dẫn đúng model.

Ghi nhận máy không mát ngay từ đầu hay chỉ sau một thời gian chạy, có kêu lạ, chảy nước hoặc hiện mã lỗi không. Những khác biệt này giúp phân biệt điều kiện sử dụng với sự cố thiết bị; không cần bật tắt liên tục để thử.

## Những nhóm nguyên nhân cần kỹ thuật viên phân biệt

Bụi bẩn và cản gió, điều kiện tản nhiệt dàn nóng, nguồn điện, cảm biến, quạt, hệ điều khiển và mạch môi chất đều có thể ảnh hưởng khả năng làm mát. Một biểu hiện không tương ứng với duy nhất một linh kiện hỏng.

Không nên thay máy nén hoặc nạp gas chỉ vì máy lạnh yếu. Kết quả kiểm tra cần chỉ ra hạng mục cần xử lý, phần vật tư liên quan và cách chạy thử sau sửa. Nếu máy còn bảo hành của hãng, hãy kiểm tra điều kiện trước khi thuê sửa ngoài.

## Khi nào nên dừng dùng và hẹn kiểm tra?

Nếu có mùi khét, dấu hiệu điện bất thường hoặc nước gần phần điện, ngừng sử dụng và chỉ ngắt nguồn nếu có thể thao tác an toàn. Không tháo vỏ hay chạm vào dây dẫn để tìm lỗi.

Để hẹn sửa máy lạnh tại Cần Thơ, gửi ảnh model, mã lỗi, địa chỉ và vị trí dàn nóng. Minh Nhật sẽ trao đổi lịch kiểm tra; phương án sửa và chi phí cần được thống nhất sau khi xác định tình trạng thực tế.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '2 seconds', (SELECT "id" FROM "categories" WHERE "slug" = 'may-lanh'), 'website-blog-image-may-lanh-khong-lanh-nguyen-nhan-do-dau', CURRENT_TIMESTAMP),
  ('website-post-may-lanh-chay-nuoc-phai-lam-sao', 'may-lanh-chay-nuoc-phai-lam-sao', 'Máy lạnh chảy nước phải làm sao?', 'Nhận biết nguyên nhân máy lạnh rò nước, nghẹt ống thoát và các bước xử lý ban đầu.', '## Bảo vệ khu vực rò nước trước

Dừng máy nếu nước đang nhỏ vào đồ điện, tường có ổ cắm hoặc có dấu hiệu điện bất thường. Chỉ ngắt nguồn tại vị trí khô ráo, an toàn; không chạm tay ướt vào thiết bị. Di chuyển đồ dễ hỏng khỏi vùng rò nếu có thể.

Chụp lại vị trí nước chảy và thời điểm xuất hiện. Phân biệt nước nhỏ từ mặt trước dàn lạnh, từ đoạn ống hay từ ngoài tường giúp mô tả yêu cầu rõ hơn. Không tự chọc vật cứng sâu vào ống hoặc tháo máng nước.

## Nghẹt thoát nước chỉ là một khả năng

Ống thoát bẩn, độ dốc đường nước, máng hứng, lớp bảo ôn hoặc hiện tượng đóng tuyết đều cần được xem xét tùy vị trí rò. Nếu sự cố xuất hiện sau khi lắp hoặc di dời, nên cung cấp thông tin này để kiểm tra lại đường ống và vị trí đặt máy.

Vệ sinh có thể phù hợp khi nguyên nhân là chất bẩn cản thoát nước, nhưng không thay thế sửa hạng mục lắp đặt hoặc linh kiện hỏng. Cần xác định đường nước và thử lại sau xử lý thay vì chỉ lau khô bên ngoài.

## Cần kiểm tra gì sau khi xử lý?

Thống nhất hạng mục thực hiện và khoản vật tư trước khi làm. Sau xử lý, đề nghị kiểm tra thoát nước cùng vận hành làm lạnh; quan sát lại vùng từng rò trong quá trình chạy thử.

Khi liên hệ Minh Nhật tại Cần Thơ, gửi ảnh dàn lạnh, đoạn ống tiếp cận được, model và thông tin lần vệ sinh hoặc lắp đặt gần nhất. Nếu nước quay lại, giữ ảnh và thông tin công việc để thuận tiện trao đổi hỗ trợ.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '3 seconds', (SELECT "id" FROM "categories" WHERE "slug" = 'may-lanh'), 'website-blog-image-may-lanh-chay-nuoc-phai-lam-sao', CURRENT_TIMESTAMP),
  ('website-post-cac-loi-thuong-gap-o-tu-lanh', 'cac-loi-thuong-gap-o-tu-lanh', 'Các lỗi thường gặp ở tủ lạnh', 'Những lỗi tủ lạnh thường gặp như yếu lạnh, đóng tuyết, rò nước và tiếng ồn bất thường.', '## Ngăn mát yếu hoặc ngăn đông không đông đá

Kiểm tra cài đặt theo hướng dẫn hãng, cửa có đóng kín và thực phẩm có che các cửa gió không. Ghi nhận ngăn nào bị ảnh hưởng, tủ mới đưa vào sử dụng hay đang hoạt động bình thường rồi phát sinh lỗi.

Độ kín cửa, thông gió, quạt, xả đá và hệ thống làm lạnh đều có thể cần kiểm tra. Không kết luận hỏng máy nén chỉ từ việc thực phẩm không đủ lạnh. Hạn chế mở cửa và chủ động bảo quản thực phẩm ở nơi phù hợp khi tủ mất khả năng làm lạnh.

## Rò nước, đóng tuyết và tiếng ồn bất thường

Chụp vị trí nước xuất hiện: trong ngăn, dưới sàn hay quanh cửa. Với tủ có chế độ xả đá tự động, đóng tuyết bất thường cần được phân biệt với cách sử dụng hoặc trục trặc xả đá. Không dùng vật nhọn cạy đá vì có thể làm hỏng chi tiết bên trong.

Mô tả tiếng ồn xuất hiện liên tục hay theo chu kỳ, khi mở cửa hay lúc máy chạy. Một số âm thanh vận hành có thể bình thường tùy model; tiếng mới xuất hiện kèm rung mạnh hoặc giảm lạnh cần được kiểm tra trực tiếp.

## Chuẩn bị khi hẹn sửa tủ lạnh tại Cần Thơ

Gửi model, ảnh nhãn máy, ngăn gặp lỗi và mã lỗi nếu có. Cho biết tủ có vừa di chuyển, sửa chữa hoặc thay linh kiện không. Dọn lối tiếp cận nhưng không tự kéo tủ nặng nếu không bảo đảm an toàn.

Hỏi rõ phí kiểm tra, linh kiện dự kiến và cách xác nhận vận hành sau sửa. Nếu có mùi khét hoặc rò điện, dừng sử dụng và nhờ người có chuyên môn xử lý; không tự thử nguồn nhiều lần.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '4 seconds', (SELECT "id" FROM "categories" WHERE "slug" = 'tu-lanh'), 'website-blog-image-cac-loi-thuong-gap-o-tu-lanh', CURRENT_TIMESTAMP),
  ('website-post-khi-nao-can-ve-sinh-may-giat', 'khi-nao-can-ve-sinh-may-giat', 'Khi nào cần vệ sinh máy giặt?', 'Dấu hiệu lồng giặt bám cặn, có mùi và lịch vệ sinh giúp quần áo sạch hơn.', '## Mùi, cặn và bề mặt bẩn cần được kiểm tra

Cặn bám lên quần áo, mùi trong lồng, gioăng cửa bẩn hoặc khay nước giặt đọng chất tẩy là những biểu hiện nên kiểm tra làm sạch. Cặn cũng có thể liên quan đến lượng chất giặt, tải đồ hoặc quá trình xả; không phải mọi tình trạng đều cần tháo lồng.

Lịch chăm sóc phụ thuộc model, tần suất sử dụng và hướng dẫn hãng. Ghi lại lần vệ sinh trước và loại sản phẩm đang dùng. Không trộn các chất tẩy rửa hoặc dùng hóa chất không phù hợp với máy.

## Chế độ tự vệ sinh có giới hạn gì?

Chương trình vệ sinh lồng hỗ trợ chăm sóc theo thiết kế của máy. Hãy thực hiện đúng tải trống, chất làm sạch và trình tự mà hãng chỉ định. Gioăng, khay chứa và bộ lọc tiếp cận được vẫn cần chăm sóc theo hướng dẫn riêng.

Máy không xả nước, không vắt, báo lỗi hoặc có tiếng cơ khí bất thường cần được chẩn đoán trước. Không chạy lặp nhiều chu trình vệ sinh với hy vọng thay thế việc sửa sự cố.

## Thống nhất phạm vi vệ sinh trước khi tháo máy

Gửi ảnh nhãn model và loại máy cửa trên hoặc cửa trước. Kỹ thuật viên cần đánh giá thiết kế và tình trạng máy trước khi thống nhất tháo đến đâu, làm sạch bộ phận nào và chi phí liên quan.

Sau khi lắp lại, cần kiểm tra cấp/xả nước, độ kín và vận hành. Với yêu cầu vệ sinh máy giặt ở Cần Thơ, hãy thông báo trước nếu nơi đặt chật, khó tiếp cận nguồn nước hoặc máy đang có lỗi để chuẩn bị phù hợp.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '5 seconds', (SELECT "id" FROM "categories" WHERE "slug" = 'may-giat'), 'website-blog-image-khi-nao-can-ve-sinh-may-giat', CURRENT_TIMESTAMP),
  ('website-post-meo-tiet-kiem-dien-khi-su-dung-may-lanh', 'meo-tiet-kiem-dien-khi-su-dung-may-lanh', 'Mẹo tiết kiệm điện khi sử dụng máy lạnh', 'Cách cài đặt nhiệt độ, vệ sinh định kỳ và dùng máy lạnh hợp lý để giảm hao điện.', '## Điều chỉnh cách dùng trước khi nghĩ đến thay máy

Chọn chế độ làm lạnh và nhiệt độ dễ chịu theo nhu cầu thay vì liên tục đặt mức thấp nhất. Đóng cửa khi máy hoạt động, hạn chế nguồn nhiệt trực tiếp và sử dụng rèm phù hợp để giảm nắng vào phòng.

Dùng hẹn giờ hoặc chế độ phù hợp có sẵn trên model khi cần. Không có một mức phần trăm tiết kiệm điện áp dụng cho mọi nhà: diện tích, cách nhiệt, số người, thời tiết và thời gian sử dụng đều ảnh hưởng điện năng.

## Giữ đường gió và điều kiện tản nhiệt phù hợp

Không che cửa hút, cửa thổi bằng đồ đạc. Kiểm tra lọc và bảo dưỡng theo hướng dẫn hãng; bụi bẩn có thể ảnh hưởng luồng gió và trao đổi nhiệt. Không tự trèo đến dàn nóng để di chuyển hoặc vệ sinh khi vị trí không an toàn.

Nếu máy chạy lâu mà phòng vẫn không mát, cần kiểm tra điều kiện phòng và tình trạng thiết bị. Nạp gas định kỳ hoặc thay linh kiện theo phỏng đoán không phải giải pháp tiết kiệm điện có cơ sở.

## Theo dõi điện năng và chọn dịch vụ phù hợp

So sánh mức dùng điện trong các giai đoạn có số giờ sử dụng và điều kiện tương tự. Một hóa đơn tăng không tự xác định được thiết bị nào gây ra. Ghi lại thay đổi cài đặt, số máy sử dụng và dấu hiệu vận hành trước khi yêu cầu kiểm tra.

Máy có gió yếu do bụi cần khảo sát vệ sinh; máy có lỗi hoặc lạnh bất thường cần chẩn đoán sửa chữa. Nếu dự định lắp mới tại Cần Thơ, gửi diện tích phòng, vị trí và model để trao đổi điều kiện lắp, không chỉ chọn theo giá máy.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '6 seconds', (SELECT "id" FROM "categories" WHERE "slug" = 'tiet-kiem-dien'), 'website-blog-image-meo-tiet-kiem-dien-khi-su-dung-may-lanh', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "excerpt" = EXCLUDED."excerpt",
  "content" = EXCLUDED."content", "status" = EXCLUDED."status", "publishedAt" = EXCLUDED."publishedAt",
  "categoryId" = EXCLUDED."categoryId", "featuredImageId" = EXCLUDED."featuredImageId", "updatedAt" = CURRENT_TIMESTAMP;

-- Keep admin-only entries available for review without exposing them on initial cutover.

UPDATE "services" SET "isActive" = false, "updatedAt" = CURRENT_TIMESTAMP
WHERE "isActive" = true AND "slug" NOT IN ('sua-may-lanh', 've-sinh-may-lanh', 'sua-may-giat', 'sua-tu-lanh', 'sua-dien-nuoc', 'thao-di-doi-may-lanh', 'lap-dat-may-lanh', 've-sinh-may-giat', 'sua-lap-may-nuoc-uong-nong-lanh', 'sua-lap-may-nuoc-nong-lanh-tam');

UPDATE "blog_posts" SET "status" = 'DRAFT', "updatedAt" = CURRENT_TIMESTAMP
WHERE "status" = 'PUBLISHED' AND "slug" NOT IN ('bao-lau-nen-ve-sinh-may-lanh-mot-lan', 'dau-hieu-may-lanh-can-nap-gas', 'may-lanh-khong-lanh-nguyen-nhan-do-dau', 'may-lanh-chay-nuoc-phai-lam-sao', 'cac-loi-thuong-gap-o-tu-lanh', 'khi-nao-can-ve-sinh-may-giat', 'meo-tiet-kiem-dien-khi-su-dung-may-lanh');

UPDATE "faqs" SET "isActive" = false, "updatedAt" = CURRENT_TIMESTAMP
WHERE "isActive" = true AND (
  ("serviceId" IS NULL AND "locationId" IS NULL AND "blogPostId" IS NULL)
  OR "serviceId" IN (SELECT "id" FROM "services" WHERE "isActive" = true)
);

INSERT INTO "faqs" ("id", "question", "answer", "serviceId", "isActive", "createdAt", "updatedAt")
VALUES
  ('website-faq-0', 'Bao lâu nên vệ sinh máy lạnh?', 'Gia đình nên vệ sinh máy lạnh mỗi 3 đến 6 tháng tùy tần suất sử dụng.', NULL, true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-1', 'Có báo giá trước khi sửa không?', 'Có. Kỹ thuật viên kiểm tra, tư vấn nguyên nhân và báo giá trước khi thực hiện.', NULL, true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-2', 'Minh Nhật nhận sửa ở đâu?', 'Minh Nhật nhận sửa tại Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn và các khu vực lân cận ở Cần Thơ. Bạn gửi địa chỉ để xác nhận lịch đến.', NULL, true, CURRENT_TIMESTAMP + INTERVAL '2 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-may-lanh-0', 'Máy lạnh không lạnh có phải lúc nào cũng thiếu gas?', 'Không. Lưới lọc bẩn, luồng gió bị cản, cài đặt hoặc lỗi linh kiện đều có thể ảnh hưởng khả năng làm lạnh. Cần kiểm tra thực tế trước khi quyết định nạp gas.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-may-lanh-1', 'Cần cung cấp gì khi máy lạnh báo lỗi hoặc tự ngắt?', 'Bạn có thể ghi lại mã lỗi, nhãn máy và thời điểm máy tự ngắt. Những thông tin này giúp kỹ thuật viên chuẩn bị kiểm tra; không cần tự tháo vỏ máy.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-may-lanh-2', 'Máy lạnh chảy nước hoặc kêu lớn được kiểm tra thế nào?', 'Kỹ thuật viên kiểm tra đường thoát nước, tình trạng dàn lạnh, quạt và vị trí lắp đặt để phân biệt lỗi vệ sinh, lắp đặt hay linh kiện, sau đó trao đổi hướng xử lý.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '2 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-ve-sinh-may-lanh-0', 'Vệ sinh máy lạnh gồm những hạng mục nào?', 'Hạng mục được thống nhất sau khi kiểm tra, thường gồm lưới lọc, dàn trao đổi nhiệt, quạt và đường thoát nước. Khả năng tiếp cận dàn nóng được khảo sát riêng.', (SELECT "id" FROM "services" WHERE "slug" = 've-sinh-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-ve-sinh-may-lanh-1', 'Vệ sinh có xử lý được mọi lỗi không lạnh không?', 'Không. Vệ sinh phù hợp khi bụi bẩn cản luồng gió; lỗi điện, linh kiện hoặc môi chất cần được chẩn đoán riêng.', (SELECT "id" FROM "services" WHERE "slug" = 've-sinh-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-may-giat-0', 'Máy giặt không vắt cần kiểm tra gì?', 'Kỹ thuật viên kiểm tra tải đồ, khả năng xả nước, khóa cửa và hệ thống điều khiển. Không thể xác định linh kiện cần thay chỉ từ dấu hiệu không vắt.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-may-giat'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-may-giat-1', 'Máy rung mạnh có nhất thiết phải thay bộ giảm xóc?', 'Không. Vị trí đặt máy, cân bằng chân máy và tải đồ cũng có thể gây rung. Cần kiểm tra trước khi đề xuất thay linh kiện.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-may-giat'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-tu-lanh-0', 'Tủ lạnh yếu lạnh có phải hỏng máy nén?', 'Không nhất thiết. Cửa không kín, đường gió bị cản hoặc các bộ phận điều khiển cũng có thể gây yếu lạnh. Kết luận cần dựa trên kiểm tra.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-tu-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-tu-lanh-1', 'Cần gửi thông tin gì khi yêu cầu sửa tủ lạnh?', 'Gửi model, ảnh nhãn thiết bị, ngăn nào yếu lạnh và mô tả tiếng ồn hoặc vị trí nước rò. Kỹ thuật viên sẽ trao đổi lịch kiểm tra phù hợp.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-tu-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-dien-nuoc-0', 'Có hỗ trợ tìm vị trí nước rò không?', 'Kỹ thuật viên khảo sát biểu hiện rò, các điểm nối và đường ống có thể tiếp cận để trao đổi cách kiểm tra phù hợp với hiện trạng.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-dien-nuoc'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-dien-nuoc-1', 'Có thể báo phương án chỉ qua ảnh không?', 'Ảnh giúp nhận diện thiết bị và chuẩn bị kiểm tra. Các hạng mục liên quan đường âm tường hoặc nguồn điện cần khảo sát thực tế trước khi thống nhất.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-dien-nuoc'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-thao-di-doi-may-lanh-0', 'Có nhận tháo máy mà chưa lắp lại ngay không?', 'Có. Bạn cho biết cần tháo để cất giữ hay chuyển đến nơi khác. Kỹ thuật viên kiểm tra, thống nhất cách bảo vệ thiết bị và bàn giao các bộ phận sau khi tháo.', (SELECT "id" FROM "services" WHERE "slug" = 'thao-di-doi-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-thao-di-doi-may-lanh-1', 'Di dời máy lạnh có bao gồm lắp lại không?', 'Phạm vi công việc được xác nhận trước khi làm. Bạn có thể yêu cầu tháo và di chuyển, hoặc thêm phần lắp lại tại nơi mới. Vật tư, đường ống và điều kiện tiếp cận tại nơi mới cần được khảo sát để báo giá.', (SELECT "id" FROM "services" WHERE "slug" = 'thao-di-doi-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-thao-di-doi-may-lanh-2', 'Cần cung cấp thông tin gì trước khi tháo máy?', 'Gửi ảnh dàn nóng, dàn lạnh, model máy, thông tin tầng lắp đặt và địa chỉ chuyển đến nếu có. Những thông tin này giúp chuẩn bị dụng cụ và phương án tiếp cận phù hợp.', (SELECT "id" FROM "services" WHERE "slug" = 'thao-di-doi-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '2 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-lap-dat-may-lanh-0', 'Có thể dùng lại đường ống cũ không?', 'Cần kiểm tra kích thước, tình trạng và mức độ phù hợp với máy trước khi quyết định. Kỹ thuật viên sẽ trao đổi những vật tư có thể dùng lại.', (SELECT "id" FROM "services" WHERE "slug" = 'lap-dat-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-lap-dat-may-lanh-1', 'Cần chuẩn bị gì trước khi lắp đặt?', 'Cung cấp model máy, ảnh vị trí dự kiến và thông tin tầng lắp đặt. Dọn lối tiếp cận để kỹ thuật viên khảo sát và bảo vệ khu vực thi công.', (SELECT "id" FROM "services" WHERE "slug" = 'lap-dat-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-lap-dat-may-lanh-2', 'Có lắp lại máy lạnh đã qua sử dụng không?', 'Có thể lắp lại sau khi kiểm tra tình trạng máy và điều kiện tại nơi lắp. Kỹ thuật viên trao đổi riêng các vấn đề cần xử lý và vật tư cần bổ sung trước khi thực hiện.', (SELECT "id" FROM "services" WHERE "slug" = 'lap-dat-may-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '2 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-ve-sinh-may-giat-0', 'Có vệ sinh máy giặt cửa trên và cửa trước không?', 'Minh Nhật nhận kiểm tra và vệ sinh cả hai loại. Bạn gửi model hoặc ảnh nhãn máy để xác nhận phạm vi hỗ trợ và cách tháo lắp phù hợp trước khi hẹn lịch.', (SELECT "id" FROM "services" WHERE "slug" = 've-sinh-may-giat'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-ve-sinh-may-giat-1', 'Có phải máy nào cũng cần tháo lồng giặt?', 'Mức độ tháo lắp phụ thuộc thiết kế, tình trạng máy và hạng mục đã thống nhất. Kỹ thuật viên sẽ khảo sát trước khi thực hiện.', (SELECT "id" FROM "services" WHERE "slug" = 've-sinh-may-giat'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-ve-sinh-may-giat-2', 'Chế độ tự vệ sinh có thay thế mọi công việc vệ sinh không?', 'Chế độ tự vệ sinh hỗ trợ chăm sóc lồng giặt theo hướng dẫn hãng. Gioăng, khay chứa và lọc cặn vẫn cần được kiểm tra phù hợp.', (SELECT "id" FROM "services" WHERE "slug" = 've-sinh-may-giat'), true, CURRENT_TIMESTAMP + INTERVAL '2 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-lap-may-nuoc-uong-nong-lanh-0', 'Máy có điện nhưng nước không lạnh cần kiểm tra gì?', 'Kỹ thuật viên kiểm tra cài đặt, thông gió và cụm làm lạnh theo cấu tạo thiết bị. Cần biết model để chuẩn bị kiểm tra phù hợp.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-lap-may-nuoc-uong-nong-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-lap-may-nuoc-uong-nong-lanh-1', 'Có hỗ trợ máy nước nóng lạnh có bộ lọc không?', 'Hãy gửi model và ảnh thiết bị để Minh Nhật xác nhận phạm vi hỗ trợ, loại linh kiện và phương án trước khi hẹn lịch.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-lap-may-nuoc-uong-nong-lanh'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-lap-may-nuoc-nong-lanh-tam-0', 'Cần cung cấp gì để đặt lịch sửa máy nước nóng?', 'Gửi model, loại máy trực tiếp hoặc gián tiếp và mô tả tình trạng. Không cần tự mở vỏ hay thử lại nhiều lần khi máy báo bất thường.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-lap-may-nuoc-nong-lanh-tam'), true, CURRENT_TIMESTAMP + INTERVAL '0 milliseconds', CURRENT_TIMESTAMP),
  ('website-faq-sua-lap-may-nuoc-nong-lanh-tam-1', 'Lắp máy mới có cần kiểm tra nguồn điện và nước không?', 'Có. Kỹ thuật viên cần khảo sát điều kiện lắp đặt và các bộ phận bảo vệ trước khi thống nhất phương án phù hợp với thiết bị.', (SELECT "id" FROM "services" WHERE "slug" = 'sua-lap-may-nuoc-nong-lanh-tam'), true, CURRENT_TIMESTAMP + INTERVAL '1 milliseconds', CURRENT_TIMESTAMP);

INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('website-content-v1', 'website-content-v1', 'true'::jsonb, CURRENT_TIMESTAMP);

COMMIT;
