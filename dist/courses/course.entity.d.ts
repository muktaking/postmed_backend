import { BaseEntity, Timestamp } from 'typeorm';
export declare class Course extends BaseEntity {
    id: number;
    title: string;
    description: string;
    createdAt: Timestamp | string;
    startDate: Timestamp;
    endDate: Timestamp;
    creatorId: number;
    expectedEnrolledStuIds: number[];
    enrolledStuIds: number[];
}
