import { GetAnswersDto, GetFreeAnswersDto } from './dto/get-answers.dto';
import { StudentAnswer } from './postexam.model';
import { PostexamsService } from './postexams.service';
export declare class PostexamsController {
    private readonly postexamsService;
    constructor(postexamsService: PostexamsService);
    postExamTasking(getAnswersDto: GetAnswersDto, answers: StudentAnswer[], req: any): Promise<{
        examId: string;
        resultArray: import("./postexam.model").Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
    postExamTaskingForFree(getFreeAnswersDto: GetFreeAnswersDto, answers: StudentAnswer[]): Promise<{
        examId: string;
        resultArray: import("./postexam.model").Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
    examRankByIdForGuest(data: any): Promise<{
        exam: any;
        rank: any[];
    }>;
}
