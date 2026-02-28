import { Injectable } from '@nestjs/common';
import { ApiListResponseDto,MovieDto, SessionDto  } from './dto/films.dto';
import { FilmsRepository } from 'src/repository/films.repository';
import { Film } from './films.schema';
import { abort } from 'process';


@Injectable()
export class FilmsService {
    constructor(private readonly repo:FilmsRepository){}
    async getFilms():Promise<ApiListResponseDto<MovieDto>>{
        const docs = await this.repo.findAllWithoutSchedules();
        const items: MovieDto[] = docs.map((e:any)=>({
            id: e.id,
            title: e.title,
            about: e.about,
            image: e.image,
            rating: e.rating ?? 0,
            director: e.director ?? '',
            tags: e.tags ?? [],
            description: e.description ?? e.about ?? '',
            cover: e.cover ?? e.image ?? ''
        }));
        return {total: docs.length, items};
    }

    async getFilmSession(filmId:string):Promise<ApiListResponseDto<SessionDto>>{
        const session = await this.repo.findSchedulesByFilmId(filmId);
        const items:SessionDto[] = session.map((s: any)=>({
            id: s.id,
            film: filmId,
            daytime: s.daytime,
            hall: String(s.hall),
            rows: s.rows,
            seats: s.seats,
            price: s.price,
            taken: (s.taken ?? []).map(String)
        })) as SessionDto[];
        return { total: session.length, items };
    }
}
