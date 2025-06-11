-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('drafting', 'completed', 'error');

-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "status" "DocStatus" NOT NULL DEFAULT 'drafting';
