import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsIn,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobRequirementDto {
  @IsUUID()
  requirement_code_id!: string;

  @IsIn(['required', 'preferred'])
  level!: 'required' | 'preferred';

  @IsString()
  @IsNotEmpty()
  operator!: string;

  @IsOptional()
  @IsString()
  value?: string | null;
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsUUID()
  occupation_type_id!: string;

  @IsOptional()
  @IsString()
  image_url?: string | null;

  @IsOptional()
  @IsString()
  badge_text?: string | null;

  @IsString()
  @IsNotEmpty()
  salary_type!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  salary_min?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  salary_max?: number | null;

  @IsString()
  @IsNotEmpty()
  salary_range_type!: string;

  @IsString()
  @IsNotEmpty()
  salary_text!: string;

  @IsString()
  @IsNotEmpty()
  job_location!: string;

  @IsArray()
  @IsString({ each: true })
  job_types!: string[];

  @IsString()
  @IsNotEmpty()
  affiliate_url!: string;

  @IsString()
  @IsNotEmpty()
  impression_pixel_url!: string;

  @IsString()
  @IsNotEmpty()
  affiliate_network!: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  expires_at?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobRequirementDto)
  requirements?: CreateJobRequirementDto[];
}
