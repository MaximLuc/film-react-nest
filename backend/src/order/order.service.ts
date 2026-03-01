import { Injectable, BadRequestException } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { OrderDto, OrderResultDto } from './dto/order.dto';

type ApiListResponse<T> = { total: number; items: T[] };

@Injectable()
export class OrderService {
  constructor(private readonly repo: FilmsRepository) {}

  async createOrder(dto: OrderDto): Promise<ApiListResponse<OrderResultDto>> {
    const results: OrderResultDto[] = [];

    for (const t of dto.tickets) {
      const place = `${t.row}:${t.seat}`;
      const session = await this.repo.getSitsInfo(t.film, t.session);

      if ((session.taken ?? []).includes(place)) {
        throw new BadRequestException('Seat already taken');
      }
      await this.repo.reservePlace(t.film, t.session, place);

      results.push({
        id: crypto.randomUUID(),
        film: t.film,
        session: t.session,
        daytime: session.daytime,
        row: t.row,
        seat: t.seat,
        price: session.price,
      });
    }
    return { total: results.length, items: results };
  }
}
