import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IDockerImageRepository } from 'src/interfaces/dockerImage-repository.interface';
import { DockerImage, Prisma } from '@prisma/client';

@Injectable()
export class DockerImageRepository implements IDockerImageRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll(): Promise<DockerImage[]> {
    return this.prisma.dockerImage.findMany();
  }

  findById(id: string): Promise<DockerImage | null> {
    return this.prisma.dockerImage.findUnique({ where: { id } });
  }

  create(data: Prisma.DockerImageCreateInput): Promise<DockerImage> {
    return this.prisma.dockerImage.create({ data });
  }

  update(id: string, data: Prisma.DockerImageUpdateInput): Promise<DockerImage> {
    return this.prisma.dockerImage.update({ where: { id }, data });
  }

  async remove(id: string): Promise<DockerImage> {
    return this.prisma.dockerImage.delete({ where: { id } });
  }
}
