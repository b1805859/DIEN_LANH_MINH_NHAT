CREATE TABLE "consultation_requests" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactedAt" TIMESTAMP(3),
    CONSTRAINT "consultation_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "consultation_requests_contactedAt_createdAt_idx"
    ON "consultation_requests"("contactedAt", "createdAt");
