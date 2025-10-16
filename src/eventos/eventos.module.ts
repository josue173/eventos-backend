import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
  imports: [TypeOrmModule.forFeature([Evento, Usuario])],
})
export class EventosModule {}
