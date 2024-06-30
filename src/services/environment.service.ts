import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEnvVariablesDto } from '../dtos/env-variable.dto';
@Injectable()
export class EnvironmentService {
  constructor(private prisma: PrismaService) {}

  async saveEnvironmentVariables(
    createEnvVariablesDto: CreateEnvVariablesDto,
    userId: string,
  ) {
    console.log('User ID in service:', userId);
    const { repoId, name, url, event, variables, nodeVersion } = createEnvVariablesDto;

    const envVariables = JSON.stringify(
      variables.reduce((acc, variable) => {
        acc[variable.name] = variable.value;
        return acc;
      }, {}),
    );

    const existingRepo = await this.prisma.repo.findUnique({
      where: {
        repoId,
        userId,
      },
    });

    if (existingRepo) {
      const updatedRepo = await this.prisma.repo.update({
        where: {
          repoId,
        },
        data: {
          name,
          url,
          event,
          env: envVariables,
          nodeVersion,
          updatedAt: new Date(),
        },
      });
      return updatedRepo;
    } else {
      const newRepo = await this.prisma.repo.create({
        data: {
          repoId,
          name,
          url,
          userId,
          event,
          env: envVariables,
          nodeVersion,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return newRepo;
    }
  }
}
