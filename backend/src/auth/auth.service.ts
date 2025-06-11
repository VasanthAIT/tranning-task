
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
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
  const { username, email, password } = registerDto;

  const existingUserByUsername = await this.usersService.findByUsername(username);
  if (existingUserByUsername) {
    throw new BadRequestException('Username already exists');
  }

  const existingUserByEmail = await this.usersService.findByEmail(email);
  if (existingUserByEmail) {
    throw new BadRequestException('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await this.usersService.create({
    username,
    email,
    password: hashedPassword,
  });

  const payload = { sub: newUser._id.toString(), username };
  const access_token = this.jwtService.sign(payload);

  return {
    access_token,
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  };
}


async login(loginDto: LoginDto) {
  const { username, password } = loginDto;
  console.log('Login DTO:', loginDto);

  const user = await this.usersService.findByUsername(username);
  if (!user) {
    console.log('User not found');
    throw new UnauthorizedException('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log('Password mismatch');
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = { username: user.username, sub: user._id.toString() };
  const access_token = this.jwtService.sign(payload);
  console.log('Generated Token:', access_token); 

  return {
    access_token,
    user: { _id: user._id, username: user.username },
  };
}

}
