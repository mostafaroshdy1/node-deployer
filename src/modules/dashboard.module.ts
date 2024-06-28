import { Module } from '@nestjs/common';
import { DashboardController } from 'src/controllers/dashboard.controller';
import { DashboardService } from 'src/services/dashboard.service';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { TokenInterceptor } from 'src/common/interceptors/tokenRefresh.interceptor';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService, TokenInterceptor],
})
export class DashboardModule {}
