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
  async redeploy(repoId:string,userId:String):Promise<Container[]>{
    try{
      const repo=await this.repoService.findById(repoId);
      const nodeVersion=repo.nodeVersion;
      const image=await this.dockerImageService.findByRepoId(repoId);
      const containers=await this.containerService.findByImageId(image.id);
      //i want to loop on containers and save ip, port , tierId and status and then delete them
      if (repo.userId !== userId)
        throw new UnauthorizedException('User does not own this repo');
      const containersData=containers.map(container=>{
        return {
          ip:container.ip,
          port:container.port,
          tierId:container.tierId,
        }
      })
      await this.containerService.removeByImageId(image.id);
      await this.dockerImageService.remove(image.id);
      const newImage=await this.createImage(repoId,nodeVersion);
      const newContainers=await Promise.all(containersData.map(async containerData=>{
        const tier=await this.tierService.findById(containerData.tierId);
        return this.containerService.create(newImage,tier,containerData.ip,containerData.port)
      })
      )
      return newContainers;
    }
    catch(error){
      console.error(error)
    }
  }
}
