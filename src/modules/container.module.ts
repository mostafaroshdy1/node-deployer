import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerService } from '../services/docker.service';
import { ContainerRepository } from '../repositories/container.repository';
import { DockerImageService } from 'src/services/dockerImage.service';
import { DockerImageRepository } from 'src/repositories/dockerImage.repository';
import { ContainerService } from 'src/services/container.service';

@Module({
  providers: [
    DockerService,
    ContainerRepository,
    DockerImageService,
    {
      provide: 'IDockerImageRepository',
      useClass: DockerImageRepository,
    },
  ],

  exports: [ContainerRepository],
})
export class ContainerModule {}
