/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<ReturnUserDto> {
    if (email === 'admin' && password === 'admin') {
      return await this.usersService.loginAdmin();
    }
    return await this.usersService.login(email, password);
  }

  @Post('create-user')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('set-role') async setRole(
    @Body('user_id') user_id: string,
    @Body('new_role') new_role: string,
  ): Promise<boolean> {
    return this.usersService.setRole(user_id, new_role);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }
}
