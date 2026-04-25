-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ROLE_MANDATE', 'SUBSIDIARY_BRIEF', 'BOARD_NOTE');

-- CreateTable
CREATE TABLE "GeneratedDocument" (
    "id" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "subject" TEXT NOT NULL,
    "bulletPoints" TEXT NOT NULL,
    "specificInstructions" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "generatedOutput" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedDocument_pkey" PRIMARY KEY ("id")
);
