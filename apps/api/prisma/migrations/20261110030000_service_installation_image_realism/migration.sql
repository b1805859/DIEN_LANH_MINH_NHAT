-- Update the built-in illustration and preserve manually selected images.
UPDATE "services"
SET "imageUrl" = defaults.new_url,
    "updatedAt" = CURRENT_TIMESTAMP
FROM (VALUES
  ('lap-dat-may-lanh', '/images/redesign/lap-may-lanh-len-gia-uniform-v1.webp', '/images/redesign/lap-may-lanh-len-gia-uniform-v2.webp'),
  ('nap-gas-may-lanh', '/images/redesign/nap-gas-may-lanh-uniform-v1.webp', '/images/redesign/nap-gas-may-lanh-uniform-v2.webp')
) AS defaults(slug, old_url, new_url)
WHERE "services"."slug" = defaults.slug AND "services"."imageUrl" = defaults.old_url;
