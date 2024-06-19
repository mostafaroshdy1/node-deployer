import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerService } from '../services/docker.service';
import { RepoRepository } from '../repositories/repo.repository';
import { DockerImageService } from 'src/services/dockerImage.service';
import { DockerImageRepository } from 'src/repositories/dockerImage.repository';
import { ContainerService } from 'src/services/container.service';
import { ContainerRepository } from 'src/repositories/container.repository';
import { TierRepository } from 'src/repositories/tier.repository';
import { TierService } from 'src/services/tier.service';

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
    {
      provide: 'IContainerRepository',
      useClass: ContainerRepository,
    },
    {
      provide: 'ITierRepository',
      useClass: TierRepository,
    },
    ContainerService,
    TierService,
  ],
  exports: [RepoRepository, DockerImageService],
})
export class RepoModule {}
