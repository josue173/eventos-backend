import { Type } from 'class-transformer';
import { IsDate, IsString, Matches } from 'class-validator';

export class CreateEventoDto {
  @IsString()
  public ev_nombre: string;

  @IsString()
  public ev_description: string;

  @IsDate()
  @Type(() => Date)
  public ev_fecha_creacion: Date;

  @IsDate()
  @Type(() => Date)
  public ev_fecha_evento: Date;

  @IsString()
  public ev_lugar: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'La hora de inicio debe tener el formato HH:MM o HH:MM:SS',
  })
  ev_hora_inicio: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'La hora final debe tener el formato HH:MM o HH:MM:SS',
  })
  ev_hora_final: string;
}
