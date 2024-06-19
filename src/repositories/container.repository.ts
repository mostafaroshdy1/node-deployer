import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IContainerRepository } from 'src/interfaces/container-repository.interface';
import { Container, Prisma } from '@prisma/client';

@Injectable()
export class ContainerRepository implements IContainerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Container[]> {
    return this.prisma.container.findMany({
      include: {
        tier: true,
        dockerImage: true,
      },
    });
  }

  findById(id: string): Promise<Container | null> {
    return this.prisma.container.findUnique({
      where: { id },
      include: {
        tier: true,
        dockerImage: true,
      },
    });
  }

  create(data: Prisma.ContainerCreateInput): Promise<Container> {
    return this.prisma.container.create({
      data,
      include: {
        tier: true,
      },
    });
  }

  update(id: string, data: Prisma.ContainerUpdateInput): Promise<Container> {
    return this.prisma.container.update({
      where: { id },
      data,
      include: {
        tier: true,
        dockerImage: true,
      },
    });
  }

  remove(id: string): Promise<Container> {
    return this.prisma.container.delete({
      where: { id },
    });
  }
}
