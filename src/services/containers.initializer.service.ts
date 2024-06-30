import { Injectable, OnModuleInit } from '@nestjs/common';
import { ContainerService } from './container.service';

@Injectable()
export class ContainersInitializerService implements OnModuleInit {
  activeContainersIds: string[];
  constructor(private readonly containerService: ContainerService) {}

  async onModuleInit() {
    console.log('Resuming all active containers');
    this.activeContainersIds =
      await this.containerService.getAllActiveContainerIds();
    for (let i = 0; i < this.activeContainersIds.length; i++) {
      const containerId = this.activeContainersIds[i];
      // await this.containerService.resumeContainer(containerId);
    }
  }
}
