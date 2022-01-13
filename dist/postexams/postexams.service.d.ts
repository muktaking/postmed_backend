import { CoursesService } from 'src/courses/courses.service';
import { CourseBasedExamProfileRepository } from 'src/exams/courseBasedExamProfile.repository';
import { CourseBasedProfileRepository } from 'src/exams/courseBasedProfile.repository';
import { CoursesProfileRepository } from 'src/exams/coursesProfile.repository';
import { ExamsService } from 'src/exams/exams.service';
import { ExamProfileRepository } from 'src/exams/profie.repository';
import { QuestionRepository } from 'src/questions/question.repository';
import { UserExamProfileService } from 'src/userExamProfile/userExamprofile.service';
import { UsersService } from 'src/users/users.service';
import { GetAnswersDto } from './dto/get-answers.dto';
import { Particulars, StudentAnswer } from './postexam.model';
export declare class PostexamsService {
    private readonly usersService;
    private examProfileRepository;
    private questionRepository;
    private coursesProfileRepository;
    private courseBasedProfileRepository;
    private courseBasedExamProfileRepository;
    private readonly examService;
    private readonly courseService;
    private readonly userExamProfileService;
    constructor(usersService: UsersService, examProfileRepository: ExamProfileRepository, questionRepository: QuestionRepository, coursesProfileRepository: CoursesProfileRepository, courseBasedProfileRepository: CourseBasedProfileRepository, courseBasedExamProfileRepository: CourseBasedExamProfileRepository, examService: ExamsService, courseService: CoursesService, userExamProfileService: UserExamProfileService);
    private singleQuestionMark;
    private questionStemLength;
    private singleStemMark;
    private penaltyMark;
    private timeLimit;
    private totalMark;
    private totalScore;
    private totalPenaltyMark;
    postExamTasking(getAnswersDto: GetAnswersDto, answersByStudent: Array<StudentAnswer>, user: any): Promise<{
        examId: string;
        resultArray: Particulars[];
        totalMark: number;
        totalScore: number;
        totalPenaltyMark: number;
        totalScorePercentage: number;
        timeTakenToComplete: string;
    }>;
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
    examRankByIdConstrainByCourseId(examId: string, courseId: string): Promise<{
        exam: any;
        rank: any[];
    }>;
    private matrixManipulator;
    private sbaManipulator;
}
