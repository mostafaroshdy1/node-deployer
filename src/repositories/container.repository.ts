import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IContainerRepository } from 'src/interfaces/container-repository.interface';
import { DockerService } from 'src/services/docker.service';
import { Container, Prisma } from '@prisma/client';

@Injectable()
export class ContainerRepository implements IContainerRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dockerService: DockerService,
  ) {}

  findAll(): Promise<Container[]> {
    return this.prisma.container.findMany();
  }

  findById(id: string): Promise<Container | null> {
    return this.prisma.container.findUnique({ where: { id } });
  }

  async create(data: Prisma.ContainerCreateInput): Promise<Container> {
    const container = await this.prisma.container.create({
      data,
      include: {
        tier: true,
      },
    });
    await this.dockerService.createContainer(
      container.port,
      container.ip,
      container.tier.memory,
      container.tier.cpu,
      container.dockerImageId,
    );
    return container;
  }

  update(id: string, data: Prisma.ContainerUpdateInput): Promise<Container> {
    return this.prisma.container.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Container> {
    const container = await this.prisma.container.findUnique({
      where: { id },
      include: { dockerImage: true },
    });
    if (container && container.dockerImage) {
      await this.dockerService.deleteContainer(container.id);
      await this.dockerService.deleteImage(container.dockerImage.id);
      await this.prisma.dockerImage.delete({
        where: { id: container.dockerImage.id },
      });
    }
    return this.prisma.container.delete({ where: { id } });
  }
}
