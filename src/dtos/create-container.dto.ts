import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DockerImage, Prisma, Tier } from '@prisma/client';

export class CreateContainerDto {
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dockerImageId: string;

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
  tierId: string;
  // tier: Tier;
}
