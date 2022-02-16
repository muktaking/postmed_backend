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
const typeorm_1 = require("typeorm");
const questionActivityStat_entity_1 = require("./questionActivityStat.entity");
let StemActivityStat = class StemActivityStat extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], StemActivityStat.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1, nullable: true }),
    __metadata("design:type", String)
], StemActivityStat.prototype, "aStem", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 1, nullable: true }),
    __metadata("design:type", String)
], StemActivityStat.prototype, "aStemStatus", void 0);
__decorate([
    typeorm_1.ManyToOne(() => questionActivityStat_entity_1.QuestionActivityStat, (questionActivityStat) => questionActivityStat.stemActivityStat, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", questionActivityStat_entity_1.QuestionActivityStat)
], StemActivityStat.prototype, "questionActivityStat", void 0);
StemActivityStat = __decorate([
    typeorm_1.Entity()
], StemActivityStat);
exports.StemActivityStat = StemActivityStat;
//# sourceMappingURL=stemActivityStat.entity.js.map