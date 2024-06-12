import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRepositoryInterface } from 'src/interfaces/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
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
    const { password } = data;
    data.password = await this.hashPassword(password);
    return this.userRepository.create(data);
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const { password } = data;
    if (password) data.password = await this.hashPassword(password);
    return this.userRepository.update(id, data);
  }

  async remove(id: string): Promise<User> {
    return this.userRepository.remove(id);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = parseInt(process.env.BCRYPT_SALT);
    return bcrypt.hash(password, salt);
  }
}
