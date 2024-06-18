import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DockerService } from '../services/docker.service';
import { DockerImageRepository } from '../repositories/dockerImage.repository';

@Module({
  providers: [PrismaService, DockerService, DockerImageRepository],
  exports: [DockerImageRepository],
})
export class DockerImageModule {}
