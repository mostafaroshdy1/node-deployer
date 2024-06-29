import { Module } from '@nestjs/common';
import { DashboardController } from 'src/controllers/dashboard.controller';
import { DashboardService } from 'src/services/dashboard.service';
import { RepoModule } from './repo.module';

@Module({
  imports: [RepoModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
