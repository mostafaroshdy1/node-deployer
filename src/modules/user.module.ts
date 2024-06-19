import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from 'src/repositories/user.repository';
import { IUserRepository } from 'src/interfaces/user-repository.interface';
import { DockerImageRepository } from 'src/repositories/dockerImage.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
