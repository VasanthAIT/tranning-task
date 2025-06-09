// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { username, password } = registerDto;

      const existingUser = await this.usersService.findByUsername(username);
      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser: any = await this.usersService.create({
        username,
        password: hashedPassword,
      });

      const payload = { sub: createdUser._id.toString(), username };
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: {
          _id: createdUser._id,
          username: createdUser.username,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user: any = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id.toString(), username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        _id: user._id,
        username: user.username,
      },
    };
  }

  async validateUser(username: string, password: string) {
    const user: any = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _pw, ...rest } = user;
      return rest;
    }
    return null;
  }
}
