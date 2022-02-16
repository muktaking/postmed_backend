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
const userExamExamProfile_entity_1 = require("./userExamExamProfile.entity");
let ExamActivityStat = class ExamActivityStat extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ExamActivityStat.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], ExamActivityStat.prototype, "totalScore", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], ExamActivityStat.prototype, "totalWrongScore", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], ExamActivityStat.prototype, "totalPenaltyScore", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ExamActivityStat.prototype, "totalRightStems", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ExamActivityStat.prototype, "totalWrongStems", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ExamActivityStat.prototype, "totalRightSbaQuestions", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ExamActivityStat.prototype, "totalWrongSbaQuestions", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Object)
], ExamActivityStat.prototype, "attemptTime", void 0);
__decorate([
    typeorm_1.OneToMany(() => questionActivityStat_entity_1.QuestionActivityStat, (questionActivityStat) => questionActivityStat.examActivityStat, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], ExamActivityStat.prototype, "questionActivityStat", void 0);
__decorate([
    typeorm_1.ManyToOne(() => userExamExamProfile_entity_1.UserExamExamProfile, (userExamExamProfile) => userExamExamProfile.examActivityStat, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }),
    __metadata("design:type", userExamExamProfile_entity_1.UserExamExamProfile)
], ExamActivityStat.prototype, "userExamExamProfile", void 0);
ExamActivityStat = __decorate([
    typeorm_1.Entity()
], ExamActivityStat);
exports.ExamActivityStat = ExamActivityStat;
//# sourceMappingURL=examActivityStat.entity.js.map