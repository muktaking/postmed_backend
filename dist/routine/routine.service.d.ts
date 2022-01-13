import { RoutineRepository } from './routine.repository';
export declare class RoutineService {
    private routineRepository;
    constructor(routineRepository: RoutineRepository);
    getRoutine(): Promise<any>;
    getRoutineByCourseId(id: any): Promise<any>;
    getRawRoutine(): Promise<any>;
    getSyllabusById(id: any): Promise<any>;
    addASyllabus(addASyllabusDto: any): Promise<{
        message: string;
    }>;
    editASyllabus(addASyllabusDto: any): Promise<{
        message: string;
    }>;
    deleteASyllabus(id: any): Promise<{
        message: string;
    }>;
}
