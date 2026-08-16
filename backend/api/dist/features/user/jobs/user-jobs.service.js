"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserJobsService = void 0;
const common_1 = require("@nestjs/common");
const user_jobs_repository_1 = require("../../../repositories/user-jobs.repository");
let UserJobsService = class UserJobsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getJobsByOccupationCodes(codes) {
        if (!codes.length)
            return [];
        const jobs = await this.repo.findByOccupationCodes(codes);
        return jobs.map((job) => ({
            id: job.id,
            imageUrl: job.image_url,
            imageBadge: job.badge_text,
            title: job.title,
            incomeRange: job.salary_text,
            location: job.job_location,
            jobTypes: Array.isArray(job.job_types) ? job.job_types : [],
            affiliateUrl: job.affiliate_url,
            impressionPixelUrl: job.impression_pixel_url,
        }));
    }
};
exports.UserJobsService = UserJobsService;
exports.UserJobsService = UserJobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_jobs_repository_1.UserJobsRepository])
], UserJobsService);
