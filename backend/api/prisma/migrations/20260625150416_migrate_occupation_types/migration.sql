/*
  Warnings:

  - You are about to drop the column `occupation_type` on the `jobs` table. All the data in the column will be lost.
  - Added the required column `occupation_type_id` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "occupation_type",
ADD COLUMN     "occupation_type_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "occupation_types" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "occupation_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "occupation_types_code_key" ON "occupation_types"("code");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_occupation_type_id_fkey" FOREIGN KEY ("occupation_type_id") REFERENCES "occupation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
