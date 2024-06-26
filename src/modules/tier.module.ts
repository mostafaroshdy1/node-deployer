import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TierRepository } from 'src/repositories/tier.repository';
import { DockerService } from 'src/services/docker.service';
import { TierService } from 'src/services/tier.service';

@Module({
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
