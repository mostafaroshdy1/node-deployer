import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { plainToClass, plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({ type: UserEntity })
  @ApiTags('user')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.create(createUserDto);
    return plainToClass(UserEntity, createdUser);
  }

  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiTags('user')
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return plainToInstance(UserEntity, users);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiTags('user')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return plainToClass(UserEntity, user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiTags('user')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return plainToClass(UserEntity, user);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException(`Failed to update user with id ${id}`);
    }
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiTags('user')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteUser = await this.userService.remove(id).catch(() => {
      throw new BadRequestException('User not found');
    });
    return plainToClass(UserEntity, deleteUser);
  }
}
