"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const routine_controller_1 = require("./routine.controller");
const routine_repository_1 = require("./routine.repository");
const routine_service_1 = require("./routine.service");
let RoutineModule = class RoutineModule {
};
RoutineModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([routine_repository_1.RoutineRepository])],
        controllers: [routine_controller_1.RoutineController],
        providers: [routine_service_1.RoutineService],
    })
], RoutineModule);
exports.RoutineModule = RoutineModule;
//# sourceMappingURL=routine.module.js.map