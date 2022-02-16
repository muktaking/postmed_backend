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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const utils_1 = require("../utils/utils");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./notification.entity");
const notification_repository_1 = require("./notification.repository");
let NotificationService = class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async findAllGeneralNotification(options = null) {
        if (options) {
            const { courseId, dayLimit } = options;
            const [err, gns] = await utils_1.to(this.notificationRepository.find({
                select: [
                    'id',
                    'title',
                    'description',
                    'priority',
                    'startDate',
                    'endDate',
                ],
                where: {
                    type: notification_entity_1.NotificationType.General,
                    courseId: courseId ? +courseId : typeorm_2.IsNull(),
                    startDate: typeorm_2.LessThanOrEqual(new Date()),
                },
            }));
            console.log(err);
            if (err)
                throw new common_1.InternalServerErrorException(err.message);
            return gns;
        }
        const [err, gns] = await utils_1.to(this.notificationRepository.find({
            where: {
                type: notification_entity_1.NotificationType.General,
            },
        }));
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        return gns;
    }
    async createNotification(createNotification, user) {
        const { title, type, priority, courseId, alreadySeenIds, description, startDate, endDate, } = createNotification;
        const notification = this.notificationRepository.create({
            title,
            type,
            priority,
            courseId: +courseId,
            alreadySeenIds,
            description,
            startDate,
            endDate,
            creatorId: user.id,
        });
        const [err, res] = await utils_1.to(notification.save());
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        return { message: 'Successfully created the notification', data: res };
    }
    async updateNotification(createNotification, user) {
        const { id, title, type, priority, courseId, alreadySeenIds, description, startDate, endDate, } = createNotification;
        const [err, notification] = await utils_1.to(this.notificationRepository.findOne(+id));
        console.log(err);
        if (err)
            throw new common_1.InternalServerErrorException(err.message);
        if (notification) {
            notification.title = title;
            notification.type = type;
            notification.priority = priority;
            notification.courseId = +courseId;
            notification.alreadySeenIds = alreadySeenIds;
            notification.description = description;
            notification.startDate = startDate;
            notification.endDate = endDate;
            notification.modifiedBy = user.id;
        }
        const [err1, res] = await utils_1.to(notification.save());
        console.log(err1);
        if (err1)
            throw new common_1.InternalServerErrorException(err1.message);
        return { message: 'Successfully updated the notification', data: res };
    }
};
NotificationService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(notification_repository_1.NotificationRepository)),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map