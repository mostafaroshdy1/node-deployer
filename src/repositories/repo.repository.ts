import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IRepoRepository } from 'src/interfaces/repo-repository.interface';
import { Repo, Prisma } from '@prisma/client';

@Injectable()
export class RepoRepository implements IRepoRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Repo[]> {
    return this.prisma.repo.findMany({
      include: {
        dockerImage: true,
      },
    });
  }
  findAllWhere(where: Prisma.RepoWhereInput): Promise<Repo[]> {
    return this.prisma.repo.findMany({
      where,
    });
  }

  findById(id: string): Promise<Repo | null> {
    return this.prisma.repo.findUnique({ where: { id } });
  }

  create(data: Prisma.RepoCreateInput): Promise<Repo> {
    return this.prisma.repo.create({
      data,
      include: {
        dockerImage: true,
      },
    });
  }

  update(id: string, data: Prisma.RepoUpdateInput): Promise<Repo> {
    return this.prisma.repo.update({
      where: { id },
      data,
      include: {
        dockerImage: true,
      },
    });
  }

  remove(id: string): Promise<Repo> {
    return this.prisma.repo.delete({
      where: { id },
    });
  }
}
