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
const notification_entity_1 = require("../notification.entity");
class CreateNotificationDto {
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumberString(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "id", void 0);
__decorate([
    class_validator_1.MaxLength(200),
    class_validator_1.MinLength(3),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum([
        notification_entity_1.NotificationType.Promotional.toString(),
        notification_entity_1.NotificationType.General.toString(),
    ]),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEnum([
        notification_entity_1.PriorityType.Urgent.toString(),
        notification_entity_1.PriorityType.Immediate.toString(),
        notification_entity_1.PriorityType.Normal.toString(),
    ]),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "priority", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumberString(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "courseId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumberString({ each: true }),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "alreadySeenIds", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.MaxLength(255),
    class_validator_1.MinLength(5),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "startDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDateString(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "endDate", void 0);
exports.CreateNotificationDto = CreateNotificationDto;
//# sourceMappingURL=notification.dto.js.map