import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'films' })
export class FilmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('double precision')
  rating: number;

  @Column('varchar')
  director: string;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  tags: string[];

  @Column('varchar')
  image: string;

  @Column('varchar')
  cover: string;

  @Column('varchar')
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film)
  schedule: ScheduleEntity[];
}
