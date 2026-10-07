-- Match the booking request form and Prisma schema: customers may request
-- service before a district and appointment date have been confirmed.
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_locationId_fkey";

ALTER TABLE "bookings"
  ALTER COLUMN "locationId" DROP NOT NULL,
  ALTER COLUMN "scheduledDate" DROP NOT NULL;

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_locationId_fkey"
  FOREIGN KEY ("locationId") REFERENCES "locations"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
