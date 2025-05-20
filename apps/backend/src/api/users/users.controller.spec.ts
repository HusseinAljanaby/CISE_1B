/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const mockLoginResult = {
      first_name: 'Unit',
      last_name: 'Test',
      email: 'unit@test.com',
      role: 'USER',
      access_token: 'mocked_token',
    };

    const mockRegisterResult = {
      first_name: 'Unit',
      last_name: 'Test',
      email: 'unit@test.com',
      role: 'USER',
      access_token: 'mocked_token',
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            // Mock the service methods used by your controller
            login: jest.fn().mockResolvedValue(mockLoginResult),
            createUser: jest.fn().mockResolvedValue(mockRegisterResult),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Should login with mock user', async () => {
    const result = await controller.login('unit@test.com', '123');
    expect(result.first_name).toBe('Unit');
  });

  it('Should create mock user', async () => {
    const result = await controller.createUser({
      first_name: 'Unit',
      last_name: 'Test',
      email: 'unit@test.com',
      password: '123',
    });
    expect(result.first_name).toBe('Unit');
  });
});
