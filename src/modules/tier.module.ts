import { Module } from '@nestjs/common';
import { TierController } from 'src/controllers/tier.controller';
import { PrismaService } from 'src/prisma.service';
import { TierRepository } from 'src/repositories/tier.repository';
import { DockerService } from 'src/services/docker.service';
import { TierService } from 'src/services/tier.service';

@Module({
  controllers: [TierController],
  providers: [
    PrismaService,
    DockerService,
    TierService,
    {
      provide: 'ITierRepository',
      useClass: TierRepository,
    },
  ],
  exports: [TierService],
})
export class TierModule {}
