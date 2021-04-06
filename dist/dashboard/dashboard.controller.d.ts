import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStudentDashInfo(req: any): Promise<{
        userExamInfo: any;
        featuredExams: any;
        userExamStat: any;
    }>;
    getAdminDashInfo(req: any): Promise<{
        users: any;
        exams: any;
    }>;
}
