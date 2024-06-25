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
    console.log('Extracted token:', token);

    if (token) {
      try {
        const { id, accessToken } = this.jwtService.verify(token);
        console.log('Decoded token id:', id);
        console.log('Decoded token accessToken:', accessToken);

        request.accessToken = accessToken;
        request.userId = id.toString();

        // if (typeof request.userId === 'string') {
        //   console.log('userId is a string:', request.userId);
        // } else {
        //   console.log('userId is not a string:', request.userId);
        // }

        console.log('Set request userId:', request.userId);
      } catch (error) {
        console.error('Token verification error:', error);
      }
    }

    return super.canActivate(context);
  }
}
