import { Tier } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface ITierRepository {
  findAll(): Promise<Tier[]>;
  findById(id: string): Promise<Tier | null>;
  create(data: Prisma.TierCreateInput): Promise<Tier>;
  update(id: string, data: Prisma.TierUpdateInput): Promise<Tier>;
  remove(id: string): Promise<Tier>;
}
