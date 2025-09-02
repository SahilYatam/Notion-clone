-- CreateEnum
CREATE TYPE "public"."WorkspaceType" AS ENUM ('PERSONAL', 'TEAM');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "workspaceType" "public"."WorkspaceType" NOT NULL DEFAULT 'PERSONAL';
