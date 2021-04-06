import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from "class-validator";
import { QType } from "./question.model";

export class CreateQuestionDto {
  @IsOptional()
  @ValidateIf((o) => o.id !== "Top")
  id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @ValidateIf((o) => o.category !== "Top")
  //@IsMongoId()
  category: string;

  @IsNotEmpty()
  @IsEnum(QType)
  qType: QType;

  @IsNotEmpty()
  @MaxLength(500)
  qText: string;

  //   stems: Partial<Stem>;
  @IsOptional()
  @IsString()
  generalFeedback: string;

  @IsOptional()
  @IsString({ each: true })
  tags: Array<string>;
}
