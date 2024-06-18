import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContainerDto {
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
}
