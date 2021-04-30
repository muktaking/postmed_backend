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
const class_validator_1 = require("class-validator");
const feedback_entity_1 = require("../feedback.entity");
class CreateFeedbackDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumberString(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "examId", void 0);
__decorate([
    class_validator_1.MaxLength(30),
    class_validator_1.MinLength(3),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum([
        feedback_entity_1.FeedbackStatus.belowAverage.toString(),
        feedback_entity_1.FeedbackStatus.average.toString(),
        feedback_entity_1.FeedbackStatus.good.toString(),
        feedback_entity_1.FeedbackStatus.best.toString(),
    ]),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "feedbackStatus", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MaxLength(255),
    class_validator_1.MinLength(5),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "message", void 0);
exports.CreateFeedbackDto = CreateFeedbackDto;
//# sourceMappingURL=flag.dto.js.map