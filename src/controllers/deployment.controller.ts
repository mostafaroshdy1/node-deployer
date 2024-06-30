import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Container, Repo } from '@prisma/client';
import { DeploymentService } from 'src/services/deployment.service';
import { ContainerService } from 'src/services/container.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { IsOwnerGuard } from 'src/common/guards/isOwner.guard';

@Controller('deploy')
export class DeploymentController {
  constructor(
    private readonly deploymentService: DeploymentService,
    private readonly containerService: ContainerService,
  ) {}

  // The user buys new container
  @Post('container')
  @UseGuards(JwtAuthGuard)
  async createContainer(
    @Body('repoId') repoId: string,
    @Body('tierId')  tierId: string,
    @Req() guardReq: CustomRequest,
  ) {
    try {
      console.log('Body', repoId, tierId);
      const { userId } = guardReq;
      const container = await this.deploymentService.deploy(
        repoId,
        userId,
        tierId,
      );
      
      const ipAddress = container.ip + ':' + container.port;
      return { ipAddress };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Error in Deploying Container, fix the configuration and try again',
      );
    }
  }

  @Get('container')
  @UseGuards(JwtAuthGuard)
  async getContainer(@Req() req: CustomRequest): Promise<Repo[]> {
    const { userId } = req;
    const container =
      await this.deploymentService.findAllContainersByUserId(userId);
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
  @UseGuards(JwtAuthGuard, IsOwnerGuard)
  async deleteContainer(
    @Param('containerId') containerId: string,
  ): Promise<Container> {
    const container = await this.containerService.remove(containerId);
    return container;
  }

  @Post('container/stop/:containerId')
  @UseGuards(JwtAuthGuard, IsOwnerGuard)
  async stopContainer(
    @Param('containerId') containerId: string,
    @Req() req: CustomRequest,
  ): Promise<{ containerId: string }> {
    const container = await this.containerService.stopContainer(containerId);
    return { containerId: container.id };
  }

  @Post('container/restart/:containerId')
  @UseGuards(JwtAuthGuard, IsOwnerGuard)
  async restartContainer(
    @Param('containerId') containerId: string,
  ): Promise<{ containerId: string }> {
    await this.containerService.stopContainer(containerId);
    const container = await this.containerService.resumeContainer(containerId);
    return { containerId: container.id };
  }

  @Post('container/resume/:containerId')
  @UseGuards(JwtAuthGuard, IsOwnerGuard)
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
