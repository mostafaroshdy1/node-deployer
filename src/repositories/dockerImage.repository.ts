import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IDockerImageRepository } from 'src/interfaces/dockerImage-repository.interface';
import { DockerImage, Prisma, Repo } from '@prisma/client';

@Injectable()
export class DockerImageRepository implements IDockerImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<DockerImage[]> {
    return this.prisma.dockerImage.findMany();
  }

  findById(id: string): Promise<DockerImage | null> {
    return this.prisma.dockerImage.findUnique({ where: { id } });
  }

  create(repoId: string, id: string): Promise<DockerImage> {
    return this.prisma.dockerImage.create({
      data: {
        id,
        repo: { connect: { id: repoId } },
      },
    });
  }

  findOrCreate(repoId: string, id: string): Promise<DockerImage> {
    return this.prisma.dockerImage.upsert({
      where: {
        repoId: repoId,
      },
      update: {},
      create: {
        id,
        repo: { connect: { id: repoId } },
      },
    });
  }

  update(
    id: string,
    data: Prisma.DockerImageUpdateInput,
  ): Promise<DockerImage> {
    return this.prisma.dockerImage.update({ where: { id }, data });
  }

  remove(id: string): Promise<DockerImage> {
    return this.prisma.dockerImage.delete({ where: { id } });
  }
  removeByRepoId(repoId: string): Promise<DockerImage> {
    return this.prisma.dockerImage.delete({ where: { repoId } });
  }

  findByRepoId(repoId: string): Promise<DockerImage | null> {
    return this.prisma.dockerImage.findFirst({
      where: { repoId },
    });
  }
}
