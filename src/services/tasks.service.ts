import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { AnalyticsService } from './analytics.service';
import { ContainerService } from './container.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class TasksService implements OnModuleInit {
  private currentPage: number;
  private batchNumber: number;
  private numberOfActiveContainers: number;
  constructor(
    private readonly containerService: ContainerService,
    @InjectQueue('analytics') private readonly analyticsQueue: Queue,
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

  // @Cron(CronExpression.EVERY_SECOND)
  async logContainersUsage() {
    try {
      await this.analyticsQueue.add('handleContainerLogging', {
        currentPage: this.currentPage,
        batchNumber: this.batchNumber,
      });
    } catch (error) {
      console.log(error);
    }

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
