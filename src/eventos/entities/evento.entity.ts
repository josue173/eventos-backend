import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'eventos',
})
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  ev_id: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  ev_nombre: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  ev_descripcion: string;

  @Column({
    type: 'date',
  })
  ev_fecha_creacion: Date;

  @Column({
    type: 'date',
  })
  ev_fecha_evento: Date;

  @Column({
    type: 'date',
  })
  ev_fecha_modificacion: Date;

  @Column({
    type: 'varchar',
    length: 70,
  })
  ev_lugar: string;

  @Column({
    type: 'time',
  })
  ev_hora_inicio: string;

  @Column({
    type: 'time',
  })
  ev_hora_final: string;

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
