import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateDockerImageDto } from '../dtos/create-dockerImage.dto';
import { UpdateDockerImageDto } from '../dtos/update-dockerImage.dto';
import { DockerImage, Prisma, Repo } from '@prisma/client';
import { IDockerImageRepository } from 'src/interfaces/dockerImage-repository.interface';
import { DockerService } from 'src/services/docker.service';
import { ContainerService } from './container.service';

@Injectable()
export class DockerImageService {
  constructor(
    @Inject('IDockerImageRepository')
    private readonly dockerImageRepository: IDockerImageRepository,
    private readonly dockerService: DockerService,
    private readonly containerService: ContainerService,
  ) {}

  async findAll(): Promise<DockerImage[]> {
    return this.dockerImageRepository.findAll();
  }

  async findById(id: string): Promise<DockerImage | null> {
    return this.dockerImageRepository.findById(id);
  }

  async create(
    data: {
      repo: Repo;
      repoPath: string;
      imageName: string;
    },
    nodeVersion: string,
  ): Promise<DockerImage> {
    try {
      await Promise.all([
        this.dockerService.generateDockerFile(nodeVersion, data.repoPath),
        this.dockerService.generateEnv(data.repoPath, `'${data.repo.env}'`), // must follow this format as the script takes string
      ]);

      let dockerImage = await this.dockerImageRepository.findByRepoId(
        data.repo.id,
      );

      if (dockerImage) {
        return dockerImage;
      }

      const dockerImageId = await this.dockerService.createImage(
        data.repoPath,
        data.imageName,
      );
      dockerImage = await this.dockerImageRepository.create(
        data.repo.id,
        dockerImageId.split(':')[1],
      );

      return dockerImage;
    } catch (error) {
      console.error(error);
    }
  }

  async update(
    id: string,
    data: UpdateDockerImageDto,
  ): Promise<DockerImage | null> {
    const foundDockerImage = await this.findById(id);
    if (!foundDockerImage) {
      throw new BadRequestException('DockerImage not found');
    }
    return this.dockerImageRepository.update(id, {
      ...foundDockerImage,
      ...data,
    });
  }

  async remove(id: string): Promise<DockerImage> {
    const dockerImage = await this.findById(id);
    if (!dockerImage) {
      throw new BadRequestException('DockerImage not found');
    }
    await this.dockerService.deleteImageCascade(id);
    return this.dockerImageRepository.remove(id);
  }

  async removeByRepoId(repoId: string): Promise<DockerImage> {
    const dockerImage = await this.dockerImageRepository.removeByRepoId(repoId);
    if (!dockerImage) {
      throw new BadRequestException('DockerImage not found');
    }
    await this.containerService.removeByImageId(dockerImage.id);
    await this.dockerService.deleteImageCascade(dockerImage.id);
    return dockerImage;
  }

  async findByRepoId(repoId: string): Promise<DockerImage> {
    return this.dockerImageRepository.findByRepoId(repoId);
  }
}
