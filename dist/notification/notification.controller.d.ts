import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAllGeneralNotification(options: any): Promise<any>;
    createNotification(createNotification: CreateNotificationDto, req: any): Promise<{
        message: string;
        data: any;
    }>;
    updateNotification(createNotification: CreateNotificationDto, req: any): Promise<{
        message: string;
        data: any;
    }>;
}
