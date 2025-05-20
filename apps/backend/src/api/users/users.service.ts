/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
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
}
