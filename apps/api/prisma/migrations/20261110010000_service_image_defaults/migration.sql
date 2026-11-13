-- Replace only known default paths and preserve uploaded images.
UPDATE "services" AS service
SET "imageUrl" = defaults.new_url,
    "imageAlt" = CASE WHEN COALESCE(service."imageAlt", '') IN ('', service."name")
                      THEN defaults.new_alt ELSE service."imageAlt" END,
    "updatedAt" = CURRENT_TIMESTAMP
FROM (VALUES
  ('thao-di-doi-may-lanh', '/images/services/thao-di-doi-may-lanh.jpg', '/images/redesign/thao-may-lanh-khoi-gia-v1.webp', 'Kỹ thuật viên nhấc dàn lạnh ra khỏi giá treo trên tường'),
  ('thao-di-doi-may-lanh', '/images/redesign/thao-lap-may-lanh-uniform-v1.webp', '/images/redesign/thao-may-lanh-khoi-gia-v1.webp', 'Kỹ thuật viên nhấc dàn lạnh ra khỏi giá treo trên tường'),
  ('thao-di-doi-may-lanh', '/images/services/thao-lap-may-lanh.jpg', '/images/redesign/thao-may-lanh-khoi-gia-v1.webp', 'Kỹ thuật viên nhấc dàn lạnh ra khỏi giá treo trên tường'),
  ('lap-dat-may-lanh', '/images/services/lap-dat-may-lanh.jpg', '/images/redesign/lap-may-lanh-len-gia-v1.webp', 'Kỹ thuật viên nâng dàn lạnh lên giá treo tại vị trí lắp mới'),
  ('lap-dat-may-lanh', '/images/redesign/thao-lap-may-lanh-uniform-v1.webp', '/images/redesign/lap-may-lanh-len-gia-v1.webp', 'Kỹ thuật viên nâng dàn lạnh lên giá treo tại vị trí lắp mới'),
  ('lap-dat-may-lanh', '/images/services/thao-lap-may-lanh.jpg', '/images/redesign/lap-may-lanh-len-gia-v1.webp', 'Kỹ thuật viên nâng dàn lạnh lên giá treo tại vị trí lắp mới'),
  ('sua-may-lanh', '/images/services/sua-may-lanh.jpg', '/images/redesign/sua-may-lanh-kiem-tra-bo-mach-v1.webp', 'Kỹ thuật viên dùng đồng hồ đo để kiểm tra bo mạch máy lạnh'),
  ('sua-may-lanh', '/images/redesign/sua-may-lanh-realism-v2-uniform-v1.webp', '/images/redesign/sua-may-lanh-kiem-tra-bo-mach-v1.webp', 'Kỹ thuật viên dùng đồng hồ đo để kiểm tra bo mạch máy lạnh'),
  ('ve-sinh-may-lanh', '/images/services/ve-sinh-may-lanh.jpg', '/images/redesign/ve-sinh-may-lanh-hold-bag-v3-uniform-v1.webp', 'Kỹ thuật viên rửa dàn lạnh có túi hứng nước'),
  ('nap-gas-may-lanh', '/images/services/nap-gas-may-lanh.jpg', '/images/redesign/nap-gas-may-lanh-uniform-v1.webp', 'Kỹ thuật viên kiểm tra bộ đồng hồ nạp gas cạnh dàn nóng'),
  ('sua-may-giat', '/images/services/sua-may-giat.jpg', '/images/redesign/sua-may-giat-motor-repair-uniform-v1.webp', 'Kỹ thuật viên kiểm tra cụm truyền động phía sau máy giặt'),
  ('ve-sinh-may-giat', '/images/services/ve-sinh-may-giat.jpg', '/images/redesign/ve-sinh-may-giat-uniform-v1.webp', 'Kỹ thuật viên lau gioăng cửa máy giặt cửa trước'),
  ('sua-tu-lanh', '/images/services/sua-tu-lanh.jpg', '/images/redesign/sua-tu-lanh-rear-repair-v2-uniform-v1.webp', 'Kỹ thuật viên kiểm tra cụm máy ở phía sau tủ lạnh'),
  ('sua-dien-nuoc', '/images/services/sua-dien-nuoc.jpg', '/images/redesign/sua-dien-nuoc-uniform-v1.webp', 'Kỹ thuật viên thao tác tại cụm đường ống nước trong nhà'),
  ('sua-lap-may-nuoc-uong-nong-lanh', '/images/services/sua-lap-may-nuoc-uong-nong-lanh.jpg', '/images/redesign/sua-lap-may-nuoc-uong-nong-lanh-uniform-v1.webp', 'Kỹ thuật viên kiểm tra khoang kỹ thuật máy nước uống nóng lạnh'),
  ('sua-lap-may-nuoc-nong-lanh-tam', '/images/services/sua-lap-may-nuoc-nong-lanh-tam.jpg', '/images/redesign/sua-lap-may-nuoc-nong-lanh-tam-uniform-v1.webp', 'Kỹ thuật viên kiểm tra đầu nối nước của máy nước nóng dùng để tắm')
) AS defaults(slug, old_url, new_url, new_alt)
WHERE service."slug" = defaults.slug AND service."imageUrl" = defaults.old_url;
