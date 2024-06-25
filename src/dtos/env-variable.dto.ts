import { IsString, IsArray, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

class EnvVariableDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateEnvVariablesDto {
  @IsMongoId()
  repoId: string;

  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  userId: string;  

  @IsString()
  event: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvVariableDto)
  variables: EnvVariableDto[];
}
