import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth.module';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { DockerController } from './controllers/docker.controller';
import { DockerService } from './services/docker.service';
import { RepoModule } from './modules/repo.module';
import { AuthService } from './services/auth.service';
import { DeploymentController } from './controllers/deployment.controller';
import { DeploymentService } from './services/deployment.service';
import { RepoService } from './services/repo.service';
import { RepoRepository } from './repositories/repo.repository';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RepoModule,
  ],
  controllers: [
    AppController,
    AuthController,
    DockerController,
    DeploymentController,
  ],
  providers: [
    PrismaService,
    AppService,
    AuthService,
    DockerService,
    DeploymentService,
    RepoService,
    {
      provide: 'IRepoRepository',
      useClass: RepoRepository,
    },
  ],
})
export class AppModule {}
