import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { ContainerService } from 'src/services/container.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}


  @Get('usage')
  async getResourceUsage(
    @Query('containerId') containerId: string,
    @Query('start') start: string,
    @Query('stop') stop: string,
  ) {
    return await this.analyticsService.getResourceUsage(
      containerId,
      start,
      stop,
    );
  }
}
