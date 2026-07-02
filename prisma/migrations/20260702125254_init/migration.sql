-- CreateEnum
CREATE TYPE "CycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "ObjectiveLevel" AS ENUM ('COMPANY', 'SQUAD', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "ObjectiveStatus" AS ENUM ('DRAFT', 'ACTIVE', 'AT_RISK', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('PERCENTAGE', 'NUMBER', 'CURRENCY', 'BOOLEAN');

-- CreateEnum
CREATE TYPE "KrStatus" AS ENUM ('ON_TRACK', 'AT_RISK', 'BEHIND', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PdiStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "PdiItemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DROPPED');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('COURSE', 'BOOK', 'ARTICLE', 'VIDEO', 'MENTORING', 'PROJECT', 'OTHER');

-- CreateTable
CREATE TABLE "Cycle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "CycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objective" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" "ObjectiveLevel" NOT NULL,
    "status" "ObjectiveStatus" NOT NULL DEFAULT 'DRAFT',
    "parentId" TEXT,
    "ownerId" TEXT,
    "cycleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Objective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyResult" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metricType" "MetricType" NOT NULL DEFAULT 'PERCENTAGE',
    "startValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "status" "KrStatus" NOT NULL DEFAULT 'ON_TRACK',
    "confidenceScore" INTEGER,
    "objectiveId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeyResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "confidence" INTEGER,
    "keyResultId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pdi" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cycleStart" TIMESTAMP(3) NOT NULL,
    "cycleEnd" TIMESTAMP(3) NOT NULL,
    "status" "PdiStatus" NOT NULL DEFAULT 'ACTIVE',
    "summary" TEXT,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pdi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdiItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "skillArea" TEXT,
    "resourceUrl" TEXT,
    "resourceType" "ResourceType",
    "targetDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "status" "PdiItemStatus" NOT NULL DEFAULT 'PENDING',
    "priority" INTEGER NOT NULL DEFAULT 1,
    "pdiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdiItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdiNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pdiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdiNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cycle_status_idx" ON "Cycle"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_email_key" ON "TeamMember"("email");

-- CreateIndex
CREATE INDEX "Objective_cycleId_idx" ON "Objective"("cycleId");

-- CreateIndex
CREATE INDEX "Objective_parentId_idx" ON "Objective"("parentId");

-- CreateIndex
CREATE INDEX "Objective_level_status_idx" ON "Objective"("level", "status");

-- CreateIndex
CREATE INDEX "KeyResult_objectiveId_idx" ON "KeyResult"("objectiveId");

-- CreateIndex
CREATE INDEX "KeyResult_status_idx" ON "KeyResult"("status");

-- CreateIndex
CREATE INDEX "CheckIn_keyResultId_createdAt_idx" ON "CheckIn"("keyResultId", "createdAt");

-- CreateIndex
CREATE INDEX "Pdi_memberId_idx" ON "Pdi"("memberId");

-- CreateIndex
CREATE INDEX "Pdi_status_idx" ON "Pdi"("status");

-- CreateIndex
CREATE INDEX "PdiItem_pdiId_idx" ON "PdiItem"("pdiId");

-- CreateIndex
CREATE INDEX "PdiItem_status_idx" ON "PdiItem"("status");

-- CreateIndex
CREATE INDEX "PdiNote_pdiId_idx" ON "PdiNote"("pdiId");

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyResult" ADD CONSTRAINT "KeyResult_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_keyResultId_fkey" FOREIGN KEY ("keyResultId") REFERENCES "KeyResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pdi" ADD CONSTRAINT "Pdi_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdiItem" ADD CONSTRAINT "PdiItem_pdiId_fkey" FOREIGN KEY ("pdiId") REFERENCES "Pdi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdiNote" ADD CONSTRAINT "PdiNote_pdiId_fkey" FOREIGN KEY ("pdiId") REFERENCES "Pdi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
