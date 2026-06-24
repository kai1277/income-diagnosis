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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJobsController = void 0;
const common_1 = require("@nestjs/common");
const admin_jobs_service_1 = require("./admin-jobs.service");
const admin_jobs_schema_1 = require("./admin-jobs.schema");
let AdminJobsController = class AdminJobsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getJobs() {
        return this.service.getJobs();
    }
    createJob(dto) {
        return this.service.createJob(dto);
    }
    deleteJob(id) {
        return this.service.deleteJob(id);
    }
};
exports.AdminJobsController = AdminJobsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminJobsController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_jobs_schema_1.CreateJobDto]),
    __metadata("design:returntype", void 0)
], AdminJobsController.prototype, "createJob", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminJobsController.prototype, "deleteJob", null);
exports.AdminJobsController = AdminJobsController = __decorate([
    (0, common_1.Controller)('admin/jobs'),
    __metadata("design:paramtypes", [admin_jobs_service_1.AdminJobsService])
], AdminJobsController);
