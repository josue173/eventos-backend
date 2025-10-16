import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'eventos',
})
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  ev_id: string;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  ev_nombre: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  ev_description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  ev_fecha_creacion: Date;

  @Column({
    type: 'datetime',
  })
  ev_fecha_evento: Date;

  @Column({
    type: 'datetime',
    default: () => "'1990-01-01 00:00:00'",
  })
  ev_fecha_modificacion: Date;

  @Column({
    type: 'varchar',
    length: 70,
  })
  ev_ubicacion: string;

  @Column({
    type: 'time',
  })
  ev_hora_inicio: string;

  @Column({
    type: 'time',
  })
  ev_hora_fin: string;

  @Column({
    type: 'varchar',
    default: 'usuario_administrador',
    length: 25,
  })
  ev_propietario: string;

  @Column({
    type: 'varchar',
  })
  ev_imagen_lugar: string;


  @ManyToMany(() => Usuario, (usuario) => usuario.us_eventos)
  @JoinTable({
    name: 'us_eventos',
    joinColumn: {
      name: 'us_evento_id',
      referencedColumnName: 'ev_id',
    },
    inverseJoinColumn: {
      name: 'us_usuario_id',
      referencedColumnName: 'us_id',
    },
  })
  ev_usuarios: Usuario[];
}
