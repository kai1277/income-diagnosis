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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/prisma/client");
let PrismaService = class PrismaService {
    client;
    constructor() {
        const adapter = new adapter_pg_1.PrismaPg({
            connectionString: process.env.DATABASE_URL,
        });
        this.client = new client_1.PrismaClient({ adapter });
    }
    get job() {
        return this.client.job;
    }
    get jobRequirement() {
        return this.client.jobRequirement;
    }
    get requirementCode() {
        return this.client.requirementCode;
    }
    get occupationType() {
        return this.client.occupationType;
    }
    get prefecture() {
        return this.client.prefecture;
    }
    get city() {
        return this.client.city;
    }
    get user() {
        return this.client.user;
    }
    async onModuleInit() {
        await this.client.$connect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
