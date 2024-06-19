import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DockerService } from './docker.service';
import { RepoService } from './repo.service';
import path from 'path';
import { DockerImage } from '@prisma/client';
import { DockerImageService } from './dockerImage.service';

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
      this.reposPath = path.join(__dirname, '../../../..');
      // must add validation here first to check if the user owns the repo
      console.log('reposPath', this.reposPath);
      const repo = await this.repoService.findById(repoId);
      console.log('repo', repo);
      const dirName = await this.dockerService.cloneRepo(
        repo.url,
        this.reposPath,
      );
      console.log('dirName nnn', dirName)
      // const repoPath = this.reposPath + dirName;
      await this.dockerService.generateDockerFile(nodeVersion, dirName);
      console.log('hereeeee'+nodeVersion + 'nodeVersion'+ dirName + 'dirName')
      return this.dockerImageService.create(repo, dirName);
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
