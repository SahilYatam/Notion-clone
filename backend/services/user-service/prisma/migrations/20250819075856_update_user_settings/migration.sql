/*
  Warnings:

  - You are about to drop the column `userId` on the `UserSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authId]` on the table `UserSettings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authId` to the `UserSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropIndex
DROP INDEX "public"."UserSettings_userId_key";

-- AlterTable
ALTER TABLE "public"."UserSettings" DROP COLUMN "userId",
ADD COLUMN     "authId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_authId_key" ON "public"."UserSettings"("authId");

-- AddForeignKey
ALTER TABLE "public"."UserSettings" ADD CONSTRAINT "UserSettings_authId_fkey" FOREIGN KEY ("authId") REFERENCES "public"."User"("authId") ON DELETE CASCADE ON UPDATE CASCADE;
