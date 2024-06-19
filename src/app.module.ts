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

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RepoModule,
  ],
  controllers: [AppController, AuthController, DockerController],
  providers: [PrismaService, AppService, DockerService],
})
export class AppModule {}
