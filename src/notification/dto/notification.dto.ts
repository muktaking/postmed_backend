import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotificationType, PriorityType } from '../notification.entity';

export class CreateNotificationDto {
  @IsOptional()
  @IsNumberString()
  id: string;

  @MaxLength(200)
  @MinLength(3)
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum([
    NotificationType.Promotional.toString(),
    NotificationType.General.toString(),
  ])
  type: NotificationType;

  @IsNotEmpty()
  @IsEnum([
    PriorityType.Urgent.toString(),
    PriorityType.Immediate.toString(),
    PriorityType.Normal.toString(),
  ])
  priority: PriorityType;

  @IsOptional()
  @IsNumberString()
  courseId: string;

  @IsOptional()
  @IsNumberString({ each: true })
  alreadySeenIds: string[];

  @IsString()
  @MaxLength(255)
  @MinLength(5)
  description: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
