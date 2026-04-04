import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<FilmsService>;

  const filmsServiceMock = {
    getFilms: jest.fn(),
    getFilmSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return films list from service', async () => {
    const mockResult = {
      total: 1,
      items: [
        {
          id: '1',
          title: 'Film 1',
          about: 'About film 1',
          image: 'image.jpg',
          rating: 5,
          director: 'Director 1',
          tags: ['drama'],
          description: 'Description 1',
          cover: 'cover.jpg',
        },
      ],
    };

    filmsService.getFilms.mockResolvedValue(mockResult);

    const result = await controller.getFilms();

    expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
  });

  it('should return film sessions from service by id', async () => {
    const filmId = '42';

    const mockResult = {
      total: 1,
      items: [
        {
          id: 'session-1',
          film: filmId,
          daytime: '10:00',
          hall: '2',
          rows: 10,
          seats: 20,
          price: 500,
          taken: ['1', '2'],
        },
      ],
    };

    filmsService.getFilmSession.mockResolvedValue(mockResult);

    const result = await controller.getSession(filmId);

    expect(filmsService.getFilmSession).toHaveBeenCalledTimes(1);
    expect(filmsService.getFilmSession).toHaveBeenCalledWith(filmId);
    expect(result).toEqual(mockResult);
  });
});
