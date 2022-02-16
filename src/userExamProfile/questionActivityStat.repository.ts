import { EntityRepository, Repository } from 'typeorm';
import { QuestionActivityStat } from './questionActivityStat.entity';

@EntityRepository(QuestionActivityStat)
export class QuestionActivityStatRepository extends Repository<
  QuestionActivityStat
> {}
