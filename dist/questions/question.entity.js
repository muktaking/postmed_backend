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
const stem_entity_1 = require("./stem.entity");
var QType;
(function (QType) {
    QType["singleBestAnswer"] = "sba";
    QType["Matrix"] = "matrix";
})(QType = exports.QType || (exports.QType = {}));
let Question = class Question extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Question.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 200, nullable: false }),
    __metadata("design:type", String)
], Question.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Question.prototype, "categoryId", void 0);
__decorate([
    typeorm_1.Column({ type: "enum", enum: QType, nullable: false }),
    __metadata("design:type", String)
], Question.prototype, "qType", void 0);
__decorate([
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Question.prototype, "qText", void 0);
__decorate([
    typeorm_1.OneToMany(() => stem_entity_1.Stem, (stem) => stem.question, { cascade: true, eager: true }),
    typeorm_1.JoinColumn({ name: "stems" }),
    __metadata("design:type", Array)
], Question.prototype, "stems", void 0);
__decorate([
    typeorm_1.Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Question.prototype, "generalFeedback", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Question.prototype, "tags", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", typeorm_1.Timestamp)
], Question.prototype, "createDate", void 0);
__decorate([
    typeorm_1.Column({ type: "timestamp" }),
    __metadata("design:type", Object)
], Question.prototype, "modifiedDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Question.prototype, "creatorId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Question.prototype, "modifiedById", void 0);
Question = __decorate([
    typeorm_1.Entity()
], Question);
exports.Question = Question;
//# sourceMappingURL=question.entity.js.map