import { GetAnswersDto } from "./dto/get-answers.dto";
import { StudentAnswer } from "./postexam.model";
import { PostexamsService } from "./postexams.service";
export declare class PostexamsController {
    private readonly postexamsService;
    constructor(postexamsService: PostexamsService);
    postExamTasking(getAnswersDto: GetAnswersDto, answers: StudentAnswer[], req: any): Promise<{
        resultArray: import("./postexam.model").Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
    postExamTaskingForFree(getAnswersDto: GetAnswersDto, answers: StudentAnswer[]): Promise<{
        resultArray: import("./postexam.model").Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
    examRankByIdForGuest(id: any): Promise<{
        exam: any;
        rank: {
            user: any;
            exam: {
                score: number;
                attempts: number;
                totalMark: number;
            }[];
        }[];
    }>;
}
