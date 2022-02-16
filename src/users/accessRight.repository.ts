import { EntityRepository, Repository } from 'typeorm';
import { AccessRight } from './accessRight.entity';

@EntityRepository(AccessRight)
export class AccessRightRepository extends Repository<AccessRight> {}
