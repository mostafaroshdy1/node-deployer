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

    const existingRepo = await this.prisma.repo.findFirst({
      where: {
        repoId,
        userId,
      },
    });

    if (existingRepo) {
      const updatedRepo = await this.prisma.repo.update({
        where: {
          id: existingRepo.id,
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

  async getEnvironmentVariables(repoId: string, userId: string) {
    const existingRepo = await this.prisma.repo.findFirst({
      where: {
        repoId,
        userId,
      },
    });

    if (existingRepo) {
      const variables = JSON.parse(existingRepo.env);
      return {
        repoId: existingRepo.repoId,
        name: existingRepo.name,
        url: existingRepo.url,
        event: existingRepo.event,
        variables: Object.keys(variables).map(key => ({
          name: key,
          value: variables[key],
        })),
        nodeVersion: existingRepo.nodeVersion,
      };
    }

    return null;
  }
}
