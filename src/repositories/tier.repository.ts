import { Injectable } from '@nestjs/common';
import { Prisma, Tier } from '@prisma/client';
import { ITierRepository } from 'src/interfaces/tier.repository.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TierRepository implements ITierRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Tier[]> {
    return this.prisma.tier.findMany();
  }

  findById(id: string): Promise<Tier | null> {
    return this.prisma.tier.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.TierCreateInput): Promise<Tier> {
    return this.prisma.tier.create({
      data,
    });
  }

  update(id: string, data: Prisma.TierUpdateInput): Promise<Tier> {
    return this.prisma.tier.update({
      where: { id },
      data,
    });
  }

  remove(id: string): Promise<Tier> {
    return this.prisma.tier.delete({
      where: { id },
    });
  }
}
