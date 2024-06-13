import { Role, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  provider: string;

  @ApiProperty()
  providerId: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  username : string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @Exclude()
  repos: any[];

  @Exclude()
  role: Role;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

}
