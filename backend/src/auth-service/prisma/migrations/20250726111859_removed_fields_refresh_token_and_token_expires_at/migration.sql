/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiresAt` on the `Auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "refreshToken",
DROP COLUMN "tokenExpiresAt";
