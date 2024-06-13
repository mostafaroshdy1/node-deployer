import {
  Injectable,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { map } from 'rxjs';

enum Provider {
  GITHUB = 'github',
}

@Injectable()
export class DynamicAuthInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const provider = request.params.provider;
    if (!Object.values(Provider).includes(provider)) {
      throw new BadRequestException('Invalid provider');
    }
    const guard = new (AuthGuard(provider))();
    const canActivate = await guard.canActivate(context);
    return next.handle().pipe(
      map(() => {
        return canActivate as boolean;
      }),
    );
  }
}
