import { Body, Controller, Post, Delete, Param ,Get} from '@nestjs/common';
import { Container } from '@prisma/client';
import { DeploymentService } from 'src/services/deployment.service';
import { ContainerService } from 'src/services/container.service';

@Controller('deploy')
export class DeploymentController {
  constructor(
    private readonly deploymentService: DeploymentService,
    private readonly containerService: ContainerService,

  ) {}

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
  @Post('container/redeploy')
  async redeployContainer(
    @Body()
    body: {
      repoId: string;
      userId: string;
    },
  ) {
    const containers = await this.deploymentService.redeploy(
      body.repoId,
      body.userId,
    );
    return containers;
    
  }
  @Delete('container/:containerId')
  async deleteContainer(
    @Param('containerId') containerId: string,
  ): Promise<Container> {
    const container = await this.containerService.remove(containerId);
    return container;
  }
  @Post('container/stop/:containerId')
  async stopContainer(
    @Param('containerId') containerId: string,
  ): Promise<{ containerId: string }> {
    const container = await this.containerService.stopContainer(containerId);
    return { containerId: container.id };
  }

  @Post('container/resume/:containerId')
  async resumeContainer(
    @Param('containerId') containerId: string,
  ): Promise<{ containerId: string }> {
    const container = await this.containerService.resumeContainer(containerId);
    return { containerId: container.id };
  }
  @Get('container/logs/:containerId')
  async getContainerLogs(
    @Param('containerId') containerId: string,
  ): Promise<{ logs: any }> {
    const logs = await this.containerService.getContainerLogs(containerId);
    return JSON.parse(logs);
  }

}
