import { EntityRepository, Repository } from 'typeorm';
import { Routine } from './routine.entity';

@EntityRepository(Routine)
export class RoutineRepository extends Repository<Routine> {}
