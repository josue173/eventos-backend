import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Repository } from 'typeorm';
import { Evento } from './entities/evento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class EventosService {
  private readonly logger = new Logger('EventosService');

  constructor(
    @InjectRepository(Evento)
    private readonly _eventosRepository: Repository<Evento>,

    @InjectRepository(Usuario)
    private readonly _usuariosRepository: Repository<Usuario>,

    private readonly emailService: EmailService,
  ) {}

  async create(createEventoDto: CreateEventoDto) {
    try {
      const evento: Evento = this._eventosRepository.create(createEventoDto);

      await this._eventosRepository.save(evento);

      return evento;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async agregarParticipante(evento_id: string, usuario_id: string) {
    const evento: Evento = await this._eventosRepository.findOne({
      where: { ev_id: evento_id },
    });

    if (!evento) throw new NotFoundException('Evento no encontrado');

    const usuario: Usuario = await this._usuariosRepository.findOneBy({
      us_id: usuario_id,
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (evento.ev_usuarios.some((u) => u.us_id === usuario.us_id))
      return { message: 'El usuario ya participa en este evento' };

    return { message: `Usuario agregado a ${evento.ev_nombre}` };
  }

  async confirmarParticipacion(evento_id: string, usuario_id: string) {
    const evento: Evento = await this._eventosRepository.findOne({
      where: { ev_id: evento_id },
    });

    if (!evento) throw new NotFoundException('Evento no encontrado');

    const usuario: Usuario = await this._usuariosRepository.findOneBy({
      us_id: usuario_id,
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Enviar email de confirmación
    const emailEnviado = await this.emailService.enviarConfirmacionEvento(
      usuario.us_correo,
      usuario.us_nombre,
      evento.ev_nombre,
      evento.ev_fecha_evento.toISOString(),
      evento.ev_ubicacion,
    );

    if (emailEnviado) {
      return {
        message: 'Confirmación enviada exitosamente',
        emailEnviado: true,
      };
    } else {
      throw new InternalServerErrorException('Error al enviar la confirmación por email');
    }
  }

  async enviarRecordatorioEvento(evento_id: string) {
    const evento: Evento = await this._eventosRepository.findOne({
      where: { ev_id: evento_id },
    });

    if (!evento) throw new NotFoundException('Evento no encontrado');

    if (!evento.ev_usuarios || evento.ev_usuarios.length === 0) {
      return { message: 'No hay participantes registrados para este evento' };
    }

    const resultados = [];
    
    for (const usuario of evento.ev_usuarios) {
      const emailEnviado = await this.emailService.enviarRecordatorioEvento(
        usuario.us_correo,
        usuario.us_nombre,
        evento.ev_nombre,
        evento.ev_fecha_evento.toISOString(),
        evento.ev_ubicacion,
      );

      resultados.push({
        usuario: usuario.us_nombre,
        email: usuario.us_correo,
        emailEnviado,
      });
    }

    return {
      message: 'Recordatorios enviados',
      resultados,
    };
  }

  async findAll() {
    try {
      const eventos = await this._eventosRepository.find({
        relations: ['ev_usuarios'],
        order: {
          ev_fecha_evento: 'ASC',
        },
      });

      return eventos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const evento = await this._eventosRepository.findOne({
        where: { ev_id: id },
        relations: ['ev_usuarios'],
      });

      if (!evento) {
        throw new NotFoundException(`Evento con ID ${id} no encontrado`);
      }

      return evento;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateEventoDto: UpdateEventoDto) {
    try {
      const evento = await this._eventosRepository.findOne({
        where: { ev_id: id },
      });

      if (!evento) {
        throw new NotFoundException(`Evento con ID ${id} no encontrado`);
      }

      // Actualizar la fecha de modificación
      const eventoActualizado = {
        ...updateEventoDto,
        ev_fecha_modificacion: new Date(),
      };

      await this._eventosRepository.update(id, eventoActualizado);

      // Retornar el evento actualizado
      const eventoActualizadoCompleto = await this._eventosRepository.findOne({
        where: { ev_id: id },
        relations: ['ev_usuarios'],
      });

      return eventoActualizadoCompleto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const evento = await this._eventosRepository.findOne({
        where: { ev_id: id },
        relations: ['ev_usuarios'],
      });

      if (!evento) {
        throw new NotFoundException(`Evento con ID ${id} no encontrado`);
      }

      // Verificar si el evento tiene participantes
      if (evento.ev_usuarios && evento.ev_usuarios.length > 0) {
        throw new BadRequestException(
          `No se puede eliminar el evento "${evento.ev_nombre}" porque tiene ${evento.ev_usuarios.length} participantes registrados. Primero elimina a los participantes.`,
        );
      }

      await this._eventosRepository.remove(evento);

      return {
        message: `Evento "${evento.ev_nombre}" eliminado exitosamente`,
        eventoEliminado: {
          id: evento.ev_id,
          nombre: evento.ev_nombre,
          fechaEliminacion: new Date(),
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
