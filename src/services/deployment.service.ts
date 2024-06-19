import { Injectable } from '@nestjs/common';
import { DockerService } from './docker.service';
import { RepoService } from './repo.service';
import path from 'path';

@Injectable()
export class DeploymentService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly repoService: RepoService,
  ) {
    this.reposPath = path.join(__dirname, 'src/repos');
  }
  reposPath: string;
  async createImage(
    repoId: string,
    userId: string,
    nodeVersion: string,
  ): Promise<string> {
    try {
      // must add validation here first to check if the user owns the repo
      const repo = await this.repoService.findById(repoId);

      if (repo.userId !== userId)
        throw new Error('User does not own this repo');

      const dirName = await this.dockerService.cloneRepo(repo.url);
      const repoPath = this.reposPath + dirName;
      // await this.dockerService.generateDockerFile(nodeVersion, repoPath);
      // const ImageId = await this.dockerService.createImage(repoPath, repo);
    } catch (error) {
      console.error(error);
    }

    return;
  }
}
