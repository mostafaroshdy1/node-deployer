import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRepoDto } from '../dtos/create-repo.dto';
import { UpdateRepoDto } from '../dtos/update-repo.dto';
import { DockerImage, Prisma, Repo } from '@prisma/client';
import { IRepoRepository } from 'src/interfaces/repo-repository.interface';
import { DockerService } from 'src/services/docker.service';
import { ContainerService } from './container.service';
import { DockerImageService } from './dockerImage.service';
import path from 'path';

@Injectable()
export class RepoService {
  constructor(
    @Inject('IRepoRepository')
    private readonly repoRepository: IRepoRepository,
    private readonly dockerService: DockerService,
    private readonly dockerImageService: DockerImageService,
  ) {}

  findAll(): Promise<Repo[]> {
    return this.repoRepository.findAll();
  }

  findWhere(where: Prisma.RepoWhereInput): Promise<
    Array<
      Prisma.RepoGetPayload<{
        include: {
          dockerImage: { include: { Containers: { include: { tier: true } } } };
        };
      }>
    >
  > {
    return this.repoRepository.findAllWhere(where);
  }

  findById(id: string): Promise<Repo | null> {
    return this.repoRepository.findById(id);
  }

  create(data: Prisma.RepoCreateInput): Promise<Repo> {
    return this.repoRepository.create(data);
  }

  async update(id: string, data: UpdateRepoDto): Promise<Repo | null> {
    const foundRepo = await this.findById(id);
    if (!foundRepo) {
      throw new BadRequestException('Repo not found');
    }
    return this.repoRepository.update(id, { ...foundRepo, ...data });
  }

  async remove(id: string): Promise<Repo> {
    const repo = await this.repoRepository.remove(id);
    if (!repo) {
      throw new BadRequestException('Repo not found');
    }
    await this.dockerImageService.removeByRepoId(repo.id);
    return repo;
  }

  async cloneRepo(repoId: string): Promise<{
    repoPath: string;
    imageName: string;
    repo: Repo;
  }> {
    const reposPath = path.join(__dirname, '../../../../repos/');
    const repo = await this.findById(repoId);
    if (!repo || !repo.url) {
      throw new BadRequestException('Repo not found');
    }
    const dirName = await this.dockerService.cloneRepo(repo.url, reposPath);
    const imageName = dirName.toLocaleLowerCase();
    return {
      repoPath: reposPath + dirName,
      imageName: imageName,
      repo: repo,
    };
  }
}
