"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJobsModule = void 0;
const common_1 = require("@nestjs/common");
const admin_jobs_controller_1 = require("./admin-jobs.controller");
const admin_jobs_service_1 = require("./admin-jobs.service");
const admin_jobs_repositories_1 = require("../../../repositories/admin-jobs.repositories");
let AdminJobsModule = class AdminJobsModule {
};
exports.AdminJobsModule = AdminJobsModule;
exports.AdminJobsModule = AdminJobsModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_jobs_controller_1.AdminJobsController],
        providers: [admin_jobs_service_1.AdminJobsService, admin_jobs_repositories_1.AdminJobsRepository],
    })
], AdminJobsModule);
