import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth.module';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { DockerController } from './controllers/docker.controller';
import { DockerService } from './services/docker.service';
import { DashboardModule } from './modules/dashboard.module';
import { EnvironmentService } from './services/environment.service';
import { EnvironmentController } from './controllers/environment.controller';
import { EnvironmentModule } from './modules/environment.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DashboardModule,
    EnvironmentModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController, AuthController, DockerController, EnvironmentController],
  providers: [PrismaService, AppService, AuthService, DockerService,EnvironmentService],
})
export class AppModule {}
