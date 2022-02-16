import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class GetFreeAnswersDto {
  @IsNotEmpty()
  @IsNumberString()
  //@IsMongoId()
  examId: string;

  @IsNotEmpty()
  timeTakenToComplete: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  questionIdsByOrder: number[];
}

export class GetAnswersDto extends GetFreeAnswersDto {
  @IsNotEmpty()
  @IsNumberString()
  //@IsMongoId()
  courseId: string;
}
