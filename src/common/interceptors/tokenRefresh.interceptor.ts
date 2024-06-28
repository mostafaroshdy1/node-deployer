import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const user = request.user;
    const refreshToken = request.refreshToken;
    const provider = user.provider;

    return next.handle().pipe(
      catchError((error) => {
        if (error.status === 401 && error.message === 'TokenExpiredError') {
          return from(
            this.authService.refreshAccessToken(refreshToken, provider),
          ).pipe(
            switchMap((tokens) => {
              user.accessToken = tokens.accessToken;
              user.refreshToken = tokens.refreshToken;

              const newJwtToken = this.jwtService.sign({
                id: user.id,
                email: user.email,
                provider: user.provider,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken,
              });

              response.cookie('accessToken', newJwtToken, {
                httpOnly: true,
                secure: true,
              });

              request.headers.authorization = `Bearer ${user.accessToken}`;

              response.locals.newAccessToken = newJwtToken;

              return next.handle();
            }),
            catchError((refreshError) => {
              console.error('Failed to refresh access token:', refreshError);
              return throwError(refreshError);
            }),
          );
        }
        return throwError(
          () => new InternalServerErrorException(error.message),
        );
      }),
    );
  }
}
