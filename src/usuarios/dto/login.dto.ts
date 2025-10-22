import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  us_usuario: string;

  @IsString()
  @IsNotEmpty()
  us_password: string;
}
