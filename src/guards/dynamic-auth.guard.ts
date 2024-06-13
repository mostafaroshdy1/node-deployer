import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DynamicAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const provider = request.params.provider;
    const guard = new (AuthGuard(provider))();
    return (await guard.canActivate(context)) as boolean;
  }
}
