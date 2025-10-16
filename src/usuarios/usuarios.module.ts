import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';

@Module({
  controllers: [UsuariosController],
  exports: [UsuariosService],
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuariosService],
})
export class UsuariosModule {}
