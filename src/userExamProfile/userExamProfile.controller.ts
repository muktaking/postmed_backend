import { Controller } from '@nestjs/common';
import { UserExamProfileService } from './userExamprofile.service';

@Controller('userExamProfile')
export class UserExamProfileController {
  constructor(
    private readonly userExamProfileService: UserExamProfileService
  ) {}
}
