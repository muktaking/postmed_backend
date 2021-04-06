import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";
import { ExamType } from "../exam.model";

export class CreateExamDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum([
    ExamType.Assignment.toString(),
    ExamType.Weekly.toString(),
    ExamType.Monthly.toString(),
    ExamType.Term.toString(),
    ExamType.Assesment.toString(),
    ExamType.Test.toString(),
    ExamType.Final.toString(),
  ])
  type: ExamType;

  @IsNotEmpty()
  @IsNumberString({ each: true })
  //@IsMongoId({ each: true })
  categoryType: Array<string>;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  //@IsMongoId({ each: true })
  questions: Array<number>;

  @IsOptional()
  @IsNotEmpty()
  singleQuestionMark: number;

  @IsOptional()
  @IsNotEmpty()
  questionStemLength: number;

  @IsOptional()
  @IsNotEmpty()
  penaltyMark: number;

  @IsOptional()
  @IsNotEmpty()
  timeLimit: number;
}

export class FindExamDto {
  @IsNotEmpty()
  @IsNumberString()
  //@IsMongoId()
  id: string;
}
