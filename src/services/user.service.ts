import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '@prisma/client';
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

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(data: CreateUserDto): Promise<User> {
    const foundUser = await this.findByEmail(data.email);
    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }
    return this.userRepository.create(data);
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const foundUser = await this.findById(id);
    delete foundUser.id;
    return this.userRepository.update(id, { ...foundUser, ...data });
  }

  async remove(id: string): Promise<User> {
    return this.userRepository.remove(id);
  }
}
