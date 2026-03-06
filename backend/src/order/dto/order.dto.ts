import {
  IsArray,
  IsEmail,
  IsInt,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsString()
  @Type(() => String)
  daytime: string;

  @IsInt()
  @Min(0)
  price: number;
}

export class OrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderResultDto {
  @IsUUID()
  id: string;

  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsString()
  daytime: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsInt()
  @Min(0)
  price: number;
}
