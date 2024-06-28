import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user.module';
import { TierModule } from './tier.module';
import { RepoModule } from './repo.module';
import { DeploymentService } from 'src/services/deployment.service';
import { DeploymentController } from 'src/controllers/deployment.controller';
import { DashboardModule } from './dashboard.module';

@Module({
  imports: [UserModule, TierModule, RepoModule, DashboardModule],
  controllers: [DeploymentController],
  providers: [DeploymentService],
  exports: [DeploymentService],
})
export class DeploymentModule {}
