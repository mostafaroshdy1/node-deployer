import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AnalyticsService } from 'src/services/analytics.service';

@Processor('analytics')
export class AnalyticsProcessor {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Process('handleContainerLogging')
  async handleContainerLogging(job: Job) {
    const { currentPage, batchNumber } = job.data;
    try {
      await this.analyticsService.containersDispatcher(
        currentPage,
        batchNumber,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
