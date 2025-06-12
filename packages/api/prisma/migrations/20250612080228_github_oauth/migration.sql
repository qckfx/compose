/*
  Warnings:

  - You are about to drop the `GhInstallation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserInstallation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ghRepoUrl` to the `Doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Doc" DROP CONSTRAINT "Doc_ghRepoId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_installation_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInstallation" DROP CONSTRAINT "UserInstallation_installation_id_fkey";

-- DropForeignKey
ALTER TABLE "UserInstallation" DROP CONSTRAINT "UserInstallation_user_id_fkey";

-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "ghRepoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- DropTable
DROP TABLE "GhInstallation";

-- DropTable
DROP TABLE "Repository";

-- DropTable
DROP TABLE "UserInstallation";

-- DropEnum
DROP TYPE "GhAccountType";

-- CreateTable
CREATE TABLE "GithubAuth" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GithubAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubAuth_userId_key" ON "GithubAuth"("userId");

-- CreateIndex
CREATE INDEX "GithubAuth_userId_idx" ON "GithubAuth"("userId");

-- AddForeignKey
ALTER TABLE "GithubAuth" ADD CONSTRAINT "GithubAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
