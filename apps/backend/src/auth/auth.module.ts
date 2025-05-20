/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
