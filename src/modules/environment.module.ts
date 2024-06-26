import { Module } from '@nestjs/common';
import { EnvironmentController } from '../controllers/environment.controller';
import { EnvironmentService } from '../services/environment.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EnvironmentController],
  providers: [EnvironmentService,PrismaService],
})
export class EnvironmentModule {}