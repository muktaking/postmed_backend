import { BaseEntity } from 'typeorm';
import { CoursesProfile } from './coursesProfile.entity';
import { ExamType } from './exam.entity';
export interface ExamStatByCourseBasedProfile {
    id: string;
    title: string;
    type: ExamType;
    attemptNumbers: number;
    score: number[];
    totalMark: number;
    firstAttemptTime: number;
    lastAttemptTime: number;
}
export declare class CourseBasedProfile extends BaseEntity {
    id: number;
    courses: CoursesProfile[];
}
