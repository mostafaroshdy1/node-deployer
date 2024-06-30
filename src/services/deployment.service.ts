import {
  BadRequestException,
  Delete,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RepoService } from './repo.service';
import {
  Container,
  DockerImage,
  Prisma,
  Repo,
  Tier,
  User,
} from '@prisma/client';
import { DockerImageService } from './dockerImage.service';
import { TierService } from './tier.service';
import { UserService } from './user.service';
import { ContainerService } from './container.service';
import { Observer } from 'src/interfaces/observer.interface';
import { DashboardService } from './dashboard.service';

@Injectable()
export class DeploymentService implements Observer {
  constructor(
    private readonly repoService: RepoService,
    private readonly dockerImageService: DockerImageService,
    private readonly tierService: TierService,
    private readonly userService: UserService,
    private readonly containerService: ContainerService,
    private readonly dashboardService: DashboardService,
  ) {
    this.dashboardService.addObserver(this);
  }
  async createImage(
    repo: Repo,
    userId: string,
    nodeVersion: string,
  ): Promise<DockerImage> {
    try {
      const imageData = await this.repoService.cloneRepo(repo, userId);
      return this.dockerImageService.create(imageData, nodeVersion);
    } catch (error) {
      console.error(error);
    }
  }

  async deploy(
    repoId: string,
    userId: string,
    tierId: string,
  ): Promise<Container> {
    let repo: Repo, user: User, tier: Tier;
    // console.log('heeeeeeeeeeeeeeeeeeeeeee', repoId);
    try {
      [repo, user, tier] = await Promise.all([
        this.repoService.findById(repoId),
        this.userService.findById(userId),
        this.tierService.findById(tierId),
      ]);
      console.log(repo);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Invalid repo or user or tier');
    }

    // Must be put in guard
    if (repo.userId !== userId)
      throw new UnauthorizedException('User does not own this repo');

    const [image] = await Promise.all([
      this.createImage(repo, userId, repo.nodeVersion),
    ]);

    if (tier.price > user.balance)
      throw new BadRequestException('Insufficient balance');

    try {
      await this.userService.update(user.id, {
        balance: user.balance - tier.price,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error in updating user balance');
    }

    try {
      const container = await this.containerService.create(image, tier);
      return container;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error in creating container');
    }
  }

  async redeploy(repoId: string, userId: string): Promise<Container[]> {
    try {
      const repo = await this.repoService.findById(repoId);
      const nodeVersion = repo.nodeVersion;
      const image = await this.dockerImageService.findByRepoId(repoId);
      const containers = await this.containerService.findByImageId(image.id);
      //i want to loop on containers and save ip, port , tierId and status and then delete them
      if (repo.userId !== userId)
        throw new UnauthorizedException('User does not own this repo');
      const containersData = containers.map((container) => {
        return {
          ip: container.ip,
          port: container.port,
          tierId: container.tierId,
        };
      });
      await this.containerService.removeByImageId(image.id);
      await this.dockerImageService.remove(image.id);
      const newImage = await this.createImage(repo, userId, nodeVersion);
      const newContainers = await Promise.all(
        containersData.map(async (containerData) => {
          const tier = await this.tierService.findById(containerData.tierId);
          return this.containerService.create(
            newImage,
            tier,
            containerData.ip,
            containerData.port,
          );
        }),
      );
      return newContainers;
    } catch (error) {
      console.error(error);
    }
  }

  async findAllContainersByUserId(userId: string): Promise<
    Array<
      Prisma.RepoGetPayload<{
        include: {
          dockerImage: { include: { Containers: { include: { tier: true } } } };
        };
      }>
    >
  > {
    return this.repoService.findWhere({ userId });
  }
  async update(repoUrl: string): Promise<void> {
    try {
      const foundRepo = await this.repoService.findWhere({
        url: repoUrl + '.git',
      });
      const { userId, id } = foundRepo[0];
      await this.redeploy(id, userId);
    } catch (error) {
      console.error(error);
    }
  }
}
