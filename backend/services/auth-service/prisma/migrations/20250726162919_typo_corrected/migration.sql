/*
  Warnings:

  - You are about to drop the column `refreshToekn` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshToken` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_refreshToekn_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "refreshToekn",
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");
