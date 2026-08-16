"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupationTypesModule = void 0;
const common_1 = require("@nestjs/common");
const occupation_types_controller_1 = require("./occupation-types.controller");
const occupation_types_service_1 = require("./occupation-types.service");
const occupation_types_repository_1 = require("../../../repositories/occupation-types.repository");
let OccupationTypesModule = class OccupationTypesModule {
};
exports.OccupationTypesModule = OccupationTypesModule;
exports.OccupationTypesModule = OccupationTypesModule = __decorate([
    (0, common_1.Module)({
        controllers: [occupation_types_controller_1.OccupationTypesController],
        providers: [occupation_types_service_1.OccupationTypesService, occupation_types_repository_1.OccupationTypesRepository],
    })
], OccupationTypesModule);
