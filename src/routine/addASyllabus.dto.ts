import { IsDateString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class AddASyllabusDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @MaxLength(500)
  syllabus: string;

  @IsNotEmpty()
  @IsNumber()
  courseId: string;
}
