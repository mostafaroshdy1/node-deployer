import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerService } from '../services/docker.service';
import { DockerImageRepository } from '../repositories/dockerImage.repository';
import { DockerImageService } from 'src/services/dockerImage.service';

@Module({
  providers: [
    PrismaService,
    DockerService,
    {
      provide: 'IDockerImageRepository',
      useClass: DockerImageRepository,
    },

    DockerImageService,
  ],
  // exports: [DockerImageRepository],
})
export class DockerImageModule {}
