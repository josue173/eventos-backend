import {
  IsArray,
  IsDateString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEventoDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  public ev_nombre: string;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  public ev_description: string;

  @IsDateString()
  public ev_fecha_evento: Date;

  @IsString()
  @MinLength(5)
  @MaxLength(70)
  public ev_ubicacion: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'La hora de inicio debe tener el formato HH:MM o HH:MM:SS',
  })
  public ev_hora_inicio: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'La hora final debe tener el formato HH:MM o HH:MM:SS',
  })
  public ev_hora_fin: string;

  @IsString()
  public ev_imagen_lugar: string;

  @IsString()
  @MaxLength(25)
  public ev_propietario: string;
}
