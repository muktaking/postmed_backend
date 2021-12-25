import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  //@IsDateString()
  startDate: string;

  @IsOptional()
  @IsNotEmpty()
  //@IsDateString()
  endDate: string;
}
