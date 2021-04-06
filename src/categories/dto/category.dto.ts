import {
  IsNotEmpty,
  IsNotIn,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";

export class createCategoryDto {
  @IsOptional()
  @ValidateIf((o) => o.id !== "Top")
  //@IsMongoId()
  @IsNumberString()
  id: number | "Top";

  @IsNotEmpty()
  @MaxLength(25)
  @IsString()
  @IsNotIn(["_", "/"])
  name: string;

  @IsOptional()
  @IsString()
  @IsNotIn(["_", "/"])
  slug: string;

  @MinLength(30)
  @MaxLength(300)
  @IsString()
  description: string;

  @ValidateIf((o) => o.parentId !== "Top")
  //@IsMongoId()
  @IsNumberString()
  parentId: number | "Top";

  @IsOptional()
  @IsNumberString()
  order: number;
}
