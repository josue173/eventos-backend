import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';
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

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.find();
    // Retornar usuarios sin contraseñas
    return usuarios.map(usuario => {
      const { us_password: _, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword as Usuario;
    });
  }


  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    // Verificar que el usuario existe
    await this.findOne(id);
    
    // Verificar si los nuevos datos no entran en conflicto con otros usuarios
    if (updateUsuarioDto.us_correo || updateUsuarioDto.us_usuario) {
      const usuarioExistente = await this.usuarioRepository.findOne({
        where: [
          ...(updateUsuarioDto.us_correo ? [{ us_correo: updateUsuarioDto.us_correo }] : []),
          ...(updateUsuarioDto.us_usuario ? [{ us_usuario: updateUsuarioDto.us_usuario }] : []),
        ],
      });

      if (usuarioExistente && usuarioExistente.us_id !== id) {
        if (usuarioExistente.us_correo === updateUsuarioDto.us_correo) {
          throw new ConflictException('Ya existe un usuario con este correo electrónico');
        }
        if (usuarioExistente.us_usuario === updateUsuarioDto.us_usuario) {
          throw new ConflictException('Ya existe un usuario con este nombre de usuario');
        }
      }
    }

    await this.usuarioRepository.update(id, updateUsuarioDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    // Verificar que el usuario existe
    await this.findOne(id);
    await this.usuarioRepository.delete(id);
  }

  async login(loginDto: LoginDto): Promise<{ usuario: Usuario; message: string }> {
    const { us_usuario, us_password } = loginDto;

    // Buscar usuario por nombre de usuario
    const usuario = await this.usuarioRepository.findOne({
      where: { us_usuario },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar contraseña (comparación simple para fines educativos)
    if (usuario.us_password !== us_password) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Retornar usuario sin la contraseña por seguridad
    const { us_password: _, ...usuarioSinPassword } = usuario;

    return {
      usuario: usuarioSinPassword as Usuario,
      message: 'Login exitoso',
    };
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { us_id: id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Retornar usuario sin la contraseña
    const { us_password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword as Usuario;
  }
}
