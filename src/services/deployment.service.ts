import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DockerService } from './docker.service';
import { RepoService } from './repo.service';
import path from 'path';
import { DockerImage } from '@prisma/client';
import { DockerImageService } from './dockerImage.service';
import { dir } from 'console';

@Injectable()
export class DeploymentService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly repoService: RepoService,
    private readonly dockerImageService: DockerImageService,
  ) {}
  reposPath: string;
  async createImage(
    repoId: string,
    userId: string,
    nodeVersion: string,
  ): Promise<DockerImage> {
    try {
      this.reposPath = path.join(__dirname, '../../../../repos/');
      // must add validation here first to check if the user owns the repo
      const repo = await this.repoService.findById(repoId);
      const dirName = await this.dockerService.cloneRepo(
        repo.url,
        this.reposPath,
      );
      const imageName = dirName.toLocaleLowerCase();

      const repoPath = this.reposPath + dirName;
      await this.dockerService.generateDockerFile(nodeVersion, repoPath);
      return this.dockerImageService.create(repo, repoPath, imageName);
      return;
    } catch (error) {
      console.error(error);
    }
  }

  async deploy(
    repoId: string,
    userId: string,
    nodeVersion: string,
  ): Promise<string> {
    try {
      const repo = await this.repoService.findById(repoId);
      if (repo.userId !== userId)
        throw new UnauthorizedException('User does not own this repo');

      const image = await this.createImage(repoId, userId, nodeVersion);
      return await this.dockerService.createContainer(
        '1111',
        '127.0.5.5',
        '1024M',
        '0.5',
        image.id,
      );
    } catch (error) {
      console.error(error);
    }
  }
}
