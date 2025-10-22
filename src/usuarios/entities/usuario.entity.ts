import { Evento } from 'src/eventos/entities/evento.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'usuarios',
})
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  us_id: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  us_nombre: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  us_apellido: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  us_usuario: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  us_correo: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  us_password: string;

  @ManyToMany(() => Evento, (evento) => evento.ev_usuarios)
  // @JoinTable({ name: 'us_eventos' })
  us_eventos: Evento[];
}
