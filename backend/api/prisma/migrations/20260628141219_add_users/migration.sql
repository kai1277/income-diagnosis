-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "line_user_id" UUID NOT NULL,
    "display_name" TEXT,
    "picture_url" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_line_user_id_key" ON "users"("line_user_id");
