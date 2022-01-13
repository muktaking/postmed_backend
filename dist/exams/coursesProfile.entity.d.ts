import { BaseEntity } from 'typeorm';
import { CourseBasedExamProfile } from './courseBasedExamProfile.entity';
import { CourseBasedProfile } from './courseBasedProfile.entity';
export declare class CoursesProfile extends BaseEntity {
    id: number;
    courseId: number;
    courseTitle: string;
    totalScore: number;
    totalMark: number;
    profile: CourseBasedProfile;
    exams: CourseBasedExamProfile[];
}
