import { User } from 'src/users/user.entity';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationRepository } from './notification.repository';
export declare class NotificationService {
    private notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    findAllGeneralNotification(options?: any): Promise<any>;
    createNotification(createNotification: CreateNotificationDto, user: User): Promise<{
        message: string;
        data: any;
    }>;
    updateNotification(createNotification: CreateNotificationDto, user: User): Promise<{
        message: string;
        data: any;
    }>;
}
