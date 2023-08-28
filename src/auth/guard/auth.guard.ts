import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants/jwt.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // El objeto context proporciona información
    // sobre la solicitud entrante y el entorno de ejecución.
    const request = context.switchToHttp().getRequest();
    console.log(request.headers.authorization);

    // Aquí puedes implementar tu lógica de autenticación o autorización.
    // Por ejemplo, verificar si el usuario está autenticado, si tiene los roles adecuados, etc.

    // Si la validación es exitosa, devuelve true, permitiendo el acceso.
    // Si la validación falla, devuelve false, denegando el acceso.

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token');
    }

    try {
      const payload = this.jwtService.verifyAsync(token, {
        //secret: process.env.JWT_SECRET
        secret: jwtConstants.secret,
      });
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true; // o false, dependiendo de la lógica de tu guard.
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
