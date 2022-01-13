import { Test, TestingModule } from '@nestjs/testing';
import { UserExamProfileService } from './userExamprofile.service';

describe('ProfileService', () => {
  let service: UserExamProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserExamProfileService],
    }).compile();

    service = module.get<UserExamProfileService>(UserExamProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
