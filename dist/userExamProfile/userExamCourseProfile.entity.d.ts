import { BaseEntity } from 'typeorm';
import { UserExamExamProfile } from './userExamExamProfile.entity';
import { UserExamProfile } from './userExamProfile.entity';
export declare class UserExamCourseProfile extends BaseEntity {
    id: number;
    courseId: number;
    courseTitle: string;
    totalScore: number;
    totalMark: number;
    userExamProfile: UserExamProfile;
    exams: UserExamExamProfile[];
}
