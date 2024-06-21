import { Body, Controller, Post, Delete, Param } from '@nestjs/common';
import { Container } from '@prisma/client';
import { DeploymentService } from 'src/services/deployment.service';

@Controller('deploy')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  // The user buys new container
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

  @Delete('container/:containerId')
  async deleteContainer(
    @Param('containerId') containerId: string,
  ): Promise<Container> {
    const container = await this.deploymentService.deleteContainer(containerId);
    return container;
  }
  @Post('container/stop/:containerId')
  async stopContainer(
    @Param('containerId') containerId: string,
  ): Promise<{ containerId: string }> {
    const container = await this.deploymentService.stopContainer(containerId);
    return { containerId: container.id };
  }

  @Post('container/resume/:containerId')
  async resumeContainer(
    @Param('containerId') containerId: string,
  ): Promise<{ containerId: string }> {
    const container = await this.deploymentService.resumeContainer(containerId);
    return { containerId: container.id };
  }
}
