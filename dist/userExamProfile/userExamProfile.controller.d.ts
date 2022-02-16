import { UserExamProfileService } from './userExamprofile.service';
export declare class UserExamProfileController {
    private readonly userExamProfileService;
    constructor(userExamProfileService: UserExamProfileService);
    findAllUserExamActivityStat(): Promise<any>;
    findAllUserExamActivityStatByCourseId(id: string, req: any): Promise<any>;
}
