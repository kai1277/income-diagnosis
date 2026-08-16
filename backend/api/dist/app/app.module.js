"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../db/database.module");
const admin_jobs_routes_1 = require("../features/admin/jobs/admin-jobs.routes");
const requirement_codes_routes_1 = require("../features/admin/requirement-codes/requirement-codes.routes");
const occupation_types_routes_1 = require("../features/admin/occupation-types/occupation-types.routes");
const admin_prefectures_routes_1 = require("../features/admin/prefectures/admin-prefectures.routes");
const diagnosis_routes_1 = require("../features/user/diagnosis/diagnosis.routes");
const user_jobs_routes_1 = require("../features/user/jobs/user-jobs.routes");
const auth_routes_1 = require("../features/auth/auth.routes");
const user_routes_1 = require("../features/user/users/user.routes");
const beauty_diagnosis_routes_1 = require("../features/beauty/diagnosis/beauty-diagnosis.routes");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            admin_jobs_routes_1.AdminJobsModule,
            requirement_codes_routes_1.RequirementCodesModule,
            occupation_types_routes_1.OccupationTypesModule,
            admin_prefectures_routes_1.PrefecturesModule,
            diagnosis_routes_1.DiagnosisModule,
            user_jobs_routes_1.UserJobsModule,
            auth_routes_1.AuthModule,
            user_routes_1.UserModule,
            beauty_diagnosis_routes_1.BeautyDiagnosisModule,
        ],
    })
], AppModule);
