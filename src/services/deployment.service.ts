import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DockerService } from './docker.service';
import { RepoService } from './repo.service';
import path from 'path';
import { Container, DockerImage } from '@prisma/client';
import { DockerImageService } from './dockerImage.service';
import { TierService } from './tier.service';
import { UserService } from './user.service';
import { ContainerService } from './container.service';

@Injectable()
export class DeploymentService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly repoService: RepoService,
    private readonly dockerImageService: DockerImageService,
    private readonly tierService: TierService,
    private readonly userService: UserService,
    private readonly containerService: ContainerService,
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
    } catch (error) {
      console.error(error);
    }
  }

  async deploy(
    repoId: string,
    userId: string,
    nodeVersion: string,
    tierId: string,
  ): Promise<Container> {
    try {
      const [repo, user, ipAddress] = await Promise.all([
        this.repoService.findById(repoId),
        this.userService.findById(userId),
        this.dockerService.getFreeIpAddress(),
      ]);
      const [ip, port] = ipAddress.split(':');

      // must be put in guard
      if (repo.userId !== userId)
        throw new UnauthorizedException('User does not own this repo');

      const [tier, image] = await Promise.all([
        this.tierService.findById(tierId),
        this.createImage(repoId, userId, nodeVersion),
      ]);

      if (tier.price > user.balance)
        throw new BadRequestException('Insufficient balance');

      await this.userService.update(user.id, {
        balance: user.balance - tier.price,
      });

      const container = await this.containerService.create(
        port,
        ip,
        image,
        tier,
      );
      return container;
    } catch (error) {
      console.error(error);
    }
  }
}
