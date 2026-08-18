-- CreateTable
CREATE TABLE "beauty_diagnosis_results" (
    "id" UUID NOT NULL,
    "beauty_user_id" UUID,
    "answers" JSONB NOT NULL,
    "quiz_version" INTEGER NOT NULL DEFAULT 1,
    "potential_income" INTEGER NOT NULL,
    "income_low" INTEGER NOT NULL,
    "income_high" INTEGER NOT NULL,
    "result_snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beauty_diagnosis_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "beauty_diagnosis_results_beauty_user_id_idx" ON "beauty_diagnosis_results"("beauty_user_id");

-- CreateIndex
CREATE INDEX "beauty_diagnosis_results_created_at_idx" ON "beauty_diagnosis_results"("created_at");

-- AddForeignKey
ALTER TABLE "beauty_diagnosis_results" ADD CONSTRAINT "beauty_diagnosis_results_beauty_user_id_fkey" FOREIGN KEY ("beauty_user_id") REFERENCES "beauty_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
