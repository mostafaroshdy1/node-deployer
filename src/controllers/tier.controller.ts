import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { CreateTierDto } from '../dtos/create-tier.dto';
import { TierService } from '../services/tier.service';
import { Tier } from '@prisma/client';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('tiers')
export class TierController {
  constructor(private readonly tierService: TierService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request,
    @Body() createTierDto: CreateTierDto,
    @Req() guardReq: CustomRequest,
  ): Promise<Tier> {
    const { userId } = guardReq;
    console.log('tier ' + guardReq.userId);
    console.log('tier ' + guardReq.accessToken);
    console.log('tier ' + userId);
    return this.tierService.create(createTierDto, userId);
  }

  @Get()
  async find(
  ): Promise<Tier[]> {
    return this.tierService.findAll();
  };
}
