-- CreateTable
CREATE TABLE "chat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "modelA" TEXT NOT NULL,
    "temperatureA" DOUBLE PRECISION NOT NULL,
    "topPA" DOUBLE PRECISION NOT NULL,
    "modelB" TEXT NOT NULL,
    "temperatureB" DOUBLE PRECISION NOT NULL,
    "topPB" DOUBLE PRECISION NOT NULL,
    "responseA" TEXT,
    "metricsA" JSONB,
    "errorA" TEXT,
    "responseB" TEXT,
    "metricsB" JSONB,
    "errorB" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_userId_idx" ON "chat"("userId");

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
