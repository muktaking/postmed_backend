import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/course.dto';
export declare class CoursesController {
    private readonly courseService;
    constructor(courseService: CoursesService);
    createExam(createCourseDto: CreateCourseDto, req: any): Promise<any>;
    getAllCourses(): Promise<any>;
    getAllCoursesEnrolledByStudent(req: any): Promise<any>;
    approveEnrollment(course: any): Promise<{
        message: string;
    }>;
    getCourseById(id: any): Promise<any>;
    updateCourseById(createCourseDto: CreateCourseDto, id: any): Promise<any>;
    deleteCourseById(id: any): Promise<any>;
    enrollmentRequestedByStudent(courseId: any, req: any): Promise<{
        message: string;
    }>;
}
