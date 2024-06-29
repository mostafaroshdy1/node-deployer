import { Controller, Get, Param } from '@nestjs/common';
import { DockerService } from '../services/docker.service';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @Get('images')
  async getDockerImages() {
    try {
      const imagesList = await this.dockerService.listImages();
      return { imagesList };
    } catch (error) {
      return { error: 'Failed to fetch Docker images' };
    }
  }

  @Get('images/:id')
  async getDockerImageById(@Param('id') id: string) {
    try {
      const image = await this.dockerService.getImageById(id);
      return { image };
    } catch (error) {
      return { error: `Failed to fetch Docker image with ID ${id}` };
    }
  }

  @Get('containers/:id')
  async getDockerContainerById(@Param('id') id: string) {
    try {
      const container = await this.dockerService.getContainerById(id);
      return { container };
    } catch (error) {
      return { error: `Failed to fetch Docker container with ID ${id}` };
    }
  }

  @Get('containers')
  async getDockerContainers() {
    try {
      const containersList = await this.dockerService.listContainers();
      return { containersList };
    } catch (error) {
      return { error: 'Failed to fetch Docker containers' };
    }
  }
}
