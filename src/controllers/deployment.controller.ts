import { Body, Controller, Post } from '@nestjs/common';
import { DeploymentService } from 'src/services/deployment.service';

@Controller('deploy')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post('image')
  async createImage() {
    return await this.deploymentService.createImage(
      '66732ab6fa218dacf5e4e770',
      '66732a7afa218dacf5e4e76a',
      '20.14.0',
    );
  }

  @Post('container')
  async createContainer(
    @Body()
    body: {
      userId: string;
      repoId: string;
      nodeVersion: string;
      tierId: string;
    },
  ) {
    const container = await this.deploymentService.deploy(
      body.repoId,
      body.userId,
      body.nodeVersion,
      body.tierId,
    );
    const ipAddress = container.ip + ':' + container.port;
    return { ipAddress };
  }
}
