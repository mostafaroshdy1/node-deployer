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
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      console.error('Authorization header missing');
      return false;
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const { id, accessToken } = this.jwtService.verify(token);
      request.accessToken = accessToken;
      request.userId = id.toString();

      console.log('User ID:', request.userId);
      console.log('Access Token:', request.accessToken);
      
    } catch (error) {
      console.error('Token verification error:', error.message);
      return false;
    }

    return super.canActivate(context);
  }
}
