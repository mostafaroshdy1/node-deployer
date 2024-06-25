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
import { ContainersInitializerService } from './services/containers.initializer.service';
import { DashboardModule } from './modules/dashboard.module';
import { EnvironmentService } from './services/environment.service';
import { EnvironmentController } from './controllers/environment.controller';
import { EnvironmentModule } from './modules/environment.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnalyticsModule,
    AuthModule,
    RepoModule,
    UserModule,
    TierModule,
    RepoModule,
    DashboardModule,
    DeploymentModule,
    EnvironmentModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ]
  controllers: [AppController, AuthController, EnvironmentController],
  providers: [PrismaService, AppService, AuthService,EnvironmentService,ContainersInitializerService],

})
export class AppModule {}
