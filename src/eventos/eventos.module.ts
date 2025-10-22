import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService],
  imports: [
    TypeOrmModule.forFeature([Evento, Usuario]),
    EmailModule,
  ],
})
export class EventosModule {}
