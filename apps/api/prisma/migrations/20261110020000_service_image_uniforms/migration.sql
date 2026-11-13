-- Update only the previous illustration defaults, preserving manually selected images.
UPDATE "services" AS service
SET "imageUrl" = defaults.new_url,
    "updatedAt" = CURRENT_TIMESTAMP
FROM (VALUES
  ('thao-di-doi-may-lanh', '/images/redesign/thao-may-lanh-khoi-gia-v1.webp', '/images/redesign/thao-may-lanh-khoi-gia-uniform-v1.webp'),
  ('lap-dat-may-lanh', '/images/redesign/lap-may-lanh-len-gia-v1.webp', '/images/redesign/lap-may-lanh-len-gia-uniform-v1.webp'),
  ('sua-may-lanh', '/images/redesign/sua-may-lanh-kiem-tra-bo-mach-v1.webp', '/images/redesign/sua-may-lanh-kiem-tra-bo-mach-uniform-v1.webp')
) AS defaults(slug, old_url, new_url)
WHERE service."slug" = defaults.slug AND service."imageUrl" = defaults.old_url;
