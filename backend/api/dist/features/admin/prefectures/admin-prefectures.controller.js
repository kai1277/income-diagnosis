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
exports.PrefecturesController = void 0;
const common_1 = require("@nestjs/common");
const admin_prefectures_service_1 = require("./admin-prefectures.service");
const admin_prefectures_schema_1 = require("./admin-prefectures.schema");
let PrefecturesController = class PrefecturesController {
    service;
    constructor(service) {
        this.service = service;
    }
    getPrefectures() {
        return this.service.getPrefectures();
    }
    getCitiesByPrefectureId(id) {
        return this.service.getCitiesByPrefectureId(id);
    }
    createCity(id, dto) {
        return this.service.createCity(id, dto.name);
    }
};
exports.PrefecturesController = PrefecturesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PrefecturesController.prototype, "getPrefectures", null);
__decorate([
    (0, common_1.Get)(':id/cities'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PrefecturesController.prototype, "getCitiesByPrefectureId", null);
__decorate([
    (0, common_1.Post)(':id/cities'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_prefectures_schema_1.CreateCityDto]),
    __metadata("design:returntype", void 0)
], PrefecturesController.prototype, "createCity", null);
exports.PrefecturesController = PrefecturesController = __decorate([
    (0, common_1.Controller)('admin/prefectures'),
    __metadata("design:paramtypes", [admin_prefectures_service_1.PrefecturesService])
], PrefecturesController);
