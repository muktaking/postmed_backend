import { BaseEntity } from 'typeorm';
export declare class AccessRight extends BaseEntity {
    id: number;
    accessableCourseIds: number[];
    canCreateExam: boolean;
}
