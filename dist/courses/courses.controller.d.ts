import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/course.dto';
export declare class CoursesController {
    private readonly courseService;
    constructor(courseService: CoursesService);
    createCourse(createCourseDto: CreateCourseDto, req: any, image: any): Promise<{
        message: string;
    }>;
    getAllCourses(): Promise<any>;
    getAllCoursesWithAuth(req: any): Promise<any>;
    getAllRawCourses(): Promise<any>;
    getAllCoursesEnrolledByStudent(req: any): Promise<any>;
    approveEnrollment(course: any): Promise<{
        message: string;
    }>;
    getCourseById(id: any): Promise<any>;
    updateCourseById(createCourseDto: CreateCourseDto, image: any, id: any): Promise<{
        message: string;
    }>;
    deleteCourseById(id: any): Promise<{
        message: string;
    }>;
    enrollmentRequestedByStudent(courseId: any, req: any): Promise<{
        message: string;
    }>;
}
