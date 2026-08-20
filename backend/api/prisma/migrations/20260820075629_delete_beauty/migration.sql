/*
  Warnings:

  - You are about to drop the `beauty_diagnosis_results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `beauty_kept_jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `beauty_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "beauty_diagnosis_results" DROP CONSTRAINT "beauty_diagnosis_results_beauty_user_id_fkey";

-- DropForeignKey
ALTER TABLE "beauty_kept_jobs" DROP CONSTRAINT "beauty_kept_jobs_beauty_user_id_fkey";

-- DropForeignKey
ALTER TABLE "beauty_kept_jobs" DROP CONSTRAINT "beauty_kept_jobs_job_id_fkey";

-- DropTable
DROP TABLE "beauty_diagnosis_results";

-- DropTable
DROP TABLE "beauty_kept_jobs";

-- DropTable
DROP TABLE "beauty_users";
