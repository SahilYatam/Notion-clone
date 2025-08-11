-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('EMAIL_ENTERED', 'EMAIL_VERIFIED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "onboardingStatus" "OnboardingStatus" NOT NULL DEFAULT 'EMAIL_ENTERED',
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
