import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FilmEntity } from './film.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  daytime: string;

  @Column('int')
  hall: number;

  @Column('int')
  rows: number;

  @Column('int')
  seats: number;

  @Column('int')
  price: number;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  taken: string[];

  @Column('uuid', { name: 'film_id' })
  filmId: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'film_id', referencedColumnName: 'id' })
  film: FilmEntity;
}
