import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Faculty } from '../user.entity';
import { Gender, RolePermitted } from '../user.model';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, {
    message: 'Your Password is too weak',
  })
  password: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: Gender;

  @IsOptional()
  role: RolePermitted;

  @IsOptional()
  mobile: string;

  @IsOptional()
  institution: string;

  @IsOptional()
  faculty: Faculty;

  @IsOptional()
  address: string;
}
