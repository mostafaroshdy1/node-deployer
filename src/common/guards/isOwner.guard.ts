import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DeploymentService } from 'src/services/deployment.service';
import { CustomRequest } from 'src/interfaces/custom-request.interface';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private readonly deploymentService: DeploymentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const { userId } = request;
    const containerId = request.params.containerId;

    if (!userId || !containerId) {
      throw new BadRequestException('Missing user ID or container ID');
    }

    const repos =
      await this.deploymentService.findAllContainersByUserId(userId);
    const found = repos.find((repo) =>
      repo.dockerImage.Containers.some(
        (container) => container.id === containerId,
      ),
    );

    if (!found) {
      throw new ForbiddenException('You do not own this container');
    }

    return true;
  }
}
