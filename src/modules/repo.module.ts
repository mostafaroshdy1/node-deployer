import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerService } from '../services/docker.service';
import { RepoRepository } from '../repositories/repo.repository';
import { RepoService } from 'src/services/repo.service';
import { DockerImageModule } from './dockerImage.module';
import { ContainerModule } from './container.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [DockerImageModule, ContainerModule, AuthModule],
  providers: [
    PrismaService,
    DockerService,
    RepoService,
    {
      provide: 'IRepoRepository',
      useClass: RepoRepository,
    },
  ],
  exports: [RepoService, DockerImageModule, ContainerModule],
})
export class RepoModule {}
