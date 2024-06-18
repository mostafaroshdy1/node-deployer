import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerService } from '../services/docker.service';
import { RepoRepository } from '../repositories/repo.repository';

@Module({
  providers: [PrismaService, DockerService, RepoRepository],
  exports: [RepoRepository],
})
export class RepoModule {}
