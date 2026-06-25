import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOccupationTypeDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sort_order?: number | null;
}
