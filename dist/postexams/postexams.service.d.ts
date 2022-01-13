import { CoursesService } from 'src/courses/courses.service';
import { ExamsService } from 'src/exams/exams.service';
import { QuestionRepository } from 'src/questions/question.repository';
import { UserExamProfileService } from 'src/userExamProfile/userExamprofile.service';
import { UsersService } from 'src/users/users.service';
import { GetAnswersDto } from './dto/get-answers.dto';
import { Particulars, StudentAnswer } from './postexam.model';
export declare class PostexamsService {
    private readonly usersService;
    private questionRepository;
    private readonly examService;
    private readonly courseService;
    private readonly userExamProfileService;
    constructor(usersService: UsersService, questionRepository: QuestionRepository, examService: ExamsService, courseService: CoursesService, userExamProfileService: UserExamProfileService);
    private singleQuestionMark;
    private questionStemLength;
    private singleStemMark;
    private penaltyMark;
    private timeLimit;
    private totalMark;
    private totalScore;
    private totalPenaltyMark;
    postExamTaskingByCoursesProfile(getAnswersDto: GetAnswersDto, answersByStudent: Array<StudentAnswer>, user: any): Promise<{
        examId: string;
        resultArray: Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
    postExamTaskingForFree(getAnswersDto: GetAnswersDto, answersByStudent: Array<StudentAnswer>): Promise<{
        examId: string;
        resultArray: Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
    private answersExtractor;
    examRankByIdConstrainByCourseId(examId: string, courseId: string): Promise<{
        exam: any;
        rank: any[];
    }>;
    private matrixManipulator;
    private sbaManipulator;
}
