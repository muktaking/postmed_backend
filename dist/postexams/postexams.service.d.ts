import { ExamsService } from "src/exams/exams.service";
import { ExamProfileRepository } from "src/exams/profie.repository";
import { QuestionRepository } from "src/questions/question.repository";
import { UsersService } from "src/users/users.service";
import { GetAnswersDto } from "./dto/get-answers.dto";
import { Particulars, StudentAnswer } from "./postexam.model";
export declare class PostexamsService {
    private readonly usersService;
    private examProfileRepository;
    private questionRepository;
    private readonly examService;
    constructor(usersService: UsersService, examProfileRepository: ExamProfileRepository, questionRepository: QuestionRepository, examService: ExamsService);
    private singleQuestionMark;
    private questionStemLength;
    private singleStemMark;
    private penaltyMark;
    private timeLimit;
    private totalMark;
    private totalScore;
    private totalPenaltyMark;
    postExamTasking(getAnswersDto: GetAnswersDto, answersByStudent: Array<StudentAnswer>, user: any): Promise<{
        resultArray: Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
    postExamTaskingForFree(getAnswersDto: GetAnswersDto, answersByStudent: Array<StudentAnswer>): Promise<{
        resultArray: Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
    private answersExtractor;
    examRankById(id: string): Promise<{
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
    private matrixManipulator;
    private sbaManipulator;
}
