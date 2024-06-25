import {
  Controller,
  Req,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { EnvironmentService } from '../services/environment.service';
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
}
