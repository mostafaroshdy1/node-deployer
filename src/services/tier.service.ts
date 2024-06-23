import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma, Tier } from '@prisma/client';
import { ITierRepository } from 'src/interfaces/tier.repository.interface';

@Injectable()
export class TierService {
  constructor(
    @Inject('ITierRepository')
    private readonly tierRepository: ITierRepository,
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
}
