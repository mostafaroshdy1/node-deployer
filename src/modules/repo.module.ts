import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerService } from '../services/docker.service';
import { RepoRepository } from '../repositories/repo.repository';
import { DockerImageService } from 'src/services/dockerImage.service';
import { DockerImageRepository } from 'src/repositories/dockerImage.repository';

@Module({
  providers: [
    PrismaService,
    DockerService,
    RepoRepository,
    DockerImageService,
    {
      provide: 'IDockerImageRepository',
      useClass: DockerImageRepository,
    },
  ],
  exports: [RepoRepository, DockerImageService],
})
export class RepoModule {}
