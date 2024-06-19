import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service'; 
import { Container, Prisma } from '@prisma/client';
import { IContainerRepository } from 'src/interfaces/container-repository.interface';
import { DockerService } from 'src/services/docker.service';

@Injectable()
export class ContainerService {
  constructor(
    @Inject('IContainerRepository')
    private readonly containerRepository: IContainerRepository, 
    private readonly dockerService: DockerService,
    private readonly prisma: PrismaService,  
  ) {}

  async findAll(): Promise<Container[]> {
    return this.containerRepository.findAll();
  }

  async findById(id: string): Promise<Container | null> {
    return this.containerRepository.findById(id);
  }

  async create(data: Prisma.ContainerCreateInput): Promise<Container> {
    const container = await this.containerRepository.create(data);
    await this.dockerService.createContainer(
      container.port,
      container.ip,
      container.tier.memory,
      container.tier.cpu,
      container.dockerImageId,
    );
    return container;
  }

  async update(id: string, data: Prisma.ContainerUpdateInput): Promise<Container | null> {
    const foundContainer = await this.findById(id);
    if (!foundContainer) {
      throw new BadRequestException('Container not found');
    }
    return this.containerRepository.update(id, { ...foundContainer, ...data });
  }

  async remove(id: string): Promise<Container> {
    const container = await this.findById(id);
    if (!container) {
      throw new BadRequestException('Container not found');
    }
    if (container.dockerImage) {
      await this.dockerService.deleteContainer(container.id);
      await this.dockerService.deleteImage(container.dockerImage.id);
      await this.prisma.dockerImage.delete({
        where: { id: container.dockerImage.id },
      });
    }
    return this.containerRepository.remove(id);
  }
}
