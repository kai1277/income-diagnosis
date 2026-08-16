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
exports.PrefecturesService = void 0;
const common_1 = require("@nestjs/common");
const admin_prefectures_repositories_1 = require("../../../repositories/admin-prefectures.repositories");
let PrefecturesService = class PrefecturesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    getPrefectures() {
        return this.repo.findAll();
    }
    getCitiesByPrefectureId(prefectureId) {
        return this.repo.findCitiesByPrefectureId(prefectureId);
    }
    createCity(prefectureId, name) {
        return this.repo.createCity(prefectureId, name);
    }
};
exports.PrefecturesService = PrefecturesService;
exports.PrefecturesService = PrefecturesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_prefectures_repositories_1.PrefecturesRepository])
], PrefecturesService);
