/*
  Warnings:

  - You are about to drop the column `otp` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `Auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "otp",
DROP COLUMN "otpExpiresAt",
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);
