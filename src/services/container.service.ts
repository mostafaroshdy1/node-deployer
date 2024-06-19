import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Container, Prisma } from '@prisma/client';
import { IContainerRepository } from 'src/interfaces/container-repository.interface';
import { DockerService } from 'src/services/docker.service';
import { TierService } from './tier.service';
import { CreateContainerDto } from 'src/dtos/create-container.dto';

@Injectable()
export class ContainerService {
  constructor(
    @Inject('IContainerRepository')
    private readonly containerRepository: IContainerRepository,
    private readonly dockerService: DockerService,
    private readonly tierService: TierService,
  ) {}

  async findAll(): Promise<Container[]> {
    return this.containerRepository.findAll();
  }

  async findById(id: string): Promise<Container | null> {
    return this.containerRepository.findById(id);
  }

  async create(data: CreateContainerDto): Promise<Container> {
    try {
      const [tier, container] = await Promise.all([
        this.tierService.findById(data.tierId),
        this.containerRepository.create({
          ...data,
          tier: { connect: { id: data.tierId } },
          dockerImage: {
            connect: { id: data.dockerImageId },
          },
        }),
      ]);

      await this.dockerService.createContainer(
        container.port,
        container.ip,
        tier.memory,
        tier.cpu,
        container.dockerImageId,
      );
      return container;
    } catch (e) {
      console.log(e);
    }
  }

  async update(
    id: string,
    data: Prisma.ContainerUpdateInput,
  ): Promise<Container | null> {
    const foundContainer = await this.findById(id);
    if (!foundContainer) {
      throw new BadRequestException('Container not found');
    }
    return this.containerRepository.update(id, { ...foundContainer, ...data });
  }

  async remove(id: string): Promise<Container> {
    try {
      const container = await this.containerRepository.remove(id);
      if (!container) {
        throw new BadRequestException('Container not found');
      }
      await this.dockerService.deleteContainer(container.id);
      return container;
    } catch (e) {
      console.log(e);
    }
  }

  async removeByImageId(imageId: string): Promise<Prisma.BatchPayload> {
    try {
      const containers = await this.containerRepository.findByImageId(imageId);
      const deleted = await this.containerRepository.removeByImageId(imageId);

      if (containers.length > 0) {
        await Promise.all(
          containers.map(async (container) => {
            await this.dockerService.deleteContainer(container.id);
          }),
        );
      }
      return deleted;
    } catch (e) {
      console.log(e);
    }
  }
}
