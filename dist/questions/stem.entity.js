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
const question_entity_1 = require("./question.entity");
let Stem = class Stem extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Stem.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "text", nullable: false }),
    __metadata("design:type", String)
], Stem.prototype, "qStem", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: 1, nullable: true }),
    __metadata("design:type", String)
], Stem.prototype, "aStem", void 0);
__decorate([
    typeorm_1.Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Stem.prototype, "fbStem", void 0);
__decorate([
    typeorm_1.ManyToOne(() => question_entity_1.Question, (question) => question.stems, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", question_entity_1.Question)
], Stem.prototype, "question", void 0);
Stem = __decorate([
    typeorm_1.Entity()
], Stem);
exports.Stem = Stem;
//# sourceMappingURL=stem.entity.js.map