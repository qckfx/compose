CREATE EXTENSION IF NOT EXISTS citext;
/*
  Warnings:

  - You are about to drop the column `repoUrl` on the `Doc` table. All the data in the column will be lost.
  - Added the required column `ghRepoId` to the `Doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GhAccountType" AS ENUM ('User', 'Organization', 'Bot');

-- AlterTable
ALTER TABLE "Doc" DROP COLUMN "repoUrl",
ADD COLUMN     "ghRepoId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GhInstallation" (
    "id" TEXT NOT NULL,
    "gh_installation_id" BIGINT NOT NULL,
    "account_login" TEXT NOT NULL,
    "account_type" "GhAccountType" NOT NULL,
    "suspended_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GhInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "gh_repo_id" BIGINT NOT NULL,
    "full_name" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "installation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInstallation" (
    "user_id" TEXT NOT NULL,
    "installation_id" TEXT NOT NULL,
    "connected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInstallation_pkey" PRIMARY KEY ("user_id","installation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GhInstallation_gh_installation_id_key" ON "GhInstallation"("gh_installation_id");

-- CreateIndex
CREATE INDEX "GhInstallation_account_login_idx" ON "GhInstallation"("account_login");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_gh_repo_id_key" ON "Repository"("gh_repo_id");

-- CreateIndex
CREATE INDEX "Repository_installation_id_idx" ON "Repository"("installation_id");

-- CreateIndex
CREATE INDEX "Repository_private_idx" ON "Repository"("private");

-- CreateIndex
CREATE INDEX "Repository_installation_id_disabled_idx" ON "Repository"("installation_id", "disabled");

-- CreateIndex
CREATE INDEX "Doc_userId_idx" ON "Doc"("userId");

-- AddForeignKey
ALTER TABLE "Doc" ADD CONSTRAINT "Doc_ghRepoId_fkey" FOREIGN KEY ("ghRepoId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doc" ADD CONSTRAINT "Doc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "GhInstallation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInstallation" ADD CONSTRAINT "UserInstallation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInstallation" ADD CONSTRAINT "UserInstallation_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "GhInstallation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
