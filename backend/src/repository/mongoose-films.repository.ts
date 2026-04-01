import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument } from '../films/films.schema';
import {
  FilmRecord,
  FilmsRepository,
  ScheduleRecord,
} from './films.repository';

@Injectable()
export class MongooseFilmsRepository extends FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {
    super();
  }

  async findAllWithoutSchedules(): Promise<FilmRecord[]> {
    return this.filmModel
      .find({}, { schedule: 0, _id: 0, __v: 0 })
      .lean()
      .exec();
  }

  async findSchedulesByFilmId(filmId: string): Promise<ScheduleRecord[]> {
    const doc = await this.filmModel
      .findOne({ id: filmId }, { schedule: 1, _id: 0 })
      .lean()
      .exec();

    if (!doc) {
      throw new NotFoundException('Film not found');
    }

    return (doc as Film).schedule ?? [];
  }

  async reservePlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<void> {
    const res = await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': scheduleId },
      { $addToSet: { 'schedule.$.taken': place } },
    );

    if (res.matchedCount === 0) {
      throw new NotFoundException('Sit not found');
    }
  }

  async getSitsInfo(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleRecord> {
    const doc = await this.filmModel
      .findOne({ id: filmId }, { schedule: 1, _id: 0 })
      .lean()
      .exec();

    if (!doc) {
      throw new NotFoundException('not found film');
    }

    const schedule = (doc as Film).schedule.find(
      (item) => item.id === scheduleId,
    );

    if (!schedule) {
      throw new NotFoundException('Not Found Place');
    }

    return schedule;
  }
}
