import { BaseEntity } from 'typeorm';
import { UserExamCourseProfile } from './userExamCourseProfile.entity';
export interface UserExamProfileData {
    courseId: string;
    examId: string;
    score: number;
}
export declare class UserExamProfile extends BaseEntity {
    id: number;
    courses: UserExamCourseProfile[];
}
