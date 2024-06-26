import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ContainerRepository } from '../repositories/container.repository';
import { DockerImageRepository } from 'src/repositories/dockerImage.repository';
import { ContainerService } from 'src/services/container.service';
import { DockerService } from 'src/services/docker.service';
import { DockerController } from 'src/controllers/docker.controller';

@Module({
  controllers: [DockerController],
  providers: [
    ContainerRepository,
    PrismaService,
    ContainerService,
    DockerService,
    {
      provide: 'IContainerRepository',
      useClass: ContainerRepository,
    },
  ],

  exports: [ContainerService],
})
export class ContainerModule {}
