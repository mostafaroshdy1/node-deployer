import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerService } from '../services/docker.service';
import { ContainerRepository } from '../repositories/container.repository';

@Module({
  providers: [PrismaService, DockerService, ContainerRepository],
  exports: [ContainerRepository],
})
export class ContainerModule {}
