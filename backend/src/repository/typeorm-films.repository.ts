import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmEntity } from '../database/entities/film.entity';
import { ScheduleEntity } from '../database/entities/schedule.entity';
import {
  FilmRecord,
  FilmsRepository,
  ScheduleRecord,
} from './films.repository';

@Injectable()
export class TypeormFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmsRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly schedulesRepository: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async findAllWithoutSchedules(): Promise<FilmRecord[]> {
    return this.filmsRepository.find({
      select: {
        id: true, //true
        rating: true,
        director: true,
        tags: true,
        image: true,
        cover: true,
        title: true,
        about: true,
        description: true,
      },
    });
  }

  async findSchedulesByFilmId(filmId: string): Promise<ScheduleRecord[]> {
    const film = await this.filmsRepository.findOne({
      where: { id: filmId },
      relations: { schedule: true },
    });
    if (!film) {
      throw new NotFoundException('Film not found');
    }
    return film.schedule ?? [];
  }

  async reservePlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<void> {
    const result = await this.schedulesRepository
      .createQueryBuilder()
      .update(ScheduleEntity)
      .set({
        taken: () => 'array_append(taken, :place)',
      })
      .where('id = :scheduleId', { scheduleId })
      .andWhere('film_id = :filmId', { filmId })
      .setParameters({ place })
      .execute();

    if (!result.affected) {
      throw new NotFoundException('Sit not found');
    }
  }

  async getSitsInfo(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleRecord> {
    const schedule = await this.schedulesRepository.findOne({
      where: {
        id: scheduleId,
        filmId,
      },
    });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }
}
