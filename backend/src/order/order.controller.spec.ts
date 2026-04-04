import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let ordersService: jest.Mocked<OrderService>;

  const orderServiceMock = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    ordersService = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create order from service', async () => {
    const mockDto = {
      email: 'admin@gmail.com',
      phone: '64564564646',
      tickets: [
        {
          film: 'row',
          session: '32',
          row: 3,
          seat: 67,
          daytime: '13:02:2020',
          price: 453,
        },
      ],
    };

    const mockResult = {
      total: 1,
      items: [
        {
          id: '34342342',
          film: 'row',
          session: '32',
          daytime: '13:02:2020',
          row: 3,
          seat: 67,
          price: 453,
        },
      ],
    };

    ordersService.createOrder.mockResolvedValue(mockResult);

    const result = await controller.create(mockDto);
    expect(ordersService.createOrder).toHaveBeenCalledTimes(1);
    expect(ordersService.createOrder).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual(mockResult);
  });

  it('should create order with 2 tickets from service', async () => {
    const mockDto = {
      email: 'admin@gmail.com',
      phone: '64564564646',
      tickets: [
        {
          film: 'tttt',
          session: '45',
          row: 45,
          seat: 13,
          daytime: '12:43:5002',
          price: 123,
        },
        {
          film: 'rrrr',
          session: '54',
          row: 54,
          seat: 31,
          daytime: '12:43:5002',
          price: 321,
        },
      ],
    };

    const mockResult = {
      total: 2,
      items: [
        {
          id: '34342342',
          film: 'tttt',
          session: '45',
          daytime: '12:43:5002',
          row: 45,
          seat: 13,
          price: 123,
        },
        {
          id: '34342342',
          film: 'rrrr',
          session: '54',
          daytime: '12:43:5002',
          row: 54,
          seat: 31,
          price: 321,
        },
      ],
    };

    ordersService.createOrder.mockResolvedValue(mockResult);

    const result = await controller.create(mockDto);
    expect(ordersService.createOrder).toHaveBeenCalledTimes(1);
    expect(ordersService.createOrder).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual(mockResult);
  });
});
