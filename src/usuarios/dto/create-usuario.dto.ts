import { IsEmail, IsString, MaxLength, MinLength, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(20)
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  public us_nombre: string;

  @IsString()
  @MaxLength(20)
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  public us_apellido: string;

  @IsString()
  @MaxLength(20)
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  public us_usuario: string;

  @IsString()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  public us_correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  public us_password: string;
}
