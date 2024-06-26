import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { TierModule } from './tier.module';
import { RepoModule } from './repo.module';
import { DeploymentService } from 'src/services/deployment.service';
import { DeploymentController } from 'src/controllers/deployment.controller';

@Module({
  imports: [UserModule, TierModule, RepoModule],
  controllers: [DeploymentController],
  providers: [DeploymentService],
  exports: [DeploymentService],
})
export class DeploymentModule {}
