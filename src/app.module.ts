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
import { RepoModule } from './modules/repo.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    RepoModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController, AuthController, DockerController],
  providers: [PrismaService, AppService, AuthService, DockerService],
})
export class AppModule {}
