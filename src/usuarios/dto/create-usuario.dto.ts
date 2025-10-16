import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(20)
  @MinLength(7, { message: 'Nombre de usuario muy corto' })
  public us_nombre: string;

  @IsString()
  @MaxLength(20)
  public us_apellido: string;

  @IsString()
  @MaxLength(20)
  public us_usuario: string;

  @IsString()
  @IsEmail()
  public us_correo: string;
}
