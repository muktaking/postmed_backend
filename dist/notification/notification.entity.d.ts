import { BaseEntity, Timestamp } from 'typeorm';
export declare enum NotificationType {
    Promotional = 1,
    General = 2
}
export declare enum PriorityType {
    Urgent = 1,
    Immediate = 2,
    Normal = 3
}
export declare class Notification extends BaseEntity {
    id: number;
    title: string;
    type: NotificationType;
    priority: PriorityType;
    courseId: number;
    alreadySeenIds: string[];
    description: string;
    createdAt: Timestamp;
    startDate: Timestamp;
    endDate: Timestamp;
    creatorId: number;
    modifiedBy: number;
}
