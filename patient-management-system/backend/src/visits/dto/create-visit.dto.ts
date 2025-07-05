import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { VisitType } from '../schemas/visit.schema';

export class CreateVisitDto {
  @IsNotEmpty()
  @IsDateString()
  visitDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsEnum(VisitType)
  visitType: VisitType;
} 