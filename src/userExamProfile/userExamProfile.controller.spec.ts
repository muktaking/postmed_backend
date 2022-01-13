import { Test, TestingModule } from '@nestjs/testing';
import { UserExamProfileController } from './userExamProfile.controller';

describe('Profile Controller', () => {
  let controller: UserExamProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserExamProfileController],
    }).compile();

    controller = module.get<UserExamProfileController>(
      UserExamProfileController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
