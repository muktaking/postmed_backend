import { BaseEntity, Timestamp } from 'typeorm';
export declare class Routine extends BaseEntity {
    id: number;
    syllabus: string;
    startDate: Timestamp;
    endDate: Timestamp;
    courseId: number;
}
