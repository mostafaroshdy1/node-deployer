import { Inject, Injectable } from '@nestjs/common';
import { IAnalyticsRepository } from 'src/interfaces/analytics.repository.interface';
import { ContainerService } from './container.service';
import { DockerService } from './docker.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject('IAnalyticsRepository')
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly containerService: ContainerService,
    private readonly dockerService: DockerService,
  ) {}

  async logResourceUsage(
    containerId: string,
    cpuUsage: number,
    memoryUsage: number,
  ): Promise<void> {
    await this.analyticsRepository.writeResourceUsage(
      containerId,
      cpuUsage,
      memoryUsage,
    );
  }
  async getResourceUsage(
    containerId: string,
    start: string,
    stop: string,
  ): Promise<any[]> {
    return await this.analyticsRepository.queryResourceUsage(
      containerId,
      start,
      stop,
    );
  }

  ActiveContainersIds(): Promise<string[]> {
    return this.containerService.getAllActiveContainerIds();
  }
  async containersLogger(containersIds: string[]): Promise<void> {
    for (let i = 0; i < containersIds.length; i++) {
      const containerId = containersIds[i];
      const cpu = await this.containerService.getContainerCpu(containerId);
      const [cpuUsage, memoryUsage] = await Promise.all([
        this.dockerService.logCpuUsage(containerId, cpu),
        this.dockerService.logMemoryUsage(containerId),
      ]);

      await this.logResourceUsage(
        containerId,
        parseInt(cpuUsage),
        parseInt(memoryUsage),
      );
    }
  }

  async containersDispatcher(
    currentPage: number,
    batchNumber: number,
  ): Promise<void> {
    const containers = await this.containerService.findWithPagination(
      { status: 'up' },
      batchNumber * currentPage,
      batchNumber,
    );
    const containersIds = containers.map((container) => container.id);
    this.containersLogger(containersIds);
  }
  async getResourceUsageByInterval(containerId: string, interval: string): Promise<any[]> {
    let start: string;
    let stop: string;

    switch (interval) {
      case 'lastHour':
        start = '-1h';
        stop = 'now()';
        break;
      case 'lastDay':
        start = '-1d';
        stop = 'now()';
        break;
      case 'lastWeek':
        start = '-1w';
        stop = 'now()';
        break;
      case 'lastMonth':
        start = '-30d';
        stop = 'now()';
        break;
      default:
        throw new Error('Invalid interval');
    }

    return await this.analyticsRepository.queryResourceUsage(containerId, start, stop);
  }
}
