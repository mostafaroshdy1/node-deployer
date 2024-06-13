import { Role, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @Exclude()
  role: Role;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

}
