import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IRepoRepository } from 'src/interfaces/repo-repository.interface';
import { DockerService } from 'src/services/docker.service';
import { Repo ,Prisma} from '@prisma/client';

@Injectable()
export class RepoRepository implements IRepoRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dockerService: DockerService
  ) {}

  findAll(): Promise<Repo[]> {
    return this.prisma.repo.findMany();
  }

  findById(id: string): Promise<Repo | null> {
    return this.prisma.repo.findUnique({ where: { id } });
  }

  create(data: Prisma.RepoCreateInput): Promise<Repo> {
    return this.prisma.repo.create({ data });
  }

  update(id: string, data: Prisma.RepoUpdateInput): Promise<Repo> {
    return this.prisma.repo.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Repo> {
    const repo = await this.prisma.repo.findUnique({ where: { id }, include: { dockerImage: true } });
    if (repo) {
      if (repo.dockerImage) {
        await this.dockerService.deleteImageCascade(repo.dockerImage.id);
        await this.prisma.dockerImage.delete({ where: { id: repo.dockerImage.id } });
      }
    }
    return this.prisma.repo.delete({ where: { id } });
  }
}
