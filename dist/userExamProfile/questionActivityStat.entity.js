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
const examActivityStat_entity_1 = require("./examActivityStat.entity");
const stemActivityStat_entity_1 = require("./stemActivityStat.entity");
let QuestionActivityStat = class QuestionActivityStat extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], QuestionActivityStat.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], QuestionActivityStat.prototype, "questionId", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], QuestionActivityStat.prototype, "score", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], QuestionActivityStat.prototype, "wrongScore", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], QuestionActivityStat.prototype, "penaltyScore", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], QuestionActivityStat.prototype, "rightStems", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], QuestionActivityStat.prototype, "wrongStems", void 0);
__decorate([
    typeorm_1.OneToMany(() => stemActivityStat_entity_1.StemActivityStat, (stemActivityStat) => stemActivityStat.questionActivityStat, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], QuestionActivityStat.prototype, "stemActivityStat", void 0);
__decorate([
    typeorm_1.ManyToOne(() => examActivityStat_entity_1.ExamActivityStat, (examActivityStat) => examActivityStat.questionActivityStat, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }),
    __metadata("design:type", examActivityStat_entity_1.ExamActivityStat)
], QuestionActivityStat.prototype, "examActivityStat", void 0);
QuestionActivityStat = __decorate([
    typeorm_1.Entity()
], QuestionActivityStat);
exports.QuestionActivityStat = QuestionActivityStat;
//# sourceMappingURL=questionActivityStat.entity.js.map