import { DockerImage } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface IDockerImageRepository {
  findAll(): Promise<DockerImage[]>;
  findById(id: string): Promise<DockerImage | null>;
  create(data: Prisma.DockerImageCreateInput): Promise<DockerImage>;
  update(id: string, data: Prisma.DockerImageUpdateInput): Promise<DockerImage>;
  remove(id: string): Promise<DockerImage>;
}
