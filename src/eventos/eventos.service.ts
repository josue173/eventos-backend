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
      evento.ev_fecha,
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
        evento.ev_fecha,
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

  findAll() {
    return `This action returns all eventos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evento`;
  }

  update(id: number, updateEventoDto: UpdateEventoDto) {
    return `This action updates a #${id} evento`;
  }

  remove(id: number) {
    return `This action removes a #${id} evento`;
  }

  private handleExceptions(error: any) {
    if (error.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.sqlMessage);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
