import { EntityRepository, Repository } from 'typeorm';
import { StemActivityStat } from './stemActivityStat.entity';

@EntityRepository(StemActivityStat)
export class StemActivityStatRepository extends Repository<StemActivityStat> {}
