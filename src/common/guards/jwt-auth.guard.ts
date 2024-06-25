import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from '../../interfaces/custom-request.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (token) {
      try {
        const { id, accessToken } = this.jwtService.verify(token);

        request.accessToken = accessToken;
        request.userId = id;
      } catch (error) {
        console.error('Token verification error:', error);
      }
    }

    return super.canActivate(context);
  }
}
