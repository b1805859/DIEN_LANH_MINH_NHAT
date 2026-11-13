CREATE TABLE "website_daily_metrics" (
    "date" DATE NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "website_daily_metrics_pkey" PRIMARY KEY ("date"),
    CONSTRAINT "website_daily_metrics_nonnegative" CHECK ("pageViews" >= 0)
);
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");
