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
var FeedbackStatus;
(function (FeedbackStatus) {
    FeedbackStatus[FeedbackStatus["belowAverage"] = 1] = "belowAverage";
    FeedbackStatus[FeedbackStatus["average"] = 2] = "average";
    FeedbackStatus[FeedbackStatus["good"] = 3] = "good";
    FeedbackStatus[FeedbackStatus["best"] = 4] = "best";
})(FeedbackStatus = exports.FeedbackStatus || (exports.FeedbackStatus = {}));
var Status;
(function (Status) {
    Status["Pending"] = "pending";
    Status["Published"] = "published";
})(Status = exports.Status || (exports.Status = {}));
let Feedback = class Feedback extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Feedback.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 30, nullable: false }),
    __metadata("design:type", String)
], Feedback.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Feedback.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Feedback.prototype, "examId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: Status,
        default: Status.Pending,
    }),
    __metadata("design:type", String)
], Feedback.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: FeedbackStatus }),
    __metadata("design:type", Number)
], Feedback.prototype, "feedbackStatus", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "message", void 0);
Feedback = __decorate([
    typeorm_1.Entity()
], Feedback);
exports.Feedback = Feedback;
//# sourceMappingURL=feedback.entity.js.map