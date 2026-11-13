-- Hide the retired service without deleting existing booking references.
UPDATE "services"
SET "isActive" = false, "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'nap-gas-may-lanh' AND "isActive" = true;
