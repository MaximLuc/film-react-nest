export interface FilmRecord {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
}

export interface ScheduleRecord {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export abstract class FilmsRepository {
  abstract findAllWithoutSchedules(): Promise<FilmRecord[]>;

  abstract findSchedulesByFilmId(filmId: string): Promise<ScheduleRecord[]>;

  abstract reservePlace(
    filmId: string,
    scheduleId: string,
    place: string,
  ): Promise<void>;

  abstract getSitsInfo(
    filmId: string,
    scheduleId: string,
  ): Promise<ScheduleRecord>;
}
