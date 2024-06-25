import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Container, Repo } from '@prisma/client';
import { DeploymentService } from 'src/services/deployment.service';
import { ContainerService } from 'src/services/container.service';
import { DynamicAuthGuard } from 'src/common/guards/dynamic-auth.guard';

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

  @Get('container')
  async getContainer(@Param('userId') userId: string): Promise<Repo[]> {
    const userIdTemp = '667865ac43667afc84a06e63';
    const container =
      await this.deploymentService.findAllContainersByUserId(userIdTemp);
    return container;
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

  @Post('container/restart/:containerId')
  async restartContainer(
    @Param('containerId') containerId: string,
  ): Promise<{ containerId: string }> {
    await this.containerService.stopContainer(containerId);
    const container = await this.containerService.resumeContainer(containerId);
    return { containerId: container.id };
  }

  @Post('container/resume/:containerId')
  async resumeContainer(
    @Param('containerId') containerId: string,
  ): Promise<{ containerId: string }> {
    const container = await this.containerService.resumeContainer(containerId);
    return { containerId: container.id };
  }
}
