import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerImageRepository } from '../repositories/dockerImage.repository';
import { DockerImageService } from 'src/services/dockerImage.service';
import { ContainerModule } from './container.module';
import { DockerService } from 'src/services/docker.service';

@Module({
  imports: [ContainerModule],
  providers: [
    PrismaService,
    DockerService,
    DockerImageService,
    {
      provide: 'IDockerImageRepository',
      useClass: DockerImageRepository,
    },
  ],
  exports: [DockerImageService, ContainerModule],
})
export class DockerImageModule {}
