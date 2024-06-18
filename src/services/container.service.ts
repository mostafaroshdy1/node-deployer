import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateContainerDto } from '../dtos/create-container.dto';
import { UpdateContainerDto } from '../dtos/update-container.dto';
import { Container } from '@prisma/client';
import { IContainerRepository } from 'src/interfaces/container-repository.interface';
import { DockerService } from 'src/services/docker.service';

@Injectable()
export class ContainerService {
  constructor(
    @Inject('IContainerRepository')
    private readonly containerRepository: IContainerRepository,
    private readonly dockerService: DockerService
  ) {}

  async findAll(): Promise<Container[]> {
    return this.containerRepository.findAll();
  }

  async findById(id: string): Promise<Container | null> {
    return this.containerRepository.findById(id);
  }

  async create(data: CreateContainerDto): Promise<Container> {
    const container = await this.containerRepository.create(data);
    await this.dockerService.createContainer(data.port, data.ip, data.memory, data.cpu, data.dockerImageId);
    return container;
  }

  async update(id: string, data: UpdateContainerDto): Promise<Container | null> {
    const foundContainer = await this.findById(id);
    if (!foundContainer) {
      throw new BadRequestException('Container not found');
    }
    return this.containerRepository.update(id, { ...foundContainer, ...data });
  }

  async remove(id: string): Promise<Container> {
    const container = await this.findById(id);
    if (!container) {
      throw new BadRequestException('Container not found');
    }
    return this.containerRepository.remove(id);
  }
}
