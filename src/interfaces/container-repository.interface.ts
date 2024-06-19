import { Container } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface IContainerRepository {
  findAll(): Promise<Container[]>;
  findById(id: string): Promise<Container | null>;
  create(data: Prisma.ContainerCreateInput): Promise<Container>;
  update(id: string, data: Prisma.ContainerUpdateInput): Promise<Container>;
  remove(id: string): Promise<Container>;
  removeByImageId(imageId: string): Promise<Prisma.BatchPayload>;
  findByImageId(imageId: string): Promise<Container[]>;
}
