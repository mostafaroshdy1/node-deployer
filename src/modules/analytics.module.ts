import { Module } from '@nestjs/common';
import { AnalyticsController } from 'src/controllers/analytics.controller';
import { AnalyticsRepository } from 'src/repositories/analytics.repository';
import { AnalyticsService } from 'src/services/analytics.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from 'src/services/tasks.service';
import { ContainerModule } from './container.module';
import { DockerService } from 'src/services/docker.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ContainerModule,
  ],
  controllers: [AnalyticsController],
  providers: [
    {
      provide: 'IAnalyticsRepository',
      useClass: AnalyticsRepository,
    },
    AnalyticsService,
    TasksService,
    DockerService,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
