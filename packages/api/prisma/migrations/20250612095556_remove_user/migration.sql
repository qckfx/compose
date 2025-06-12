/*
  Warnings:

  - You are about to drop the column `ghRepoUrl` on the `Doc` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Doc` table. All the data in the column will be lost.
  - You are about to drop the `GithubAuth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clerkUserId` to the `Doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ghRepoName` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Doc" DROP CONSTRAINT "Doc_userId_fkey";

-- DropForeignKey
ALTER TABLE "GithubAuth" DROP CONSTRAINT "GithubAuth_userId_fkey";

-- DropIndex
DROP INDEX "Doc_userId_idx";

-- AlterTable
ALTER TABLE "Doc" DROP COLUMN "ghRepoUrl",
DROP COLUMN "userId",
ADD COLUMN     "clerkUserId" TEXT NOT NULL,
ADD COLUMN     "ghRepoName" TEXT NOT NULL;

-- DropTable
DROP TABLE "GithubAuth";

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE INDEX "Doc_clerkUserId_idx" ON "Doc"("clerkUserId");
