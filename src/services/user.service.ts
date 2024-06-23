import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { IUserRepository } from 'src/interfaces/user-repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmailAndProvider(email: string, provider: string): Promise<User | null> {
    return this.userRepository.findByEmailAndProvider(email, provider);
  }

  async create(data: CreateUserDto): Promise<User> {
    const foundUser = await this.findByEmailAndProvider(data.email, data.provider);
    if (foundUser) {
      throw new BadRequestException('Email already exists for this provider');
    }
    return this.userRepository.create(data);
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    const foundUser = await this.findById(id);
    if (!foundUser) {
      throw new BadRequestException('User not found');
    }
    return this.userRepository.update(id, data);
  }

  async remove(id: string): Promise<User> {
    return this.userRepository.remove(id);
  }
}
