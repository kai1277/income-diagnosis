-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "occupation_type" TEXT NOT NULL,
    "image_url" TEXT,
    "badge_text" TEXT,
    "salary_type" TEXT NOT NULL,
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "salary_range_type" TEXT NOT NULL,
    "salary_text" TEXT NOT NULL,
    "job_location" TEXT NOT NULL,
    "job_types" JSONB NOT NULL DEFAULT '[]',
    "affiliate_url" TEXT NOT NULL,
    "impression_pixel_url" TEXT NOT NULL,
    "affiliate_network" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_requirements" (
    "id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "requirement_code_id" UUID NOT NULL,
    "level" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirement_codes" (
    "id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value_type" TEXT NOT NULL,
    "allowed_operators" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requirement_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "requirement_codes_category_code_key" ON "requirement_codes"("category", "code");

-- AddForeignKey
ALTER TABLE "job_requirements" ADD CONSTRAINT "job_requirements_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_requirements" ADD CONSTRAINT "job_requirements_requirement_code_id_fkey" FOREIGN KEY ("requirement_code_id") REFERENCES "requirement_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
