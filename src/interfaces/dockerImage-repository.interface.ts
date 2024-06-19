import { DockerImage } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface IDockerImageRepository {
  findAll(): Promise<DockerImage[]>;
  findById(id: string): Promise<DockerImage | null>;
  create(repoId: string, id: string): Promise<DockerImage>;
  update(id: string, data: Prisma.DockerImageUpdateInput): Promise<DockerImage>;
  remove(id: string): Promise<DockerImage>;
  removeByRepoId(repoId: string): Promise<DockerImage>;
}
