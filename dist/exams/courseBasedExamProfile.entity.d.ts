import { BaseEntity, Timestamp } from 'typeorm';
import { CoursesProfile } from './coursesProfile.entity';
import { ExamType } from './exam.entity';
export declare class CourseBasedExamProfile extends BaseEntity {
    id: number;
    examId: number;
    examTitle: string;
    examType: ExamType;
    attemptNumbers: number;
    score: number[];
    totalMark: number;
    firstAttemptTime: Timestamp;
    lastAttemptTime: Timestamp;
    course: CoursesProfile;
}
