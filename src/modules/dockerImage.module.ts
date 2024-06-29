import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DockerImageRepository } from 'src/repositories/dockerImage.repository';
import { DockerImageService } from 'src/services/dockerImage.service';
import { ContainerModule } from './container.module';
import { DockerService } from 'src/services/docker.service';

@Module({
  imports: [ContainerModule],
  providers: [
    PrismaService,
    {
      provide: 'IDockerImageRepository',
      useClass: DockerImageRepository,
    },
    DockerService,
    DockerImageService,
  ],
  exports: [DockerImageService, ContainerModule],
})
export class DockerImageModule {}
