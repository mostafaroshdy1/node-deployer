import {
  Injectable,
  ExecutionContext,
  BadRequestException,
  CanActivate,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Provider } from '../enums/providers.enum';

@Injectable()
export class DynamicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const provider = request.params.provider;

    if (!Object.values(Provider).includes(provider)) {
      throw new BadRequestException('Invalid provider');
    }

    const guard = new (AuthGuard(provider))();
    return guard.canActivate(context) as boolean;
  }
}
