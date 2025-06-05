/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<ReturnUserDto> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException();
    }
    if (await bcrypt.compare(password, user.password_hash)) {
      const payload = { sub: user._id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);
      return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        access_token,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async loginAdmin(): Promise<ReturnUserDto> {
    const payload = { sub: 0, email: 'admin', role: 'ADMIN' };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      _id: 0,
      first_name: 'ADMIN',
      last_name: 'ADMIN',
      email: 'ADMIN',
      role: 'ADMIN',
      access_token,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = await this.userModel.create({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password_hash: hashedPassword,
    });

    if (user) {
      const payload = { sub: user._id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        access_token,
      };
    } else {
      throw new BadRequestException();
    }
  }

  async setRole(user_id: string, new_role: string): Promise<boolean> {
    const user = await this.userModel.findById(user_id);
    if (!user) {
      throw new NotFoundException();
    }

    user.role = new_role;
    await user.save();
    return true;
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find();
  }
}
