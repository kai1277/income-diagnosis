import { IsObject } from 'class-validator';

export class DiagnoseDto {
  @IsObject()
  answers!: Record<string, string>;
}
