import { IsNotEmpty, IsString } from 'class-validator';

export class LineAuthDto {
  @IsString()
  @IsNotEmpty()
  id_token!: string;
}
