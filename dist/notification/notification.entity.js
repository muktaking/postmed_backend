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
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["Promotional"] = 1] = "Promotional";
    NotificationType[NotificationType["General"] = 2] = "General";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
var PriorityType;
(function (PriorityType) {
    PriorityType[PriorityType["Urgent"] = 1] = "Urgent";
    PriorityType[PriorityType["Immediate"] = 2] = "Immediate";
    PriorityType[PriorityType["Normal"] = 3] = "Normal";
})(PriorityType = exports.PriorityType || (exports.PriorityType = {}));
let Notification = class Notification extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: NotificationType }),
    __metadata("design:type", Number)
], Notification.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: PriorityType }),
    __metadata("design:type", Number)
], Notification.prototype, "priority", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "courseId", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-array' }),
    __metadata("design:type", Array)
], Notification.prototype, "alreadySeenIds", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Notification.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", typeorm_1.Timestamp)
], Notification.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", typeorm_1.Timestamp)
], Notification.prototype, "startDate", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", typeorm_1.Timestamp)
], Notification.prototype, "endDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Notification.prototype, "creatorId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "modifiedBy", void 0);
Notification = __decorate([
    typeorm_1.Entity()
], Notification);
exports.Notification = Notification;
//# sourceMappingURL=notification.entity.js.map