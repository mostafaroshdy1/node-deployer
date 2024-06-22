import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RepoModule } from './modules/repo.module';
import { TierModule } from './modules/tier.module';
import { DeploymentModule } from './modules/deployment.module';
import { AnalyticsModule } from './modules/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnalyticsModule,
    AuthModule,
    RepoModule,
    UserModule,
    TierModule,
    RepoModule,
    DeploymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
