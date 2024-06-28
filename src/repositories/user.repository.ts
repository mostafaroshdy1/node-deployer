import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { IUserRepository } from 'src/interfaces/user-repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmailAndProvider(
    email: string,
    provider: string,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email_provider: {
          email,
          provider,
        },
      },
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
  findWhere(data: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({ where: data });
  }
}
