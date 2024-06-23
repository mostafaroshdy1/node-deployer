import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { AnalyticsService } from './analytics.service';
import { ContainerService } from './container.service';

@Injectable()
export class TasksService implements OnModuleInit {
  private activeContainersIds: string[];
  private currentPage: number;
  private batchNumber: number;
  private numberOfActiveContainers: number;
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly containerService: ContainerService,
  ) {}

  async onModuleInit() {
    this.numberOfActiveContainers =
      await this.containerService.countActiveContainers();
    this.currentPage = 0;
    this.batchNumber =
      Math.ceil(this.numberOfActiveContainers / (5 * 60)) <= 0
        ? 1
        : Math.ceil(this.numberOfActiveContainers / (5 * 60));
  }

  @Cron('45 * * * * *')
  handleCron() {
    console.log('heho');
  }

  @Cron(CronExpression.EVERY_SECOND)
  async logContainersUsage() {
    await this.analyticsService.containersDispatcher(
      this.currentPage,
      this.batchNumber,
    );
    if (this.currentPage * this.batchNumber >= this.numberOfActiveContainers) {
      this.currentPage = 0;
      return;
    }
    this.currentPage++;
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async updateNumberOfActiveContainers() {
    this.numberOfActiveContainers =
      await this.containerService.countActiveContainers();

    this.batchNumber =
      Math.ceil(this.numberOfActiveContainers / (5 * 60)) <= 0
        ? 1
        : Math.ceil(this.numberOfActiveContainers / (5 * 60));
  }
}
