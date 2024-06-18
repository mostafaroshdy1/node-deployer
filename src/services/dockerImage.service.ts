import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateDockerImageDto } from '../dtos/create-dockerImage.dto';
import { UpdateDockerImageDto } from '../dtos/update-dockerImage.dto';
import { DockerImage } from '@prisma/client';
import { IDockerImageRepository } from 'src/interfaces/dockerImage-repository.interface';
import { DockerService } from 'src/services/docker.service';

@Injectable()
export class DockerImageService {
  constructor(
    @Inject('IDockerImageRepository')
    private readonly dockerImageRepository: IDockerImageRepository,
    private readonly dockerService: DockerService
  ) {}

  async findAll(): Promise<DockerImage[]> {
    return this.dockerImageRepository.findAll();
  }

  async findById(id: string): Promise<DockerImage | null> {
    return this.dockerImageRepository.findById(id);
  }

  async create(data: CreateDockerImageDto): Promise<DockerImage> {
    return this.dockerImageRepository.create(data);
  }

  async update(id: string, data: UpdateDockerImageDto): Promise<DockerImage | null> {
    const foundDockerImage = await this.findById(id);
    if (!foundDockerImage) {
      throw new BadRequestException('DockerImage not found');
    }
    return this.dockerImageRepository.update(id, { ...foundDockerImage, ...data });
  }

  async remove(id: string): Promise<DockerImage> {
    const dockerImage = await this.findById(id);
    if (!dockerImage) {
      throw new BadRequestException('DockerImage not found');
    }
    return this.dockerImageRepository.remove(id);
  }
}
