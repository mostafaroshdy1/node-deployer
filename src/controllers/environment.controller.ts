import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EnvironmentService } from '../services/environment.service';
import { CreateEnvVariablesDto } from '../dtos/env-variable.dto';

@Controller('environment')
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Post()
  async saveEnvironmentVariables(@Body() createEnvVariablesDto: CreateEnvVariablesDto) {
    if (!Array.isArray(createEnvVariablesDto.variables)) {
      throw new BadRequestException('Variables must be provided as an array.');
    }

    return this.environmentService.saveEnvironmentVariables(createEnvVariablesDto);
  }
}
