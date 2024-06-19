import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Tier } from '@prisma/client';

export class CreateContainerDto {
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dockerImageId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  port: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  memory: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cpu: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tierId: string;

  tier: Tier;
  dockerImage: any;
}
