import {
  Controller,
  Req,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { EnvironmentService } from '../services/environment.service';
import { DeploymentService } from '../services/deployment.service';
import { CreateEnvVariablesDto } from '../dtos/env-variable.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Controller('environment')
@UseGuards(JwtAuthGuard)
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Post()
  async saveEnvironmentVariables(
    @Body() createEnvVariablesDto: CreateEnvVariablesDto,
    @Req() req: CustomRequest,
  ) {
    if (!Array.isArray(createEnvVariablesDto.variables)) {
      throw new BadRequestException('Variables must be provided as an array.');
    }

    const userId = req.userId;
    console.log('User ID in controller:', userId);
    if (!userId) {
      throw new BadRequestException('User ID not found in the request.');
    }

    return this.environmentService.saveEnvironmentVariables(
      createEnvVariablesDto,
      userId,
    );
  }

  @Get(':repoId')
  async getEnvironmentVariables(
    @Param('repoId') repoId: string,
    @Req() req: CustomRequest,
  ) {
    const userId = req.userId;
    if (!userId) {
      throw new BadRequestException('User ID not found in the request.');
    }

    return this.environmentService.getEnvironmentVariables(repoId, userId);
  }
}
