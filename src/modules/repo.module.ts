import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DockerService } from 'src/services/docker.service';
import { RepoRepository } from 'src/repositories/repo.repository';
import { RepoService } from 'src/services/repo.service';
import { DockerImageModule } from './dockerImage.module';
import { ContainerModule } from './container.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [DockerImageModule, ContainerModule, forwardRef(() => AuthModule)],
  providers: [
    PrismaService,
    DockerService,
    {
      provide: 'IRepoRepository',
      useClass: RepoRepository,
    },
    RepoService,
  ],
  exports: [RepoService, DockerImageModule, ContainerModule],
})
export class RepoModule {}
