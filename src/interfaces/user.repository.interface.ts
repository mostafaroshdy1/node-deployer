import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';

export interface UserRepositoryInterface {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  remove(id: string): Promise<User>;
}
