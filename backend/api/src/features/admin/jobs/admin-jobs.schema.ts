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

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  occupation_type_ids?: string[];

  @IsOptional()
  @IsString()
  image_url?: string | null;

  @IsOptional()
  @IsString()
  badge_text?: string | null;

  @IsOptional()
  @IsString()
  salary_type?: string;

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

  @IsOptional()
  @IsString()
  salary_range_type?: string;

  @IsOptional()
  @IsString()
  salary_text?: string;

  @IsOptional()
  @IsString()
  job_location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  job_types?: string[];

  @IsOptional()
  @IsString()
  affiliate_url?: string;

  @IsOptional()
  @IsString()
  impression_pixel_url?: string;

  @IsOptional()
  @IsString()
  affiliate_network?: string;

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

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  occupation_type_ids!: string[];

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
