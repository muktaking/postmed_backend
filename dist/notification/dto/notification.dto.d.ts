import { NotificationType, PriorityType } from '../notification.entity';
export declare class CreateNotificationDto {
    id: string;
    title: string;
    type: NotificationType;
    priority: PriorityType;
    courseId: string;
    alreadySeenIds: string[];
    description: string;
    startDate: string;
    endDate: string;
}
