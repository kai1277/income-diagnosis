-- CreateTable
CREATE TABLE "job_occupation_types" (
    "job_id" UUID NOT NULL,
    "occupation_type_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_occupation_types_pkey" PRIMARY KEY ("job_id","occupation_type_id")
);

-- AddForeignKey
ALTER TABLE "job_occupation_types" ADD CONSTRAINT "job_occupation_types_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_occupation_types" ADD CONSTRAINT "job_occupation_types_occupation_type_id_fkey" FOREIGN KEY ("occupation_type_id") REFERENCES "occupation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
