import {
  BadRequestException,
  Delete,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RepoService } from './repo.service';
import { Container, DockerImage } from '@prisma/client';
import { DockerImageService } from './dockerImage.service';
import { TierService } from './tier.service';
import { UserService } from './user.service';
import { ContainerService } from './container.service';

@Injectable()
export class DeploymentService {
  constructor(
    private readonly repoService: RepoService,
    private readonly dockerImageService: DockerImageService,
    private readonly tierService: TierService,
    private readonly userService: UserService,
    private readonly containerService: ContainerService,
  ) {}
  async createImage(repoId: string, nodeVersion: string): Promise<DockerImage> {
    try {
      const imageData = await this.repoService.cloneRepo(repoId);
      return this.dockerImageService.create(imageData, nodeVersion);
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
      const [repo, user] = await Promise.all([
        this.repoService.findById(repoId),
        this.userService.findById(userId),
      ]);

      // must be put in guard
      if (repo.userId !== userId)
        throw new UnauthorizedException('User does not own this repo');

      const [tier, image] = await Promise.all([
        this.tierService.findById(tierId),
        this.createImage(repoId, nodeVersion),
      ]);
      if (tier.price > user.balance)
        throw new BadRequestException('Insufficient balance');

      await this.userService.update(user.id, {
        balance: user.balance - tier.price,
      });

      const container = await this.containerService.create(image, tier);
      return container;
    } catch (error) {
      console.error(error);
    }
  }
  @Delete('container/:containerId')
  async deleteContainer(containerId: string): Promise<Container> {
    try {
      const container = await this.containerService.remove(containerId);
      return container;
    } catch (error) {
      console.error(error);
    }
  }
  async stopContainer(containerId: string): Promise<Container> {
    try {
      const container = await this.containerService.stopContainer(containerId);
      return container;
    } catch (error) {
      console.error(error);
    }
  }

  async resumeContainer(containerId: string): Promise<Container> {
    try {
      const container =
        await this.containerService.resumeContainer(containerId);
      return container;
    } catch (error) {
      console.error(error);
    }
  }
}
