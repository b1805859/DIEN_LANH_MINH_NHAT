-- Preserve existing booking/SEO relations when replacing the combined service.
UPDATE "services"
SET "slug" = 'thao-di-doi-may-lanh',
    "name" = 'Tháo dỡ, di dời máy lạnh',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'thao-lap-may-lanh'
  AND NOT EXISTS (SELECT 1 FROM "services" WHERE "slug" = 'thao-di-doi-may-lanh');

INSERT INTO "services" ("id", "name", "slug", "summary", "imageUrl", "imageAlt", "displayOrder", "updatedAt")
VALUES
  ('service_thao_di_doi_may_lanh', 'Tháo dỡ, di dời máy lạnh', 'thao-di-doi-may-lanh',
   'Tháo dỡ và di dời máy lạnh tại Cần Thơ; khảo sát và báo giá trước khi thực hiện.',
   '/images/redesign/thao-lap-may-lanh-uniform-v1.webp', 'Tháo dỡ, di dời máy lạnh', 0, CURRENT_TIMESTAMP),
  ('service_lap_dat_may_lanh', 'Lắp đặt máy lạnh', 'lap-dat-may-lanh',
   'Lắp máy lạnh mới hoặc lắp lại máy đã sử dụng tại Cần Thơ; khảo sát và báo giá trước khi thực hiện.',
   '/images/redesign/thao-lap-may-lanh-uniform-v1.webp', 'Lắp đặt máy lạnh', 1, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;
