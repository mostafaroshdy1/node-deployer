import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRepoDto } from '../dtos/create-repo.dto';
import { UpdateRepoDto } from '../dtos/update-repo.dto';
import { DockerImage, Prisma, Repo } from '@prisma/client';
import { IRepoRepository } from 'src/interfaces/repo-repository.interface';
import { DockerService } from 'src/services/docker.service';
import { ContainerService } from './container.service';
import { DockerImageService } from './dockerImage.service';

@Injectable()
export class RepoService {
  constructor(
    @Inject('IRepoRepository')
    private readonly repoRepository: IRepoRepository,
    private readonly dockerService: DockerService,
    private readonly dockerImageService: DockerImageService,
  ) {}

  async findAll(): Promise<Repo[]> {
    return this.repoRepository.findAll();
  }

  async findById(id: string): Promise<Repo | null> {
    return this.repoRepository.findById(id);
  }

  async create(data: Prisma.RepoCreateInput): Promise<Repo> {
    // await this.dockerService.cloneRepo(data.url);
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
}
