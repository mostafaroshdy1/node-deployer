import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEnvVariablesDto } from '../dtos/env-variable.dto';

@Injectable()
export class EnvironmentService {
  constructor(private prisma: PrismaService) {}

  async saveEnvironmentVariables(createEnvVariablesDto: CreateEnvVariablesDto) {
    const { repoId, name, url, userId, event, variables } = createEnvVariablesDto;

    const envVariables = JSON.stringify(
      variables.reduce((acc, variable) => {
        acc[variable.name] = variable.value;
        return acc;
      }, {})
    );

    return this.prisma.repo.create({
      data: {
        id: repoId,
        name: name,
        url: url,
        userId: userId,
        event: event,
        env: envVariables,
        createdAt: new Date(),
        updatedAt: new Date(), 
      },
    });
  }
}
