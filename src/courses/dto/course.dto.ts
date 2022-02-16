import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @MaxLength(65535)
  @MinLength(5)
  @IsString()
  description: string;

  @IsOptional()
  @IsNumberString()
  price: string;

  @IsNotEmpty()
  //@IsDateString()
  startDate: string;

  @IsNotEmpty()
  //@IsDateString()
  endDate: string;
}
