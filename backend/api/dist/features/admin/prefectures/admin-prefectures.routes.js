"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefecturesModule = void 0;
const common_1 = require("@nestjs/common");
const admin_prefectures_controller_1 = require("./admin-prefectures.controller");
const admin_prefectures_service_1 = require("./admin-prefectures.service");
const admin_prefectures_repositories_1 = require("../../../repositories/admin-prefectures.repositories");
let PrefecturesModule = class PrefecturesModule {
};
exports.PrefecturesModule = PrefecturesModule;
exports.PrefecturesModule = PrefecturesModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_prefectures_controller_1.PrefecturesController],
        providers: [admin_prefectures_service_1.PrefecturesService, admin_prefectures_repositories_1.PrefecturesRepository],
    })
], PrefecturesModule);
