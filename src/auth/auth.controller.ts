import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './guard/auth.guard';
import { LoginDto } from './dto/login.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from 'src/common/enums/rol.enum';

interface RequestWithUser extends Request {
  user: { email: string; role: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  register(@Body() data: RegisterDto) {
    console.log(data);
    return this.authService.register(data);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  profile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
