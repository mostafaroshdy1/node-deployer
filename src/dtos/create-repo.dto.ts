import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRepoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  event: string;

  @ApiProperty()
  @IsString()
  env: string;
}
