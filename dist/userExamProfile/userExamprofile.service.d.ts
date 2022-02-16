import { UserExamCourseProfileRepository } from './userExamCourseProfile.repository';
import { UserExamExamProfileRepository } from './userExamExamProfile.repository';
import { UserExamProfile } from './userExamProfile.entity';
import { UserExamProfileRepository } from './userExamProfile.repository';
export declare class UserExamProfileService {
    private userExamProfileRepository;
    private userExamCourseProfileRepository;
    private userExamExamProfileRepository;
    constructor(userExamProfileRepository: UserExamProfileRepository, userExamCourseProfileRepository: UserExamCourseProfileRepository, userExamExamProfileRepository: UserExamExamProfileRepository);
    findCourseBasedProfileByUserID(id: string): Promise<UserExamProfile>;
    manipulateProfile(user: any, examData: any): Promise<any>;
    findAllUserCourseProfilesByCourseId(courseId: any): Promise<any>;
    findAllUserExamActivityStat(stuId?: number): Promise<any>;
    findAllUserExamActivityStatByCourseId(stuId: any, courseId: any): Promise<any>;
}
