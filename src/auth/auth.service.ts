import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { email: user.email, role: user.role };

    const token = this.jwtService.sign(payload);
    return { token, email };
  }
}
