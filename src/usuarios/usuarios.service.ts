import {
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si ya existe un usuario con el mismo correo o nombre de usuario
    const usuario_existente = await this.usuarioRepository.findOne({
      where: [
        { us_correo: createUsuarioDto.us_correo },
        { us_usuario: createUsuarioDto.us_usuario },
      ],
    });

    if (usuario_existente) {
      if (usuario_existente.us_correo === createUsuarioDto.us_correo) {
        throw new ConflictException(
          'Ya existe un usuario con este correo electrónico',
        );
      }
      if (usuario_existente.us_usuario === createUsuarioDto.us_usuario) {
        throw new ConflictException(
          'Ya existe un usuario con este nombre de usuario',
        );
      }
    }

    const usuario = this.usuarioRepository.create(createUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  // async findAll(): Promise<Usuario[]> {
  //   return await this.usuarioRepository.find();
  // }

  // async findOne(id: string): Promise<Usuario> {
  //   const usuario = await this.usuarioRepository.findOne({
  //     where: { us_id: id },
  //   });
  //   if (!usuario) {
  //     throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  //   }
  //   return usuario;
  // }

  // async update(
  //   id: string,
  //   updateUsuarioDto: UpdateUsuarioDto,
  // ): Promise<Usuario> {
  //   await this.usuarioRepository.update(id, updateUsuarioDto);
  //   return await this.findOne(id);
  // }

  // async remove(id: string): Promise<void> {
  //   await this.usuarioRepository.delete(id);
  // }
}
