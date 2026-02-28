import { Injectable,NotFoundException } from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from 'mongoose';
import {Film,FilmDocument} from '../films/films.schema';

@Injectable()
export class FilmsRepository{
    constructor(@InjectModel(Film.name) private readonly filmModel:Model<FilmDocument>,
    ){}

    async findAllWithoutSchedules(){
        return this.filmModel
        .find({},{schedule:0,_id:0,__v:0})
        .lean()
        .exec();
    }

    async findSchedulesByFilmId(filmId:string){
        const doc = await this.filmModel
        .findOne({id:filmId},{schedule:1,_id:0})
        .lean()
        .exec()
        if(!doc){throw new NotFoundException('Film not found')};
        return (doc as Film).schedule ?? [];
    }

    async reservePlace(filmId:string, scheduleId:string,place: string){
        const res = await this.filmModel.updateOne(
            {id:filmId,'schedule.id':scheduleId},
            {$addToSet:{'schedule.$.taken':place}},
        );
        if (res.matchedCount ===0 ) throw new NotFoundException('Sit not found')
    }

    async getSitsInfo(filmId:string,scheduleId:string){
        const doc = await this.filmModel
        .findOne(
            {id:filmId},{schedule:1,_id:0})
        .lean()
        .exec();
        if(!doc) throw new NotFoundException('not found film');
        const place =  (doc as Film).schedule.find((s:any)=>s.id ===scheduleId);
        if(!place) throw new NotFoundException('Not Found Place');
        return place;
    }
}