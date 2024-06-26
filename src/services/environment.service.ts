import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEnvVariablesDto } from '../dtos/env-variable.dto';
import { RepoService } from './repo.service';

@Injectable()
export class EnvironmentService {
  constructor(
    private prisma: PrismaService,
    private readonly repoService: RepoService,
  ) {}

  async saveEnvironmentVariables(
    createEnvVariablesDto: CreateEnvVariablesDto,
    userId: string,
  ) {
    console.log('User ID in service:', userId);
    const { repoId, name, url, event, variables } = createEnvVariablesDto;

    const envVariables = JSON.stringify(
      variables.reduce((acc, variable) => {
        acc[variable.name] = variable.value;
        return acc;
      }, {}),
    );

    const existingRepo = await this.prisma.repo.findUnique({
      where: {
        id: repoId,
        userId: userId,
      },
    });

    if (existingRepo) {
      const updatedRepo = await this.prisma.repo.update({
        where: {
          id: repoId,
        },
        data: {
          name: name,
          url: url,
          event: event,
          env: envVariables,
          updatedAt: new Date(),
        },
      });
      return updatedRepo;
    } else {
      const newRepo1 = await this.repoService.create({
        name: name,
        url: url,
        user: {
          connect: { id: userId },
        },
        event: event,
        env: envVariables,
      });

      return newRepo1;
    }
  }
}
