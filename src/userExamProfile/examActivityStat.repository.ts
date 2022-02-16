import { EntityRepository, Repository } from 'typeorm';
import { ExamActivityStat } from './examActivityStat.entity';

@EntityRepository(ExamActivityStat)
export class ExamActivityStatRepository extends Repository<ExamActivityStat> {}
