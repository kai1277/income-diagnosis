/*
  Warnings:

  - You are about to drop the column `occupation_type_id` on the `jobs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_occupation_type_id_fkey";

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "occupation_type_id";
