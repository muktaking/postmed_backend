import { UserRepository } from 'src/users/user.repository';
import { CourseRepository } from './course.repository';
import { CreateCourseDto } from './dto/course.dto';
export declare class CoursesService {
    private courseRepository;
    private userRepository;
    constructor(courseRepository: CourseRepository, userRepository: UserRepository);
    createCourse(createCourseDto: any, creator: string): Promise<any>;
    findAllCourses(): Promise<any>;
    findAllCoursesEnrolledByStudent(stuId: any): Promise<any>;
    findCourseById(id: string): Promise<any>;
    updateCourseById(courseUpdated: CreateCourseDto, id: string): Promise<any>;
    deleteCourseById(id: string): Promise<any>;
    enrollmentRequestedByStudent(courseId: string, stuId: string): Promise<{
        message: string;
    }>;
    expectedEnrolledStuByCourseId(courseId: string): Promise<any>;
    expectedEnrolledStuInfo(): Promise<any[]>;
    approveOrDenyEnrollment(courseId: string, stuIds: [string], deny?: boolean): Promise<{
        message: string;
    }>;
}
