import { IsNotEmpty, IsString } from 'class-validator';

export class BeautyLineAuthDto {
  @IsString()
  @IsNotEmpty()
  id_token!: string;
}
