-- CreateTable
CREATE TABLE "beauty_kept_jobs" (
    "beauty_user_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beauty_kept_jobs_pkey" PRIMARY KEY ("beauty_user_id","job_id")
);

-- AddForeignKey
ALTER TABLE "beauty_kept_jobs" ADD CONSTRAINT "beauty_kept_jobs_beauty_user_id_fkey" FOREIGN KEY ("beauty_user_id") REFERENCES "beauty_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beauty_kept_jobs" ADD CONSTRAINT "beauty_kept_jobs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
