import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Container, DockerImage, Prisma, Tier } from '@prisma/client';
import { IContainerRepository } from 'src/interfaces/container-repository.interface';
import { DockerService } from 'src/services/docker.service';
import { TierService } from './tier.service';
import { CreateContainerDto } from 'src/dtos/create-container.dto';

@Injectable()
export class ContainerService {
  constructor(
    @Inject('IContainerRepository')
    private readonly containerRepository: IContainerRepository,
    private readonly dockerService: DockerService,
    private readonly tierService: TierService,
  ) {}

  async findAll(): Promise<Container[]> {
    return this.containerRepository.findAll();
  }

  async findById(id: string): Promise<Container | null> {
    return this.containerRepository.findById(id);
  }

  async create(image: DockerImage, tier: Tier,ip:string=null,port:string=null): Promise<Container> {
    try {
      if(ip==null && port==null){
      const ipAddress = await this.dockerService.getFreeIpAddress();
      console.log(ipAddress);
      [ip, port] = ipAddress.split(':');
      }
      const contaienrId = await this.dockerService.createContainer(
        port,
        ip,
        tier.memory,
        tier.cpu,
        image.id,
      );
      const container = await this.containerRepository.create({
        id: contaienrId,
        port: port,
        ip: ip,
        status: 'up',
        tier: { connect: { id: tier.id } },
        dockerImage: { connect: { id: image.id } },
      });
      return container;
    } catch (e) {
      console.log(e);
    }
  }

  async update(
    id: string,
    data: Prisma.ContainerUpdateInput,
  ): Promise<Container | null> {
    const foundContainer = await this.findById(id);
    if (!foundContainer) {
      throw new BadRequestException('Container not found');
    }
    return this.containerRepository.update(id, { ...foundContainer, ...data });
  }

  async remove(id: string): Promise<Container> {
    try {
      const container = await this.containerRepository.remove(id);
      if (!container) {
        throw new BadRequestException('Container not found');
      }
      await this.dockerService.deleteContainer(container.id);
      return container;
    } catch (e) {
      console.log(e);
    }
  }

  async removeByImageId(imageId: string): Promise<Prisma.BatchPayload> {
    try {
      const containers = await this.containerRepository.findByImageId(imageId);
      const deleted = await this.containerRepository.removeByImageId(imageId);

      // Delete containers from infra
      if (containers.length > 0) {
        await Promise.all(
          containers.map(async (container) => {
            await this.dockerService.deleteContainer(container.id);
          }),
        );
      }
      return deleted;
    } catch (e) {
      console.log(e);
    }
  }
  async stopContainer(id: string): Promise<Container> {
    try {
      await this.dockerService.stopContainer(id);
      return this.containerRepository.stopContainer(id);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Failed to stop container');
    }
  }

  async resumeContainer(id: string): Promise<Container> {
    try {
      await this.dockerService.resumeContainer(id);
      return this.containerRepository.resumeContainer(id);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Failed to resume container');
    }
  }
  async findByImageId(imageId: string): Promise<Container[]> {
    return this.containerRepository.findByImageId(imageId);
  }
}
