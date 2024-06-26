import { Module } from '@nestjs/common';
import { EnvironmentController } from '../controllers/environment.controller';
import { EnvironmentService } from '../services/environment.service';
import { PrismaService } from 'src/prisma.service';
import { RepoModule } from './repo.module';

@Module({
  imports: [RepoModule],
  controllers: [EnvironmentController],
  providers: [EnvironmentService, PrismaService],
})
export class EnvironmentModule {}
