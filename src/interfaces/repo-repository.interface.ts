import { Repo } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface IRepoRepository {
  findAll(): Promise<Repo[]>;
  findById(id: string): Promise<Repo | null>;
  create(data: Prisma.RepoCreateInput): Promise<Repo>;
  update(id: string, data: Prisma.RepoUpdateInput): Promise<Repo>;
  remove(id: string): Promise<Repo>;
}
