-- CreateTable
CREATE TABLE "public"."WorkspaceInvite" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."WorkspaceRole" NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvite_token_key" ON "public"."WorkspaceInvite"("token");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvite_workspaceId_email_key" ON "public"."WorkspaceInvite"("workspaceId", "email");

-- AddForeignKey
ALTER TABLE "public"."WorkspaceInvite" ADD CONSTRAINT "WorkspaceInvite_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
