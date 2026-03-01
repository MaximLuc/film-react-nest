import { IsArray, IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class MovieDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsString()
  director: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  cover: string;
}

export class SessionDto {
  @IsUUID()
  id: string;

  @IsString()
  film: string;

  @IsString()
  daytime: string;

  @IsString()
  hall: string;

  @IsNumber()
  rows: number;

  @IsNumber()
  seats: number;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  taken: string[];
}

export class ApiListResponseDto<T> {
  total: number;
  items: T[];
}
