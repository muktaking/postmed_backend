import { AddASyllabusDto } from './addASyllabus.dto';
import { RoutineService } from './routine.service';
export declare class RoutineController {
    private readonly routineService;
    constructor(routineService: RoutineService);
    getRoutine(): Promise<any>;
    getRoutineByCourseId(id: any): Promise<any>;
    getRawRoutine(): Promise<any>;
    getSyllabusById(id: any): Promise<any>;
    addASyllabus(addASyllabus: AddASyllabusDto): Promise<{
        message: string;
    }>;
    editASyllabus(addASyllabus: AddASyllabusDto): Promise<{
        message: string;
    }>;
    deleteASyllabus(id: any): Promise<{
        message: string;
    }>;
}
