import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma, Tier } from '@prisma/client';
import { CreateTierDto } from 'src/dtos/create-tier.dto';
import { ITierRepository } from 'src/interfaces/tier.repository.interface';
import { PrismaService } from 'src/prisma.service';  

@Injectable()
export class TierService {
  constructor(
    @Inject('ITierRepository')
    private readonly tierRepository: ITierRepository,
    private readonly prisma: PrismaService  
  ) {}

  findAll(): Promise<Tier[]> {
    return this.tierRepository.findAll();
  }

  findById(id: string): Promise<Tier | null> {
    return this.tierRepository.findById(id);
  }

  async update(id: string, data: Prisma.TierUpdateInput): Promise<Tier> {
    try {
      return await this.tierRepository.update(id, data);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Tier not found');
    }
  }

  async remove(id: string): Promise<Tier> {
    try {
      return await this.tierRepository.remove(id);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Tier not found');
    }
  }

  async create(data: CreateTierDto, userId:string): Promise<Tier> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.balance < data.price) {
        console.log('Insufficient balance');
        throw new BadRequestException('Insufficient balance');
      }

      const tierData: Prisma.TierCreateInput = {
        name: data.name,
        price: data.price,
        cpu: data.cpu,
        memory: data.memory,
      };

      return await this.tierRepository.create(tierData);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Tier creation failed');
    }
  }
}
