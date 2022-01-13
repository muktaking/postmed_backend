import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class GetAnswersDto {
  @IsNotEmpty()
  @IsNumberString()
  //@IsMongoId()
  examId: string;

  @IsNotEmpty()
  @IsNumberString()
  //@IsMongoId()
  courseId: string;

  @IsNotEmpty()
  timeTakenToComplete: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  questionIdsByOrder: number[];
}
