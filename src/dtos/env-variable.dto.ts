import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EnvVariableDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateEnvVariablesDto {
  @IsString()
  repoId: string;

  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  event: string;
  
  @IsString()
  nodeVersion: string;
  


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvVariableDto)
  variables: EnvVariableDto[];
}
