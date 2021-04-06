import { EntityRepository, Repository } from "typeorm";
import { Profile } from "./profile.entity";

@EntityRepository(Profile)
export class ExamProfileRepository extends Repository<Profile> {}
