import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FeedbackStatus } from '../feedback.entity';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsNumberString()
  examId: string;

  @MaxLength(30)
  @MinLength(3)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum([
    FeedbackStatus.belowAverage.toString(),
    FeedbackStatus.average.toString(),
    FeedbackStatus.good.toString(),
    FeedbackStatus.best.toString(),
  ])
  feedbackStatus: FeedbackStatus;

  @IsString()
  @MaxLength(255)
  @MinLength(5)
  message: string;
}
